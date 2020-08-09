const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  //TODO implement
});

router.get("/create", async (req, res) => {
  //TODO implement
});

router.get("/:id/edit", async (req, res) => {
  //TODO implement
});

router.get("/:id/comments", async (req, res) => {
  //TODO implement
});

router.get("/:id/comments/create", async (req, res) => {
  //TODO implement
});

module.exports = router;
