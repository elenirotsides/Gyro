const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("../src/views/login/index", {
    title: "Please signin",
  });
});

module.exports = router;
