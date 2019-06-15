const express = require('express');
const router = express.Router();

const db = require('../helpers/postDb');
const secret = 'secret';

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
        return res.status(400).json({ Message: 'No token found' });
    }
}

// Request to get all posts 
router.get('/', (req, res)=> {
    db.get()
    .then(post => {
        res.status(200).json(post)
    })
    .catch(error => {
        res.status(500).json(console.error( 'Error getting posts ', error))
    })

})

// Request to get a post 
router.get('/:id', (req, res)=> {
    const { id } = req.params;

    db.get(id)
    .then(post => {
        res.status(200).json(post)
    })
    .catch(error => {
        res.status(500).json(console.error( 'Error getting post ', error))
    })
})


// Request to add new post
router.post('/add', protected, (req, res) => {
    const post = req.body

    db.insert(post)
    .then(post=> {
        res.status(200).json(post)
    })
    .catch(error => {
        res.status(500).json(console.error( 'Error posting post ', error))
    })
})


// Request to update a post
router.put('/:id/update', (req, res) => {
    const { id } = req.params;
    const post = req.body

    db.update(id, post)
    .then(updated => {
        res.status(200).json(updated)
    })
    .catch(error => {
        res.status(500).json(console.error( 'Error updating post', error))
    })
})


// Request to delete a post
router.delete('/:id/delete', (req, res) => {
    const { id } = req.params;

    db.remove(id)
    .then(removed => {
        res.status(200).json(removed)
    })
    .catch(error => {
        res.status(500).json(console.error( 'Error deleting post', error))
    })
})

module.exports = router;