const mongoose = require("mongoose");

const playerSchema = mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId, // karena id is made in mongo db
        required: true,
        ref: "User",
    },  

    playername: {
        type: String,
        required: [true, "Please add playername"],
    },
    score: {
        type: String,
        required: [true, "Please add score"],
    },
    correct_ans: {
        type: String,
        required: [true, "Please add correct answer"],
    },
    
    
    
}, {
    timestamps: true,
});

module.exports = mongoose.model("Player", playerSchema);