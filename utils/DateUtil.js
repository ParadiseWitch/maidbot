const getChinaTime = (date = new Date()) => { 
  return new Date(date.getTime() + 8 * 60 * 60 * 1000)
}

const getDate = (date = new Date()) => {
  return getChinaTime(new Date(getDateStr(date)));
}

const getWeekAgo = () => {
  const now = getChinaTime();
  const lastWeek = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  return new Date(lastWeek);
}

const getDateStr = (date)=>{
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y + '-' + m + '-' + d;
}

module.exports = {
  getChinaTime,
  getAWeekAgo: getWeekAgo,
  getDateStr,
  getDate
}
