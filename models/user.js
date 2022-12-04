const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true}, // this unique property will not give any error if we submit an email that already exists in the database. mongoose use it to enhance internal perfomance.
  password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator); // uniqueValidator is a plugin which mongoose uses. And now if we want to register a user with an email that already exists, mongoose will throw an error now. so it won't save this user data to the database.

module.exports = mongoose.model("User", userSchema);
