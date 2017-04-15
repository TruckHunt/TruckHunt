module.exports = (db) => {
  return db.query('CREATE TABLE IF NOT EXISTS vendors(\
    vendor_id SERIAL PRIMARY KEY,\
    permit_number VARCHAR(20) NOT NULL,\
    email VARCHAR(30) NOT NULL UNIQUE,\
    phone_number VARCHAR(20) NOT NULL,\
    first_name VARCHAR(20) NOT NULL,\
    last_name VARCHAR(20) NOT NULL,\
    food_categories VARCHAR(100),\
    password VARCHAR(200) NOT NULL,\
    salt VARCHAR(40),\
    created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP\
    );')
  .then(() => {
    return db.query('CREATE TABLE IF NOT EXISTS customers(\
      customer_id SERIAL PRIMARY KEY,\
      email VARCHAR(50) NOT NULL UNIQUE,\
      stripe_id INT,\
      username VARCHAR(30) NOT NULL,\
      password VARCHAR(255) NOT NULL,\
      salt VARCHAR(40),\
      created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP\
      );');
  })
  .then(() => {
    return db.query('CREATE TABLE IF NOT EXISTS reviews(\
      review_id SERIAL PRIMARY KEY,\
      customer_id INT NOT NULL,\
      vendor_id INT NOT NULL,\
      rating SMALLINT NOT NULL,\
      review VARCHAR(500) NOT NULL\
      );');
  })
  .then(() => {
    return db.query('CREATE TABLE IF NOT EXISTS menu_items(\
      menu_item_id SERIAL PRIMARY KEY,\
      vendor_id INT,\
      name VARCHAR(100) NOT NULL,\
      course VARCHAR(100),\
      food_categories VARCHAR(100),\
      price SMALLINT NOT NULL,\
      item_description VARCHAR(500),\
      item_img VARCHAR(200)\
      );');
  })
  .then(() => {
    return db.query('CREATE TABLE IF NOT EXISTS orders(\
      order_id SERIAL PRIMARY KEY,\
      vendor_id INT NOT NULL,\
      customer_id INT NOT NULL,\
      menu_item_id INT,\
      price_total INT NOT NULL,\
      order_status SMALLINT,\
      order_pickup SMALLINT,\
      order_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP\
      );');
  })
  .then(() => {
    return db.query('CREATE TABLE IF NOT EXISTS schedules(\
      schedule_id SERIAL PRIMARY KEY,\
      start_time VARCHAR(20) NOT NULL,\
      end_time VARCHAR(20) NOT NULL,\
      day_of_week INT NOT NULL,\
      coordinates VARCHAR(100) NOT NULL,\
      vendor_id INT NOT NULL\
      );');
  })
  .catch((error) => {
    console.log('error: ', error);
  });
};
