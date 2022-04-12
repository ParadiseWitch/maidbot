import axios from "axios";
import { scheduleJob } from "node-schedule";
import { Handler } from "../../../botPlugin/type";
import * as cheerio from 'cheerio';
import { extractStrBetweenCDATA } from "../../../utils/RegUtil";
import { RSSItem } from "../type/RSSItem";


const rssHandlers: Handler[] = [
  {
    name: "coronavirus",
    match: () => true,
    handle: () => {
      getAndparseRssData("http://maiiiiiid.fun:1200/coronavirus/dxy/data/湖北/武汉").then(res => {
        console.log(res);
      })
      // scheduleJob("0 0 8 * * ? ", function () {
      // })
    }
  }
]

const getAndparseRssData = (url: string) => {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(res => {
        const $ = cheerio.load(extractStrBetweenCDATA(res.data));
        const items = $('item').length > 0 ? $('item') : ($('entry'));
        const rssData: RSSItem[] = items.map(function (i, el) {
          const item = $('item').eq(i);
          const title = $('title', item).eq(0).text().trim();
          const description = $('description', item).eq(0).text().trim();
          const pubDate = $('pubDate', item).eq(0).text().trim();
          const guid = $('guid', item).eq(0).text().trim();
          // todo link 取不到 少一个闭合标签
          const link = $('link', item).eq(0).text().trim();
          const author = $('author', item).eq(0).text().trim();
          return {
            title,
            description,
            pubDate,
            guid,
            link,
            author,
          }
        }).get();
        resolve(rssData);
      }).catch(reject)
  })
}

// getAndparseRssData("http://maiiiiiid.fun:1200/meituan/tech/home")


// getAndparseRssData(encodeURI("https://github.com/zhouchao92.atom")).then(res => {
getAndparseRssData(encodeURI("http://localhost:1200/coronavirus/dxy/data/湖北/武汉")).then(res => {
  console.log(res);
}).catch(console.error);