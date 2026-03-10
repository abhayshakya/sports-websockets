import express from 'express';

const app = express();
const PORT = 8000;

// middleware to parse JSON
app.use(express.json());

// root route
app.get('/', (req, res) => {
    res.json({ message: 'Hello from the Express server!' });
});

// start server
app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});
