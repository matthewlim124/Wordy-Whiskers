
const refreshToken = async () => {
    try {
        console.log("Attempting to refresh token...");
        let response_refresh = await fetch('https://silent-oxide-441601-r2.et.r.appspot.com/api/user/refresh', {
            method: 'POST',
            credentials: 'include',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
           
            

        });
        
        if (response_refresh.ok) {
            const data2 = await response_refresh.json();
            localStorage.setItem("accessToken", data2.accessToken);
            
            alert(`Token refreshed successfully, please try again!!`);
            
            
        } else {
            const error =  await response_refresh.json();
            console.error("Refresh token failed:", error);
            alert(`Error refreshing token: ${error.message}`);
            
        }
    } catch (err) {
        console.error("Error during refresh token fetch:", err);
    }
};


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


let token = localStorage.getItem("accessToken");
let username = localStorage.getItem('usr');


const player_info_get = async function(){
    try{
        
        
        //http://localhost:8080
        //https://silent-oxide-441601-r2.et.r.appspot.com
        const response = await fetch(`https://silent-oxide-441601-r2.et.r.appspot.com/api/player/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log("response from get player",data);
            
            if(data.length == 0){
                
                const response2 = await fetch('https://silent-oxide-441601-r2.et.r.appspot.com/api/player/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({ playername: "default"}),
                });
                if(response2.ok){
                    return data;
                }else{
                    refreshToken();
                }
                
                
                    
                
            }

            return data;

            

           
            
            
        }

    }catch(err){
        
        alert(`Server error cannot load user data !`);
        refreshToken();
    }
    
}

const player_name = document.getElementById("player-name");
const player_score = document.getElementById("player-score");
const player_ans = document.getElementById("player-ans");
const load_player_name  = async function(){

    try{
        const data = await player_info_get();
    
        console.log(data);
        
        player_name.textContent = data[0].playername;
        player_score.textContent = data[0].score;
        player_ans.textContent = data[0].correct_ans;

        
        
    }catch(err){
        console.error(`Server error cannot load user data !`, err);
        window.location.reload();
    }
};







document.getElementById("checkForm").addEventListener("submit", async function(event){
    event.preventDefault();

    const text = document.getElementById("answer").value;
    console.log(`This is text from html ${text}`);
    try{

        const response = await fetch('https://silent-oxide-441601-r2.et.r.appspot.com/api/player/checkGrammar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ text }),
        });

        if (response.ok) {
            const data = await response.json();
            alert(`Sentence graded! Answer: ${data}`);
            scoreSentence(text, data);
            
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
            refreshToken();
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
        if( word == correct_words[idx]){
            
            num += 1;
            
        }else{

        }
        idx += 1;
    });
    
    if(num >= Number(current[0].score) + correct_words.length - 1){
        num1 += 1;
        
    }

    try{
        
        const playername = current[0].playername;
        const score = String(num);
        const correct_ans = String(num1);
        
        const response = await fetch(`https://silent-oxide-441601-r2.et.r.appspot.com/api/player/${current[0].player_id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ playername, score, correct_ans}),
        });

        if (response.ok) {
            
            window.location.reload();
            
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
            refreshToken();
        }
    }catch(err){
        console.error(`Server error cannot update score !`, err);
        alert('An error occurred. Please try again.');
    }
    

    
}


const pronoun = ['he', 'she', 'it', 'they', 'we', 'you', 'i']
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

