const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("../src/views/board/index");
});

module.exports = router;
