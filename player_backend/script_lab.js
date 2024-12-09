




const pronoun = ['he', 'she', 'it', 'they', 'we', 'you', 'i', 'them', 'us', 'his']
const noun = ['apple', 'banana', 'car', 'dog', 'elephant', 'flower', 'guitar', 'house', 'island', 'jacket', 
'kite', 'lamp', 'mountain', 'notebook', 'ocean', 'pencil', 'queen', 'river', 'sun', 'tree', 
'umbrella', 'vase', 'whale', 'xylophone', 'yacht', 'zebra', 'book', 'chair', 'desk', 'engine', 'forest', 'glass', 'hat', 'ice', 'jungle', 'key', 
'lion', 'moon', 'necklace', 'orange', 'phone', 'quilt', 'road', 'sand', 'turtle', 'violin', 
'window', 'yarn', 'zoo', 'bottle', 'coin', 'sun', 'ocean', 'mountain', 'tree', 'computer', 'school', 'house', 'movie', 'garden', 'flower', 'music', 'phone', 'table', 'teacher', 'country', 'bread', 'family', 'city', 'road', 'river', 'lake']
const verb = ['open', 'close', 'read', 'sit', 'move', 'start', 'climb', 'break', 'build', 'draw', 
'carry', 'see', 'find', 'lift', 'watch', 'throw', 'catch', 'ride', 'shine', 'cover', 
'fill', 'shake', 'hold', 'touch', 'drop', 'take']

function getRandomWord(words) {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}


function appendWordToList(type) {
    const word = getRandomWord(type);
    
   
    const li = document.createElement('span');
    li.textContent = word; 

    
    li.classList.add('word'); 
    

    
    document.getElementById('sentence-box').appendChild(li);
}

function shuffledWords(words_random){
    for (let i = words_random.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words_random[i], words_random[j]] = [words_random[j], words_random[i]]; 
    }
    return words_random;
}

//masukan kata ke sentence box
appendWordToList(pronoun);
appendWordToList(verb);
appendWordToList(noun);





// let words = document.getElementsByClassName("word");
// let sentence_box = document.getElementById("sentence-box");







document.getElementById("checkForm").addEventListener("submit", async function(event){
    event.preventDefault();

    const text = document.getElementById("answer").value;
    console.log(`This is text from html ${text}`);
    try{

        const response = await fetch('http://localhost:8080/api/player/checkGrammar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });

        if (response.ok) {
            const data = await response.json();
            alert(`Text succesfully checked ${data}`);
            
            
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (err) {
        console.error('Check Answer failed!', err);
        alert('An error occurred. Please try again.');
    }

    scoreSentence(text, data);
   
    
})

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