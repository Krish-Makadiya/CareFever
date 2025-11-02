const express = require('express');

const app = express();

app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to CareFever API');
});

// Define port
const PORT = process.env.PORT || 8000;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});