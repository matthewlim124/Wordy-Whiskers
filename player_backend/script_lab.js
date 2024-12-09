



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


const token = localStorage.getItem("accessToken");



const player_info_get = async function(){
    try{
        
        
        console.log(`From player info ${token}`);
        const response = await fetch(`http://localhost:8080/api/player/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            
        });
        
        if (response.ok) {
            const data = await response.json();
            alert("Success get player info");
            
            return data;
            
            
        }

    }catch(err){
        console.error(`Server error cannot load user data !`, err);
        alert('An error occurred. Please try again.');
    }
    
}

const player_name = document.getElementById("player-name");
const player_score = document.getElementById("player-score");
const player_ans = document.getElementById("player-ans");
const load_player_name  = async function(){

    try{
        const data = await player_info_get();
    
        
        
        player_name.textContent = data[0].playername;
        player_score.textContent = data[0].score;
        player_ans.textContent = data[0].correct_ans;
        
    }catch(err){
        console.error(`Server error cannot load user data !`, err);
        alert('An error occurred. Please try again.');
    }
};







document.getElementById("checkForm").addEventListener("submit", async function(event){
    event.preventDefault();

    const text = document.getElementById("answer").value;
    console.log(`This is text from html ${text}`);
    try{

        const response = await fetch('http://localhost:8080/api/player/checkGrammar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ text }),
        });

        if (response.ok) {
            const data = await response.json();
            alert(`Text succesfully checked ${data}`);
            scoreSentence(text, data);
            
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
        
        
    } catch (err) {
        console.error('Check Answer failed!', err);
        alert('An error occurred. Please try again.');
    }

    
   
    
})



async function scoreSentence(sentence, ai_checked) {
    const words = sentence.toLowerCase().split(' '); 
    const correct_words = ai_checked.toLowerCase().split(' ');
    const current = await player_info_get();
    let idx = 0;
    let num = Number(current[0].score);
    let num1 = Number(current[0].correct_ans);
    words.forEach(word => {
        if(word == correct_words[idx]){
            
            num += 1;
            
        }else{

        }
        idx += 1;
    });
    
    if(num == Number(current[0].score) + idx){
        num1 += 1;
    }

    try{
        
        const playername = current[0].playername;
        const score = String(num);
        const correct_ans = String(num1);
        
        const response = await fetch(`http://localhost:8080/api/player/${current[0]._id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ playername, score, correct_ans}),
        });

        if (response.ok) {
            const data = await response.json();
            alert(`Score successfully updated! ${data}`);
            window.location.reload();
            
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    }catch(err){
        console.error(`Server error cannot update score !`, err);
        alert('An error occurred. Please try again.');
    }
    

    
}


const pronoun = ['he', 'she', 'it', 'they', 'we', 'you', 'i', 'them', 'us', 'his']
const noun = ['apple', 'banana', 'car', 'dog', 'elephant', 'flower', 'guitar', 'house', 'island', 'jacket', 
'kite', 'lamp', 'mountain', 'notebook', 'ocean', 'pencil', 'queen', 'river', 'sun', 'tree', 
'umbrella', 'vase', 'whale', 'xylophone', 'yacht', 'zebra', 'book', 'chair', 'desk', 'engine', 'forest', 'glass', 'hat', 'ice', 'jungle', 'key', 
'lion', 'moon', 'necklace', 'orange', 'phone', 'quilt', 'road', 'sand', 'turtle', 'violin', 
'window', 'yarn', 'zoo', 'bottle', 'coin', 'sun', 'ocean', 'mountain', 'tree', 'computer', 'school', 'house', 'movie', 'garden', 'flower', 'music', 'phone', 'table', 'teacher', 'country', 'bread', 'family', 'city', 'road', 'river', 'lake']
const verb = ['open', 'close', 'read', 'sit', 'move', 'start', 'climb', 'break', 'build', 'draw', 
'carry', 'see', 'find', 'lift', 'watch', 'throw', 'catch', 'ride', 'shine', 'cover', 
'fill', 'shake', 'hold', 'touch', 'drop', 'take']

//masukan kata ke sentence box
appendWordToList(pronoun);
appendWordToList(verb);
appendWordToList(noun);


load_player_name();

