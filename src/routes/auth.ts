import express from "express";
import { logger } from "../utils/logger";
import { lookupUsername, insertUser, User } from "../utils/db";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


// This is the router for the auth route
const router = express.Router();


// Secret key for JWT
const SECRET_KEY = process.env.JWT_SECRET_KEY

const SALT_ROUNDS = 5;


if (!SECRET_KEY) {
    throw new Error("Error: No JWT Secret Key found. Check the .env file");
}




// Registration endpoint
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).send("Missing username or password in request")
        return;
    }

    let existingUser = await lookupUsername(username);

    console.log(`Existing user : ${existingUser}`)

    if (existingUser !== undefined) {
        res.status(409).send('Username already taken');
        return;
    }

    bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            res.status(500).send('Internal server error');
            return;
        }
        insertUser(username, hash, (err) => {
            res.status(500).send('Internal server error');
        }).then(() => {
            res.send(`Successfully registered user ${username}`)
        })

    });
});


// login endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).send("Missing username or password in request")
    }

    let existingUser = await lookupUsername(username)

    if (existingUser === undefined) {
        // user not found
        res.status(401).send('Invalid username or password');
        return;
    }

    bcrypt.compare(password, existingUser?.password, (err, result) => {
        if (result) {
            // Generate a JWT token
            const token = jwt.sign({ username }, SECRET_KEY);

            // Authentication successful
            res.json({ message: 'Authentication successful', token });
        } else {
            // Authentication failed
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });
});


// // Middleware to verify JWT token
// const authenticateToken = (req: Request, res: Response, next: Function) => {
//     const token = req.headers['authorization']?.split(' ')[1];

//     if (!token) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     jwt.verify(token, secretKey, (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ message: 'Invalid token' });
//       }

//       req.body.username = decoded.username;
//       next();
//     });
//   };

export const authHandler = router;


