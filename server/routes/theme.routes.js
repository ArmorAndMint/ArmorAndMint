var ThemeController = require('../controllers/theme.controller.js');

module.exports = function(app) {

  app.get('/api/themes', function(req, res, next) {
    ThemeController.returnThemes(req, res, next);
  });

};
