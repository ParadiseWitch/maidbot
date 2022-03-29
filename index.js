const { ws, http } = require('./bot');
const config = require('./config');

const rPlugins = Object.keys(config.plugins.rPlugins).map(name =>
  require(name)(config.plugins.rPlugins[name] || {})
)
const sPlugins = Object.keys(config.plugins.sPlugins).map(name => { 
  return require(name)(config.plugins.sPlugins[name] || {});
})

ws.listen(data => {
  if (process.env.NODE_ENV === 'development') {
    data.meta_event_type !== 'heartbeat' && console.log(data)
  }

  rPlugins.forEach(plugin => plugin({ data, ws, http }))
})

sPlugins.forEach(plugin => plugin({ ws, http }))