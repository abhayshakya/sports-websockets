import express from 'express';
import { matchRouter } from '../src/routes/matches.js';
const app = express();
const PORT = 8000;

// middleware to parse JSON
app.use(express.json());

// root route
app.get('/', (req, res) => {
    res.json({ message: 'Hello from the Express server!' });
});

app.use('/matches', matchRouter);

// start server
app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});
