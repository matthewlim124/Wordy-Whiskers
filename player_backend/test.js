

const sentence = "hello my name"
const ai_checked = "Hello, my name"
let score = 0;



function scoreSentence(sentence, ai_checked) {
    const words = sentence.toLowerCase().split(' '); 
    const correct_words = ai_checked.toLowerCase().split(' ');
    let idx = 0;
    words.forEach(word => {
        if(word == correct_words[idx]){
            score += 1;
        }else{

        }
        idx += 1;
    });

    
}

scoreSentence(sentence, ai_checked);

console.log(score);