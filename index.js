const express = require('express');
const bodyParser = require('body-parser');
const rfs = require('rotating-file-stream');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const expressOasGenerator = require('express-oas-generator');

const profsRouter = require('./routers/profsRouter').router;
const messageRouter = require('./routers/messagesRouter').router;
const etudiantsRouter = require('./routers/etudiantsRouter').router;
const classesRouter = require('./routers/classeRouter').router;

const app = express();

let whitelist = ['http://localhost:3000'];

let corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

app.use(cors(corsOptions)); // ✅ AVANT LES ROUTES

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

expressOasGenerator.handleResponses(app, {});

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: path.join(__dirname, 'log')
});
app.use(morgan('combined', { stream: accessLogStream }));

app.use('/api/v1', profsRouter);
app.use('/api/v1', etudiantsRouter);
app.use('/api/v1', messageRouter);
app.use('/api/v1', classesRouter);

app.get('/', (req, res) => {
    res.send("API REST avec Express");
});

expressOasGenerator.handleRequests();

app.listen(8080, () => {
    console.log("Ecoute du port 8080");
});
