const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("../src/views/login/index", {
    title: "Please signin",
  });
});

router.post("/", async (req, res) => {
  //TODO: Implement
});

module.exports = router;
