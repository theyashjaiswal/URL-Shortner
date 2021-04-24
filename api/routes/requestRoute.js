const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");

router.get("/:url", requestController.originalUrl);
router.post("/url/shorten", requestController.shortUrl);

module.exports = router;
