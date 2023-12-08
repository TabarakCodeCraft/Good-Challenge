const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(express.json());

// Secret key for signing and verifying JWT
const secretKey = '1973TAR';

// Fake user list
const fakeUsers = [
    {
        username: 'TabarakAli',
        password: '2001@star@GalaxyGirl',
        email: 'aaltwt@gmail.com'
    },
    {
        name:'Nabaa',
        password:'333',
        email:'nnnnnn@gamil.com',
    },
    {
        name:'Mortadaa',
        password:'4444',
        email:'mmmmmm@gamil.com',
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

    if (!matchedUser) {
        // Generate JWT token
        const token = jwt.sign({ username: username }, 'shhhhh', {
            algorithm: 'HS256' ,
            expiresIn: '1h'
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

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Token not provided' });
    }



    jwt.verify(token,'shhhhh',{algorithms:['HS256']}, (err, decoded) => {
        if (err) {

           

            return res.status(403).json({ error: 'Forbidden - Invalid token' +
            
            secretKey+decoded+token});
        }

        req.user = decoded;
        next();
    });
}






// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
