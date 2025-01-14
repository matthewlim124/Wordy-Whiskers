const asyncHandler = require("express-async-handler"); // memudahkan async function untuk berinteraksi dengan error handler 
const Player = require("../models/playerModel.js");
const {constants} = require("../constants.js");
const dotenv = require("dotenv");
const axios = require("axios");
const supabase = require("../config/dbConnection.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

//get  players
//@route for GET /api/player
//@access private

const getPlayer = asyncHandler( async (req,res) =>{

    const {data, error}= await supabase.from("player").select("*").eq("user_id", req.user.user_id);
    
    res.statusCode = 200;
    console.log(data, req.user.user_id);
    res.json(data);

});

//get a player 
//@route for GET /api/player/id
//@access private

const getPlayerId = asyncHandler (async (req,res) =>{ 
    const {data, error} = await supabase.from("player").select("*").eq("player_id", req.params.player_id);
    
    if(error){
        res.statusCode = constants.NOT_FOUND;
        throw new Error(`Player by the id ${req.params.player_id} not found!`);
    }
    res.statusCode = 200;
    res.json(data);

});

//create new player
//@route for POST /api/player
//@access private

const postPlayer = asyncHandler (async (req,res) =>{
    res.statusCode = 201;
    // console.log("The request body : ", req.body);
    const {playername} = req.body;
    if(!playername){
        res.statusCode = constants.VALIDATION;
        throw new Error("All fields must have value");
    }

    const {data, error} = await supabase.from("player").insert([

        {playername: playername, score: '0', correct_ans: '0', user_id: req.user.user_id}, 

    ])
    res.json({message: "player create success"});

});

//update a player
//@route for PUT /api/player/id
//@access private

const putPlayerId = asyncHandler (async (req,res) =>{
    const {data, error} = await supabase.from("player").select("*").eq("player_id", req.params.player_id);
    const {playername, score, correct_ans} = req.body;

    
    if(error){
        res.statusCode = constants.NOT_FOUND;
        throw new Error(`Player by the id ${req.params.player_id} not found!`);
    }
    
    if(data[0].user_id !== req.user.user_id){
        res.statusCode = constants.FORBIDDEN;
        throw new Error("Forbidden update, user does not have permission to update");
    }



    const {data: playerUpdate, error: playerError}= await supabase.from("player").update({playername: playername, score: score, correct_ans: correct_ans}).eq("player_id", req.params.player_id);

    
    res.statusCode = 200;
    res.json({message: "update player success!"});

});

//delete a player
//@route for DELETE /api/player/id
//@access private

const deletePlayerId = asyncHandler( async (req,res) =>{
    const {data, error} = await supabase.from("player").select("*").eq("player_id", req.params.player_id);
    if(!data){
        res.statusCode = constants.NOT_FOUND;
        throw new Error(`Player by the id ${req.params.id} not found!`);
    }

    if(data[0].user_id !== req.user.id){
        res.statusCode = constants.FORBIDDEN;
        throw new Error("Forbidden update, user does not have permission to update");
    }

    
    res.statusCode = 200;
    res.json(data);

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

    const prompt = `Fix the grammatical mistake of this sentence, ${text}, also i want your response to be just the correct asnwer.  `;

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