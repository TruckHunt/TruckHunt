const Search = require('./models/search.js');
const MenuItems = require('./models/menuItems.js');
const utils = require('./utils.js');
const Orders = require('./models/orders.js');
const convertOrderItemsToOrder = require('./utils.js').convertOrderItemsToOrder;

module.exports.search = (req, res) => {
  const timeAsNum = utils.convertTimeToNumber(req.body.date.time);
  Search.scheduleData(timeAsNum, req.body.date.dayOfWeek)
    .then((response) => {
      const newArr = [];
      for (let i = 0; i < response.length; i++) {
        const tempItem = response[i];
        tempItem.coordinates = JSON.parse(tempItem.coordinates);
        newArr.push(tempItem);
      }
      return newArr;
    })
    .then((newArr) => res.send(newArr))
    .catch((error) => res.send(error));
};

module.exports.menu = (req, res) => {
  const defaultFoodCategory = 'Cold Truck: Pre-packaged sandwiches: snacks: fruit: various beverages';
  MenuItems.foodCategories()
    .then((foodCategories) => {
      console.log('body food category', req.body.food_category);
      let found = false;
      for (let i = 0; i < foodCategories.length; i++) {
        if (foodCategories[i].food_category === req.body.food_category) {
          found = true;
        }
      }
      if (found) {
        return true;
      }
      return false;
    })
    .then((found) => {
      // console.log('found', found);
      if (found) {
        return MenuItems.menuData(req.body.food_category);
      }
      return MenuItems.menuData(defaultFoodCategory);
    })
    .then((menu) => {
      // console.log('menu', menu);
      const foodCategories = [];
      const menuItems = {};
      for (let i = 0; i < menu.length; i++) {
        const course = menu[i].course;
        if (!menuItems[course]) {
          foodCategories.push(menu[i].course);
          menuItems[course] = [menu[i]];
        } else {
          menuItems[course].push(menu[i]);
        }
      }
      for (let j = 0; j < foodCategories.length; j++) {
        let course = {};
        course.title = foodCategories[j];
        course.items = menuItems[foodCategories[j]];
        foodCategories[j] = course;
        course = {};
      }
      res.send(foodCategories);
    })
    .catch((error) => {
      // console.log('error here', error);
      res.send(error);
    });
};

module.exports.vendorSignup = require('./routes/vendorSignup.js');

module.exports.vendorLogin = require('./routes/vendorLogin.js');

module.exports.userLogin = require('./routes/userLogin.js');

module.exports.userSignup = require('./routes/userSignup.js');

module.exports.authenticate = require('./routes/stripeAuthorization.js');

module.exports.stripe = require('./routes/stripeCallback.js');

module.exports.checkout = require('./routes/checkout.js');


module.exports.vendorIncomingOrders = require('./routes/vendorIncomingOrders.js');
// module.exports.vendorIncomingOrders = (req, res) => {
//   console.log('body: ', req.body);
//   // res.send(orderingData.VendorOrders);
//   const fakeData = [
//     {
//       order_id: 1,
//       order_time: '2017-04-24 16:15:17.816122-07',
//       customer_email: 'matt@gmail.com',
//       price_total: 7000,
//       order_status: 0, // 0 = on time, 1 = delayed, 2 = ready for pickup
//       items: [{ menu_item_id: 14, name: 'kale salad', price: 2000, quantity: 4, item_note: 'no goat cheese' },
//       { menu_item_id: 15, name: 'cheeseburger', price: 5000, quantity: 2, item_note: 'add cado' }]
//     },
//     {
//       order_id: 2,
//       order_time: '2017-04-24 16:17:13.816122-07',
//       customer_email: 'sam@gmail.com',
//       price_total: 6000,
//       order_status: 1, // 0 = on time, 1 = delayed, 2 = ready for pickup
//       items:
//       [{ menu_item_id: 14, name: 'eggs and ham', price: 2000, quantity: 2, item_note: 'no onions' },
//       { menu_item_id: 15, name: 'chicken sando', price: 4000, quantity: 1, item_note: 'add extra cado' }]
//     },
//     {
//       order_id: 3,
//       order_time: '2017-04-24 16:18:17.816122-07',
//       customer_email: 'mike@gmail.com',
//       price_total: 7000,
//       order_status: 0, // 0 = on time, 1 = delayed, 2 = ready for pickup
//       items: [{ menu_item_id: 13, name: 'hotty totties', price: 10000, quantity: 8, item_note: 'extra shot' },
//       { menu_item_id: 18, name: 'mango jangos', price: 5000, quantity: 2, item_note: 'add cado' }]
//     },
//     {
//       order_id: 4,
//       order_time: '2017-04-24 16:20:13.816122-07',
//       customer_email: 'benicci@gmail.com',
//       price_total: 2000,
//       order_status: 2, // 0 = on time, 1 = delayed, 2 = ready for pickup
//       items: [{ menu_item_id: 14, name: 'coconut struddle', price: 3000, quantity: 1, item_note: 'napkins please' },
//       { menu_item_id: 15, name: 'pizza', price: 1000, quantity: 1, item_note: 'add pepperoni and pinapples' }]
//     }
//   ];
//   console.log('fakeData', fakeData);
//   res.send(fakeData);
// };

module.exports.orderStatus = (req, res) => {
  const orderStatus = req.body.orderStatus;
  const orderID = req.body.orderID;

  console.log('gettin BODY HERE________________', req.body);
  // console.log('gettin hotter', req.body.orderStatus);
  // console.log('gettin hotter', req.body.orderID);

  if (orderStatus === 'READY') {
    return Orders.updateStatus(orderID, 2)
      .then((response) => {
        console.log('response yeah looking for vendoriID 2)', response);
        return Orders.getIncomingOrderItems(response.vendor_id);
      })
      .then(orderItems => {
        const orders = convertOrderItemsToOrder(orderItems);
        console.log('2----------------orders: ', JSON.stringify(orders));
        res.status(200).send(orders);
      })
      .catch(err => {
        console.log('error getting orders', err);
        res.sendStatus(404);
      });
  } else if (orderStatus === 'DELAYED') {
    return Orders.updateStatus(orderID, 1)
      .then((response) => {
        console.log('response yeah looking for vendoriID 1)', response);
        return Orders.getIncomingOrderItems(response.vendor_id);
      })
      .then(orderItems => {
        const orders = convertOrderItemsToOrder(orderItems);
        console.log('1----------------orders: ', JSON.stringify(orders));
        res.status(200).send(orders);
      })
      .catch(err => {
        console.log('error getting orders', err);
        res.sendStatus(404);
      });
  } else if (orderStatus === 'ONTIME') {
    return Orders.updateStatus(orderID, 0)
      .then((response) => {
        console.log('response yeah looking for vendoriID 0)', response);
        return Orders.getIncomingOrderItems(response.vendor_id);
      })
      .then(orderItems => {
        const orders = convertOrderItemsToOrder(orderItems);
        console.log('0----------------orders: ', JSON.stringify(orders));
        res.status(200).send(orders);
      })
      .catch(err => {
        console.log('error getting orders', err);
        res.sendStatus(404);
      });
  } else if (orderStatus === 'COMPLETE') {
    return Orders.updateStatus(orderID, 3)
      .then((response) => {
        console.log('response yeah looking for vendoriID 3)', response);
        return Orders.getIncomingOrderItems(response.vendor_id);
      })
      .then(orderItems => {
        const orders = convertOrderItemsToOrder(orderItems);
        console.log('3----------------orders: ', JSON.stringify(orders));
        res.status(200).send(orders);
      })
      .catch(err => {
        console.log('error getting orders', err);
        res.sendStatus(404);
      });
  }
  return res.send(400);
};

