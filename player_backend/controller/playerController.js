const asyncHandler = require("express-async-handler"); // memudahkan async function untuk berinteraksi dengan error handler 
const Player = require("../models/playerModel.js");
const {constants} = require("../constants.js");
//get  players
//@route for GET /api/player
//@access private

const getPlayer = asyncHandler( async (req,res) =>{
    const player = await Player.find({ user_id: req.user.id});
    res.statusCode = 200;
    res.json(player);

});

//get a player 
//@route for GET /api/player/id
//@access private

const getPlayerId = asyncHandler (async (req,res) =>{ 
    const player = await Player.findById(req.params.id);
    if(!player){
        res.statusCode = constants.NOT_FOUND;
        throw new Error(`Player by the id ${req.params.id} not found!`);
    }
    res.statusCode = 200;
    res.json(player);

});

//create new player
//@route for POST /api/player
//@access private

const postPlayer = asyncHandler (async (req,res) =>{
    res.statusCode = 201;
    // console.log("The request body : ", req.body);
    const {playername, score, correct_ans} = req.body;
    if(!playername || !score || !correct_ans){
        res.statusCode = constants.VALIDATION;
        throw new Error("All fields must have value");
    }

    const player = await Player.create({
        playername,
        score,
        correct_ans,
        user_id: req.user.id,
    });
    res.json(player);

});

//update a player
//@route for PUT /api/player/id
//@access private

const putPlayerId = asyncHandler (async (req,res) =>{
    const player = await Player.findById(req.params.id);
    if(!player){
        res.statusCode = constants.NOT_FOUND;
        throw new Error(`Player by the id ${req.params.id} not found!`);
    }

    if(player.user_id.toString() !== req.user.id){
        res.statusCode = constants.FORBIDDEN;
        throw new Error("Forbidden update, user does not have permission to update");
    }

    const updatedPlayer = await Player.findByIdAndUpdate(
        req.params.id, //update id
        req.body, //update content
        {new: true} //query option
    );
    res.statusCode = 200;
    res.json(updatedPlayer);

});

//delete a player
//@route for DELETE /api/player/id
//@access private

const deletePlayerId = asyncHandler( async (req,res) =>{
    const player = await Player.findById(req.params.id);
    if(!player){
        res.statusCode = constants.NOT_FOUND;
        throw new Error(`Player by the id ${req.params.id} not found!`);
    }

    if(player.user_id.toString() !== req.user.id){
        res.statusCode = constants.FORBIDDEN;
        throw new Error("Forbidden update, user does not have permission to update");
    }

    await Player.deleteOne({_id: req.params.id});
    res.statusCode = 200;
    res.json(player);

});


module.exports = {getPlayer, getPlayerId, postPlayer, putPlayerId, deletePlayerId};