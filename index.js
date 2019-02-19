const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = require('./db/helpers/Helper');
const dbUsers = require('./db/dbConfig');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

const secret = 'secret';

const port = process.env.PORT || 9000;
require('dotenv').config();

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


server.get('/', (req, res) => {
    res.send('API running....')
});

// ########## GET ALL POSTS ################
server.get('/posts', (req, res) => {
    db.getPosts()
      .then(posts => res.status(200).json(posts))
      .catch(err => res.status(500).json(err))
  });

// ########### GET POST BY ID ################
server.get('/posts/:id',  (req, res) => {
    const { id } = req.params;
    db.getPost(id)
    .then(posts => posts.find(post => post.id === +id))
    .then(posts => {
        if(posts) {
      res.status(200).json(posts);
        } else {
            res.status(404).json({Message: 'The post with specified id does not exist!'});
        }
    })
    .catch(error => {
      res.status(500).json(error);
    })
});

// ########## POSTING NEW POST ###########
server.post('/posts', (req, res) => {
    const { title, content, category } = req.body;
    const post = {
        title,
        content,
        category
    };
    if (!title || !content || !category) {
        res.status(400).json('Message: title, content and category are required fields!')
    }

    db.addPost(post)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res.status(500).json(error)
    })
});

// ########### UPDATING POST ###########
server.put('/posts/:id', (req, res) => {
    const {title, content, category} = req.body;
    const {id} = req.params;
    const updatedPost = {
        title,
        content,
        category
    };
    if (!title || !content || !category) {
        res.status(400).json('Message: In order to update note, title and content are required fields!')
    }
    db.updatePost(id, updatedPost)
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(error => {
            res.status(500).json(error)
        })
});

// ########### DELETE POST ###############
server.delete('/posts/:id', (req, res) => {
    const {id} = req.params;
    db.deletePost(id)
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(error => {
            res.status(500).json(error)
        })
});


// ###### Registering newUser ############
server.post('/admin_register', (req, res) => {
    const newUser = req.body;
    const hash = bcrypt.hashSync(newUser.password, 14);
    newUser.password = hash;

    dbUsers('users')
    .insert(newUser)
    .then(ids => {
      db('users')
        .where({ id: ids[0] })
        .first()
        .then(newUser => {
          const token = generateToken(newUser);
          res.status(201).json(token);
        })
        .then(users => {
            res.status(200).json({users, Message: 'Admin created.'})
    })
    })
   
    .catch(error => {
      res.status(500).json({ error, Message: 'Error creating new user.' });
    });
})

// ########### Login ##############
server.post('/login', (req, res) => {
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

server.listen(port, () => console.log(`Running on ${port}.....`));