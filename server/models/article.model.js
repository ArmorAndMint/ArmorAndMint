var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {type: String, required: true, unique: true},
  body: {type: String, required: true},
  createdOn: {type: Date, default: Date.now, required: true},
  author: {type: String, required: true},
  pretty_id: String
});

module.exports = mongoose.model('Article', ArticleSchema);
