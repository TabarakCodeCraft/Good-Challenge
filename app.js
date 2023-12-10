const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
const crypto =require('crypto');

// Generate a random secret key
// Secret key for signing and verifying JWT
const secretKey =  crypto.randomBytes(32).toString('hex');

// Fake user list
const fakeUsers = [
    {
        username: 'Tabarak',
        password: 'star',
        email: 'aaltwt49@gmail.com'
    },
    {
        username:'Nabaa',
        password:'333nnn',
        email:'nnnnnn@gmail.com',
    },
    {
        username:'Mortadha',
        password:'4:44',
        email:'mmmmmm@gmail.com',
    },
    {
        username:'toto',
        password:'toto',
        email:'toto@gmail.com',
    }
];

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password, email } = req.body;

    // Check if provided credentials match any fake user
    const matchedUser = fakeUsers.find(
        user =>
            user.username === username &&
            user.password === password &&
            user.email === email
    );

    if (matchedUser) {
        // Generate JWT token
        const token = jwt.sign({username: username ,password: password, email: email }, secretKey, {
            expiresIn: '24h'
        });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Example protected route using JWT
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'You have access to this protected route!' });
});

// Middleware to authenticate JWT token 

//Decode and login the received token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    console.log('Received Token:' , token)

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Token not provided' });
    }

    const trimmedToken = token.trim();
    const decodedToken = jwt.decode(trimmedToken, {complete: true});
    console.log('Decoded Token:', decodedToken);

    if(!decodedToken){
        console.error('JWT Verification Error');
        return res.status(403).json({ error: 'Forbidden - Invalid token' });
    }
else{
    req.user = decodedToken.payload.user;
    return res.status(200).json({"name":decodedToken.payload.username,"password":decodedToken.payload.password,"email":decodedToken.payload.email});
  
   // next();
}
         
   
    }


    // Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
