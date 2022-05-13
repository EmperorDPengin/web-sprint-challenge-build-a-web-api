const express = require('express');
const helmet = require('helmet');
const projectsRouter = require('./projects/projects-router');
const actionsRouter = require('./actions/actions-router');

const server = express();
// Configure your server here
server.use(express.json());
server.use(helmet());

// Build your actions router in /api/actions/actions-router.js
server.use('/api/projects', projectsRouter);

// Build your projects router in /api/projects/projects-router.js
server.use('/api/actions', actionsRouter);

// Do NOT `server.listen()` inside this file!
server.use('*', (req,res) => {
    //catch all 404 errors middleware
    res.status(404).json({
         message: `${req.method} ${req.baseUrl} not found`
    });
});

module.exports = server;
