



const sign_in = async function(){
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    

    try{
        //https://silent-oxide-441601-r2.et.r.appspot.com//api/user/login
        const response = await fetch('https://silent-oxide-441601-r2.et.r.appspot.com/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            alert(`Sign-in successful! Access Token: ${data.accessToken}`);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('usr', data.username);
            return data;
        } 
    }catch(err){
        console.error('Sign-in failed:', err);
        alert('An error occurred. Please try again.');
    
    }
};


document.getElementById('signinForm').addEventListener('submit',  async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    
    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    try {
        const data = await sign_in();
        if (data) {
            
            window.location.href = 'lab.html';
            
        } 
            
        
    } catch (err) {
        console.error('Sign-in failed:', err);
        alert('An error occurred. Please try again.');
    }

    
    
    console.log('Username:', username);
    console.log('Password:', password);



});