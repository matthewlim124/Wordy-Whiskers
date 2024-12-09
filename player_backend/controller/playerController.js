const asyncHandler = require("express-async-handler"); // memudahkan async function untuk berinteraksi dengan error handler 
const Player = require("../models/playerModel.js");
const {constants} = require("../constants.js");
const dotenv = require("dotenv");
const axios = require("axios");
const langtool = require("languagetool-api");
const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

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
        score: "0",
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

//check Grammar
//@route for POST /api/player
//@access private

const checkGrammar = async (req, res) => {
    console.log('Request received:', req.body);
    const { text } = req.body; 
  
    if (!text) {
        res.statusCode = constants.VALIDATION;
        throw new Error("Expecting text!");
        
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Fix the grammatical mistake of this sentence without giving me the reasoning, ${text} `;

    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    res.json(result.response.text());

    //limit reached
    // const openAI = new OpenAI({apiKey: process.env.OPEN_AI_KEY});
    // const modelAI = "gpt-4o-mini";

    // const messages = [

    //     {
    //         role: "system",
    //         content: "You are an assistant to help correct grammatical error from a sentence",

    //     },

    //     {
    //         role:"user",
    //         content: `Fix any grammatical error of this sentence without changing any of the words, ${text}`
    //     },
    // ]
    
    // const completion = await openAI.chat.completions.create({
        
    //     model: modelAI,
    //     messages: messages,
    //     temperature: 0.7
    // });

    // console.log(completion);
    // const aiResponse =  completion.choices[0].message.content;
    
    
    // res.json(aiResponse);
    
    //not good enough
    // langtool.check({
    //     language: 'en-US',  // Language of the text
    //     text:  text 
    // }, (err, result) => {
    //     if (err) {
    //         console.error("Error:", err);
    //     } else {
            
    //         res.statusCode = 200;
    //         res.json(result.matches);
    //     }
    // });

    
  
      
    

    
    
  };


module.exports = {getPlayer, getPlayerId, postPlayer, putPlayerId, deletePlayerId, checkGrammar};