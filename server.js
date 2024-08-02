const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000; 

app.use(express.json()); // Middleware to parse JSON bodies using express
app.use(express.static('public'));

const PASSWORDS_FILE = 'secure/passwords.txt'; // Path to passwords file

function readUsers() { // Helper function to read user data from passwords.txt
    const data = fs.readFileSync(PASSWORDS_FILE, 'utf8');
    const users = {};
    data.split('\n').forEach(line => {
        const [username, hashedPassword] = line.split(':');
        if (username && hashedPassword) {
            users[username] = hashedPassword;
        }
    });
    return users;
}

function writeUser(username, hashedPassword) { //Writes hashed user data to passwords.txt
    const data = `${username}:${hashedPassword}\n`;
    fs.appendFileSync(PASSWORDS_FILE, data);
}

app.post('/', async (req, res) => { // Handles login and signup requests
    console.log('Received POST request:', req.body); // Logs requests to console - debugging purposes
    try {
        const { username, password, signup } = req.body;
        const users = readUsers();

        if (signup) { // Checks if signup box is ticked
            if (users[username]) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            writeUser(username, hashedPassword);
            console.log('User signed up:', username);
            return res.status(200).json({ message: 'Signup successful', showPage: 2 });
        } else { // If signup box is not ticked, it is a login request
            const storedPassword = users[username];
            if (!storedPassword) {
                return res.status(400).json({ message: 'User does not exist' });
            }
            const passwordMatch = await bcrypt.compare(password, storedPassword);
            if (!passwordMatch) {
                return res.status(400).json({ message: 'Incorrect password' });
            }
            return res.status(200).json({ message: 'Login successful', showPage: 2 });
        }
    } catch (error) { // Catches and reports if there are any server errors
        console.error('Error during login/signup:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`); // States which port the server is running on
});

// To change the port, refer to line 5 (const port x) and change the port