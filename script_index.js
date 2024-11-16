

document.getElementById('signupForm').addEventListener('submit',  async function (event) {
    event.preventDefault(); 

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    
    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    try {
        const response = await fetch('https://silent-oxide-441601-r2.et.r.appspot.com/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            alert(`Sign-up successful! User ID: ${data._id}`);
            window.location.href = 'index2.html';
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (err) {
        console.error('Sign-up failed:', err);
        alert('An error occurred. Please try again.');
    }

    
    console.log('Username:', username);
    console.log('Password:', password);

    
    
});

