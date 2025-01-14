const express = require("express");
const router = express.Router();


const {getPlayer, getPlayerId, postPlayer, putPlayerId, deletePlayerId, checkGrammar} = require("../controller/playerController.js");
const validateToken = require("../middleware/validateTokenHandler.js");


router.use(validateToken);

router.route("/").get(getPlayer).post(postPlayer);
router.route("/checkGrammar").post(checkGrammar);


router.route("/:player_id").get(getPlayerId).put(putPlayerId).delete(deletePlayerId);



module.exports = router;