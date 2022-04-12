import { BotPluginManager } from './botPlugin/BotPluginManager';
import { BotPlugin, BotPluginType } from './botPlugin/BotPlugin';
import { ws, http } from './bot';
import { botPluginRegister } from './botPlugin/botPluginRegister';

const bootstrap = async () => {
  await botPluginRegister();

  const replyPlugins = BotPluginManager.botPlugins.filter(p => p.type === BotPluginType.reply);

  const initPlugins = BotPluginManager.botPlugins.filter(p => p.type === BotPluginType.init)

  ws.listen(data => {
    if (process.env.NODE_ENV === 'development') {
      data.meta_event_type !== 'heartbeat' && console.log(data)
    }
    // 回复型插件
    replyPlugins.forEach(p => {
      p.handle({ data, ws, http })
    })
  })

  // 启动型插件
  initPlugins.forEach(p => {
    p.handle({ ws, http })
  })
}
export default bootstrap;