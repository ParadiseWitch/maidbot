module.exports = {
  bot: {
    http: 'http://127.0.0.1:5700',
    ws: 'ws://127.0.0.1:6700'
  },
  plugins: {
    rPlugins:{
      './plugin/daily': {},
      // 打卡
      // todo ？
      // 
    },
    sPlugins: {
      // './plugin/report': {},
      // 定时任务 注册一次
    },
  },
  db: {
    mongo: {
      url: "mongodb://localhost:3344"
    }
  },
  admin: [
    1374624878,
  ]
}