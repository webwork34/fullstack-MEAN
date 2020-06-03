const moment = require('moment');
const Order = require('./../models/Order');
const errorHandler = require('./../utils/errorHandler');

module.exports.overview = async function(req, res){
  try {
    // получим список всех заказов, которые есть в системе
    const allOrders = await Order.find({user: req.user.id}).sort({date: 1});
    // полуим кол-во дней, в которые были заказы
    const ordersMap = getOrdersMap(allOrders);
    // получим список всех заказов, которые были вчера
    const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || [];
    // кол-во заказов вчера
    const yesterdayOrdersNumber = yesterdayOrders.length;

    // кол-во заказов
    const totalOrdersNumber = allOrders.length;
    // кол-во дней
    const daysNumber = Object.keys(ordersMap).length;
    // кол-во заказов в день
    const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0);
    
    // ((кол-во заказов вчера / кол-во заказов в день) - 1) * 100
    // % для кол-ва заказов
    const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2);
    // общая выручка
    const totalGain = calculatePrice(allOrders);
    // выручка в день
    const gainPerDay = totalGain / daysNumber;
    // выручка за вчера
    const yesterdayGain = calculatePrice(yesterdayOrders);
    // % выручки
    const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2);
    // сравнение выручки
    const compareGain = (yesterdayGain - gainPerDay).toFixed(2);
    // сравнение кол-ва заказов
    const compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2);

    res.status(200).json({
      gain: {
        percent: Math.abs(+gainPercent),
        compare: Math.abs(+compareGain),
        yesterday: +yesterdayGain,
        isHigher: +gainPercent > 0
      },
      orders: {
        percent: Math.abs(+ordersPercent),
        compare: Math.abs(+compareNumber),
        yesterday: +yesterdayOrdersNumber,
        isHigher: +ordersPercent > 0
      }
    });

  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.analytics = async function(req, res){
  try {
    // получим все заказы
    const allOrders = await Order.find({user: req.user.id}).sort({date: 1});
    // получим карту всех заказов
    const ordersMap = getOrdersMap(allOrders);

    // подсчитаем средний чек для всех заказов
    const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2);

    // сформируем обьект, где будут храниться данные для графиков
    const chart = Object.keys(ordersMap).map(label => {
      // пример label = 03.06.2020
      // подсчитаем кол-во заказов и выручку
      const gain = calculatePrice(ordersMap[label]);
      const order = ordersMap[label].length;
      return {label, gain, order};
    });


    res.status(200).json({average, chart});
  } catch (error) {
    errorHandler(res, error);
  }
};

function getOrdersMap(orders = []) {
  const daysOrder = {};
  orders.forEach(order => {
    const date = moment(order.date).format('DD.MM.YYYY');

    if (date === moment().format('DD.MM.YYYY')) {
      return;
    }

    if (!daysOrder[date]) {
      daysOrder[date] = [];
    }

    daysOrder[date].push(order);
  });

  return daysOrder;
}

function calculatePrice(orders = []) {
  return orders.reduce((total, order) => {
    const orderPrice = order.list.reduce((orderTotal, item) => {
      return orderTotal += item.cost * item.quantity;
    }, 0);
    return total += orderPrice;
  }, 0);
}