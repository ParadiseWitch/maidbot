import { BotPlugin } from "../../botPlugin";
import { BotPluginType } from "../../botPlugin/BotPlugin";


const rssPlugin = new BotPlugin('rss', BotPluginType.init, false, {});
rssPlugin.handlers = [];
