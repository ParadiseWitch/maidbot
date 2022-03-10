const getChinaTime = () => { 
  return new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
}

module.exports = {
  getChinaTime,
}
