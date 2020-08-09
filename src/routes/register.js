const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("../src/views/login/register");
});

router.put("/", async (req, res) => {
  //TODO:
  //error handling
  //add user to users table
  //log user in
  //route to kanban board
});

module.exports = router;
