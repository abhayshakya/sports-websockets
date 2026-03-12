import express from 'express';
import http from 'http';
import { matchRouter } from '../src/routes/matches.js';
import { attachWebSocketServer } from './ws/server.js';
import { securityMiddleware } from './arcjet.js';

const PORT = Number(process.env.PORT || '8000');
// HOST is a string (could be 'localhost', '0.0.0.0', etc.)
const HOST = process.env.HOST || '0.0.0.0';

const app = express();
const server = http.createServer(app);
// middleware to parse JSON
app.use(express.json());

// root route
app.get('/', (req, res) => {
    res.json({ message: 'Hello from the Express server!' });
});

app.use(securityMiddleware());

app.use('/matches', matchRouter);

const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

// start server
server.listen(PORT, HOST, () => {
    const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;

    console.log(`Server running at ${baseUrl}`);
    console.log(`WebSocket server available at ${baseUrl.replace('http', 'ws')}/ws`);
});
