const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

const port = process.env.PORT || 9000;
require('dotenv').config();


const usersRouter = require('./db/Routers/User.js');
const postsRouter = require('./db/Routers/Post.js');

server.get('/', (req, res) => {
    res.send('API running....')
});

server.use('/users', usersRouter);
server.use('/posts', postsRouter);

server.listen(port, () => console.log(`Running on ${port}.....`));