/**
 * 获取目前时间
 * @returns 
 */
export const now: () => Date = () => new Date();

/**
 * 获取凌晨0点的日期
 * @param {Date} date 
 * @returns 
 */
export const get0ClockDate = (date: Date = now()) => new Date(getDateStr(date));

/**
 * 获取n天前的日期
 * @param {number} n 
 * @param {Date} date 
 * @returns 
 */
export const getNDaysAgo = (n: number, date: Date = now()) => new Date(date.getTime() - n * 24 * 60 * 60 * 1000);
/**
 * 获取一个星期前的日期
 * @returns 
 */
export const getWeekAgo = (date = now()) => getNDaysAgo(7);

/**
 * 获取本周一的凌晨0点日期
 * @param {Date} date 
 * @returns 
 */
export const getThisWeekMonday = (date: Date = now()) => get0ClockDate(getNDaysAgo((date.getDay() || 7) - 1))

/**
 * 创建一个日期字符串，以'/'分割
 * @param {Date} date 
 * @returns 
 */
export const getDateStr = (date: Date = now()) => {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y + '/' + m + '/' + d;
}
