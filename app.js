const experee = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = experee();
const port = 3000;

// Use middleware to parse JSON in the request body
app.use(bodyParser.json());
app.get('/',(req, res)=>
 res.send("This is my first Backend test")
)

// Secret key for signing and verifying JWT
const SecretKey = 'your-secret-key';

const mockUser = {
    username: 'TabarakAli',
    password: '2001@star@GalaxyGirl'
};
//Login endpoint
app.post('login', (req, res) => {
    const { username, password } = req.body;

    if (username === mockUser.username && password === mockUser.password) {
        //Generate JWT token
        const token = jwt.sign({ username: mockUser.username }, SecretKey, { expiresIn: '1h' });
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
  
    jwt.verify(token, SecretKey, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Forbidden - Invalid token' });
      }
  
      req.user = user;
      next();
    });

  }
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${3000}`);
  });