module.exports = (app) => {
  // const tutorials = require("../controllers/tutorial.controller.js");
  const customer = require("../controllers/customer.controller");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", customer.create);

  router.post("/searchCusId", customer.findCusId);

  app.use("/api/customer", router);
};