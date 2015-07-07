var Theme = require('../config/themes.json');

module.exports = {
  returnThemes: function(req, res, next) {
    res.send(Theme);
    // res.send([]);
    // res.send(Theme);
  }
}
