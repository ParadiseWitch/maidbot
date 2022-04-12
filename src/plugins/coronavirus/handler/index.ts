import { contain } from "../../../utils/StringUtil";
import PluginExecParam, { Handler } from "../../../botPlugin/type";
import { Browser, chromium, ElementHandle, Page } from 'playwright';


const virusHandlers: Handler[] = [
  {
    name: "help",
    match: (data) => contain(data.message, "帮助"),
    handle: ({ ws, http, data }: PluginExecParam) => { }
  },
  {
    name: "all",
    match: (data) => true,
    handle: ({ ws, http, data }: PluginExecParam) => { }
  },

];
export default virusHandlers;

const getBaiduCoronaReportCaputer = () => { 
  let browser: Browser;
  let comic_title: string;
  const host = 'https://www.copymanga.com';
  
}
