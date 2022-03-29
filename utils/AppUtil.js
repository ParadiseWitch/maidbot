const config = require("../config")


const isAdmin = (uid) => config.admin.indexOf(uid) !== -1;

module.exports = {
  isAdmin,
}