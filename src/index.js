const express = require('express');
const bodyParser = require("body-parser");
const router = require('./router');

const app = express();

app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router);

const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});

