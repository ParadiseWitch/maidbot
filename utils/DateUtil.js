/**
 * 日期工具类
 * 所有时区使用中国北京东八区
 * 一天的开始是北京时间上午0点
 */

const now = () => new Date();

/**
 * 获取凌晨0点的日期
 * @param {Date} date 
 * @returns 
 */
const get0ClockDate = (date = now()) => new Date(getDateStr(date));

/**
 * 获取n天前的日期
 * @param {number} n 
 * @param {Date} date 
 * @returns 
 */
const getNDaysAgo = (n, date = now()) => new Date(date.getTime() - n * 24 * 60 * 60 * 1000);
/**
 * 获取一个星期前的日期
 * @returns 
 */
const getWeekAgo = (date = now()) => getNDaysAgo(7);

/**
 * 获取本周一的凌晨0点日期
 * @param {Date} date 
 * @returns 
 */
const getThisWeekMonday = (date = now()) => get0ClockDate(getNDaysAgo((date.getDay() || 7) - 1))

/**
 * 创建一个日期字符串，以'/'分割
 * @param {Date} date 
 * @returns 
 */
const getDateStr = (date) => {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y + '/' + m + '/' + d;
}

module.exports = {
  now,
  get0ClockDate,
  getNDaysAgo,
  getWeekAgo,
  getThisWeekMonday,
  getDateStr,
}
