const express = require('express');
const router = express.Router();
const reactionController = require("../controllers/reactionController")


router.post("/liker", reactionController.likePropositionIdee);

module.exports = router