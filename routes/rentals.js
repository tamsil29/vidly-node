const express = require("express");
const router = express.Router();
const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const Fawn = require("fawn");
const auth = require("../middleware/auth");

// Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send({ success: true, data: rentals });
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });

  const customer = await Customer.findById(req.body.customerId);
  if (!customer)
    return res.status(400).send({
      success: false,
      message: "Customer with the given id could not be found",
    });

  const movie = await Movie.findById(req.body.movieId);
  if (!movie)
    return res.status(400).send({
      success: false,
      message: "Movie with the given id could not be found",
    });

  if (movie.numberInStock === 0)
    return res.status(400).send({
      success: false,
      message: "Movie is currently out of stock",
    });

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  rental = await rental.save();
  movie.numberInStock--;
  movie.save();
  res.send({ success: true, data: rental });

  // try {
  //   new Fawn.Task()
  //     .save("rentals", rental)
  //     .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
  //     .run();
  //   res.send({ success: true, data: rental });
  // } catch (ex) {
  //   res.status(500).send("Something failed");
  // }
});

module.exports = router;
