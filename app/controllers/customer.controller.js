// Create and Save a new Tutorial
const db = require("../models");
const https = require("https");
const Customer = db.customer;

require("dotenv").config();

exports.create = (req, res) => {
  console.log("Path Create---> ", req.body);

  const customer = new Customer({
    customerID: req.body.customerID,
    linebot_destination: req.body.linebot_destination,
    linebot_token: req.body.linebot_token,
    channel_secret: req.body.channel_secret,
  });

  // Save Tutorial in the database
  customer
    .save(customer)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

exports.findCusId = (req, res) => {
  const cusId = req.body.customerID;

  Customer.findOne({ customerID: cusId })
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: "Not found findCusId with id " + cusId });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving findCusId with id=" + cusId });
    });
  // res.send("search data");
};
