const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = require('../helpers/userDb');
const dbUsers = require('../dbConfig.js');

const secret = 'secret';

// ########## Generating token ###########
function generateToken(user){
    const payload = {
        username: user.username
    };

    const options = {
        expiresIn: '1h',
        jwtid: '12345'
    }
    return jwt.sign(payload, secret, options);
}

// ####### Protected middleware ##########
function protected(req, res, next) {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, secret, (error, decodedToken) => {
            if (error) {
                return res
                    .status(400)
                    .json({ Message: ' Invalid token' })
            } else {
                req.user = { username: decodedToken.username }
            next()
            }
        })
    } else {
        return res.status(400).json({ Message: 'No token found' })
    }
}

router.post('/admin_register', (req, res) => {
    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 14);
    user.password = hash;

    db.insert(user)
        .then(user => {
            const token = generateToken(user);
            res.status(201).json(token);
        })
        .catch(error => {
            res.status(500).json(console.error( 'Can not add user', error));
        })
})

// ########### Login ##############
router.post('/admin_login', (req, res) => {
    const creds = req.body;

    dbUsers('users')
        .where({username: creds.username})
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                const token = generateToken(user);
                res.status(200).json(token)
            } 
            else {
                return res.status(400).json({Message: 'Wrong credentials'})
            }
        })
        .catch(error => {
            res.status(500).json(error)
        })
})

router.get('/', (req, res) => {

    db.get()
    .then(user => {
        res.status(200).json(user);
    })
    .catch(error => {
        res.status(500).json(console.error( 'Error getting users list ', error ));
    })
})

router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get(id)
    .then(user => {
        res.status(200).json(user);
    })
    .catch(error => {
        res.status(500).json(console.error( 'Error getting user ', error ));
    })
})



router.get('/:id/posts', (req, res) => {
    const { id }  = req.params;

    db.getUserPosts(id)
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(error => {
        res.status(500).json(console.error(`Error getting posts. See error ${error}`));
    })
})

router.put('/:id/update', (req, res) => {
    const { id } = req.params;
    const user = req.body;

    db.update(id, user)
    .then(updated => {
        res.status(200).json(updated);
    })
    .catch(error => {
        res.status(500).json(console.error( `Could not update. Refer to ${error}`));
    })
})

router.delete('/:id/delete', (req, res) => {
    const { id } = req.params;

    db.remove(id)
    .then(removed => {
        res.status(200).json(removed);
    })
    .catch(error => {
        res.status(500).json(console.error(`Can not delete. Refer to ${error}`));
    })
})

module.exports = router;