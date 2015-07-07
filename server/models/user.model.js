var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
  bio: {type: String, default: 'Who doesn\'t love custom biographys? Am I Right??!?!?'},
  author: {type: String, default: 'Your Name'},
  theme: {type:String, default: 'default'},
  path: {type:String, default: 'css/themes/styles.css'},
  email: String,
  disqus_shortname: {type: String, default: undefined}
});

// this populates our user object with everything we need for now
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
