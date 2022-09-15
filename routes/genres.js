const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Joi = require("joi");
const { Genre, validate } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
  // throw new Error("Could not get the genres");
  const genres = await Genre.find().sort("name");
  res.send({ success: true, data: genres });
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });
  }
  let genre = new Genre({
    name: req.body.name,
  });

  genre = await genre.save();
  res.send({ success: true, data: genre });
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!genre)
    res.status(404).send({
      success: false,
      message: "Genre with the given id could not be found!",
    });

  res.send({ success: true, data: genre });
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);

  if (!genre)
    return res.status(404).send({
      success: false,
      message: "Genre with the given id could not be found!",
    });

  res.send({ success: true, data: genre });
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre)
    return res.status(404).send({
      success: false,
      message: "Genre with the given id could not be found!",
    });
  res.status(200).send({ success: true, data: genre });
});

module.exports = router;
