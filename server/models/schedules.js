const { db } = require('../../database/index.js');

module.exports.newSchedule = (schedule) => {
  return db.one(
    'INSERT INTO schedules\
    (day_of_week, start_time, end_time, location, vendor_id)\
    VALUES (${day_of_week}, ${start_time}, ${end_time},\
    ${location}, ${vendor_id}', schedule);
};
