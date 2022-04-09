import axios from 'axios'
import config from '../../config'
import { HTTP } from './type'

const request = axios.create({
  baseURL: config.bot.http,
  method: 'POST'
})
  
const http: HTTP = {
  async send(action: string, params: any) {
    const { data } = await request({
      url: action,
      data: params
    })
    return data
  }
}
export default http;
