



const preposition_list = ['is','am','are','was','were']
const a = ['a','an'];
const preposition_list2 = ['on', 'at', 'in']
const pronoun = ['i','you','we','they','he','she','it']
const noun = ['apple', 'banana', 'car', 'dog', 'elephant', 'flower', 'guitar', 'house', 'island', 'jacket', 
'kite', 'lamp', 'mountain', 'notebook', 'ocean', 'pencil', 'queen', 'river', 'sun', 'tree', 
'umbrella', 'vase', 'whale', 'xylophone', 'yacht', 'zebra', 'book', 'chair', 'desk', 'engine', 'forest', 'glass', 'hat', 'ice', 'jungle', 'key', 
'lion', 'moon', 'necklace', 'orange', 'phone', 'quilt', 'road', 'sand', 'turtle', 'violin', 
'window', 'yarn', 'zoo', 'bottle', 'coin']
const verb = ['open', 'close', 'read', 'sit', 'move', 'start', 'climb', 'break', 'build', 'draw', 
'carry', 'see', 'find', 'lift', 'watch', 'throw', 'catch', 'ride', 'shine', 'cover', 
'fill', 'shake', 'hold', 'touch', 'drop', 'take']

function getRandomWord(words) {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

const temp = appendWordToList(pronoun);
const temp1 = appendWordToList(verb);
const temp2 = appendWordToList(preposition_list2);
const temp4 = appendWordToList(a);
const temp3 = appendWordToList(noun);




function appendWordToList(type) {
    const word = getRandomWord(type);
    
   
    const li = document.createElement('span');
    li.textContent = word; 

    
    li.classList.add('word'); 
    

    
    document.getElementById('sentence-box').appendChild(li);
}


const words_randoms = Array.from(document.querySelectorAll('.word'));

const shuffled = shuffledWords(words_randoms);




const container = document.getElementById("sentence-box");


container.innerHTML = '';


shuffled.forEach(word => {
    container.appendChild(word);
});

function shuffledWords(words_random){
    for (let i = words_random.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words_random[i], words_random[j]] = [words_random[j], words_random[i]]; 
    }
    return words_random;
}



let words = document.getElementsByClassName("word");
let sentence_box = document.getElementById("sentence-box");





let score = 0;

document.getElementById("checkForm").addEventListener("submit", async function(event){
    event.preventDefault();

    const text = document.getElementById("answer").value;
    const storedScore = localStorage.getItem("grammarScore");
    console.log(text);
    score += scoreSentence(text);
    
    const scoreElement = document.getElementById("grammar-score");
    scoreElement.textContent = score;
   
    
})

function scoreSentence(sentence) {
    const words = sentence.toLowerCase().split(' '); // Convert to lowercase for consistency
    
    
    words.forEach(word => {
        if (noun.includes(word)) {
            score += 2;  
        } else if (verb.includes(word)) {
            score += 2;  
        } else if (pronoun.includes(word)) {
            score += 1;  
        } else if (preposition_list.includes(word) || preposition_list2.includes(word)) {
            score += 1;  
        } else if (a.includes(word)) {
            score += 1;  
        }
    });

    return score;
}