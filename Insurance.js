const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
  policyType: String,
  firstName: String,
  middleName: String,
  lastName: String,
  fullName: String,
  birthDate: Date,
});

const Insurance = mongoose.model('Insurance', insuranceSchema);

module.exports = Insurance;
