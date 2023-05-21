const holidays    = require('./holidays.js');
const specialDays = require('./special-days.js');
const muhuratDay  = Math.floor(new Date('2023-11-12').getTime() / 1000 / 60 / 60 / 24); // GMT
const mfIsns      = require('./mf-isns.json');


exports.info = (symbol) => {

  // BANKNIFTY20N0523500PE, BANKNIFTY23APR40000PE
  // RELIANCE23APR2300CE, RELIANCE23APR2300PE
  // M21OCT720PE, COALINDIA21JUL142.5PE

  let opt = symbol.match(/^(\S+?)(\d{2})(\w{3})([\d\.]+)(PE|CE)$/);
  if(opt)
    return { script: opt[1], expiry: opt[2] + opt[3], strike: parseFloat(opt[4]) };

  let fut = symbol.match(/^(\S+?)(\d{2})(\w{3})FUT$/);
  if(fut)
    return { script: fut[1], expiry: fut[2] + fut[3] };

  return { script: symbol };

}



function istDayAndHr(date) {
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
    return hrs >= 9 && hrs < 15.5;

}

exports.hasOpened = () => {

  let date = new Date();
  if(exports.isHoliday(date))
    return false;

  let [ day, hrs ] = istDayAndHr(date);
  if(day == muhuratDay)
    return hrs >= 18.25;
  else
    return hrs >= 9;

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



exports.isn = (name) => {
  if(name.indexOf('/') != -1)
    name = name.substring(0, name.indexOf('/')).trim();
  else if(name.indexOf('::') != -1)
    name = name.substring(0, name.indexOf('::')).trim();
  return mfIsns[name];
}
