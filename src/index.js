const express = require('express');

const router = require('./router');

const app = express();

app.use(express.json());

app.use('/', router);

const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});

