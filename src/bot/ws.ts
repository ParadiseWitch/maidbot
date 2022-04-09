import { WebSocket } from 'ws'
import config from '../../config'
import { WS } from './type'

const webSocket = new WebSocket(config.bot.ws)

const ws: WS = {
  send(action: string, params: any) {
    webSocket.send(JSON.stringify({ action, params }))
  },
  listen(callback: (arg0: any) => void) {
    webSocket.on('message', data => {
      try {
        callback(JSON.parse(data.toString()))
      } catch (e) {
        console.error(e)
      }
    })
  }
}
export default ws;
