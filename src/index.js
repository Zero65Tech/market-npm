const holidays    = require('./holidays.js');
const specialDays = require('./special-days.js');
const muhuratDay  = Math.floor(new Date('2023-11-12').getTime() / 1000 / 60 / 60 / 24); // GMT


function istDayAndHr = (date) => {
  let hrs = date.getTime() / 1000 / 60 / 60 + 5.5;
  return [ Math.floor(hrs / 24), hrs % 24 ];
}


exports.isOpen = () => {

  let date = new Date();
  if(exports.isHoliday(date))
    return false;

  let [ day, hrs ] = istDayAndHr(date);
  if(day == muhuratDay)
    return hrs >= 18.25 && hrs < 19.25;
  else
    return hrs >= 9.5 && hrs < 15.5;

}

exports.hasOpened = () => {

  let date = new Date();
  if(exports.isHoliday(date))
    return false;

  let [ day, hrs ] = istDayAndHr(date);
  if(day == muhuratDay)
    return hrs >= 18.25;
  else
    return hrs >= 9.5;

}

exports.hasClosed = () => {

  let date = new Date();
  if(exports.isHoliday(date))
    return false;

  let [ day, hrs ] = istDayAndHr(date);
  if(day == muhuratDay)
    return hrs >= 19.25;
  else
    return hrs >= 15.5;

}

exports.isHoliday = (date = new Date()) => {

  let dateStr = date;

  if(typeof date == 'object') {
    date = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
    dateStr = date.getUTCFullYear()
      + ((date.getUTCMonth() < 9 ? '-0' : '-') + (date.getUTCMonth() + 1))
      + ((date.getUTCDate() < 10 ? '-0' : '-') + date.getUTCDate());
  } else if(typeof date == 'string') {
    date = new Date(date); // GMT
  }

  if(date.getUTCDay() >= 1 && date.getUTCDay() <= 5)
    return holidays[date.getUTCFullYear() - 2011].indexOf(dateStr) != -1;
  else
    return specialDays.indexOf(dateStr) == -1;

}