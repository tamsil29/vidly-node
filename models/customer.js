const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    isGold: { type: Boolean, default: false },
    phone: {
      type: Number,
      required: true,
      minlength: 6,
      maxlength: 16,
      trim: true,
    },
  })
);

function validateCustomerDetails(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    isGold: Joi.boolean(),
    phone: Joi.string().min(6).max(16).required(),
  });
  return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomerDetails;
