module.exports = {
  bot: {
    http: 'http://127.0.0.1:5700',
    ws: 'ws://127.0.0.1:6700'
  },
  plugins: {
    replyPlugins:{
      // 打卡
      // todo ？
      // 
    },
    sendPlugins:{
      // 定时任务 注册一次
    },
  },
  db: {
    mongo: {
      url: "mongodb://localhost:27017"
    }
  }
}