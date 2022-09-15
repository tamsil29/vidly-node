const { Customer, validate } = require("../models/customer");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send({ success: true, data: customers });
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer)
    res.status(404).send({
      success: false,
      message: "Customer with the given id could not be found",
    });
  res.send({ success: true, data: customer });
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });
  }

  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: +req.body.phone,
  });

  await customer.save();
  res.send({ success: true, data: customer });
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });
  }

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isGold: req.body.isGold,
      phone: +req.body.phone,
    },
    { new: true }
  );
  if (!customer)
    res.status(404).send({
      success: false,
      message: "The customer with the given id could not be found",
    });

  res.send({ success: true, data: customer });
});

router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer)
    res.status(404).send({
      success: false,
      message: "The customer with the given id could not be found",
    });
  res.send({ success: true, data: customer });
});

module.exports = router;
