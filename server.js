const throng = require('throng');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const winston = require('winston');

const { router: userRouter } = require('./routers/user.router');

const app = express();

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL, CONCURRENCY: WORKERS, ENV } = require('./config/config');

/* Middlewares */
// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
});

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Logging
morgan.token('processId', () => process.pid);
if (ENV === 'development') {
    app.use(morgan(':processId - :method :url :status :response-time ms - :res[content-length]'));
}


/* Routes */
app.get('/status', (req, res) => {
    res.json({ processId: process.pid });
});


app.use('/api', userRouter )
/* Starting Scripts */
let server;
function runServer(databaseUrl) {
    return new Promise((res, rej) => {
        mongoose.connect(databaseUrl, (err) => {
            if (err) {
                return rej(err);
            }
            if (ENV === 'development') {
                winston.info(`Connected to ${databaseUrl}`);
            } else {
                winston.info('Connected to database');
            }
            server = app.listen(PORT, () => {
                winston.info(`App is listening on port ${PORT}`);
                winston.info(`App is running in ${ENV} environment`);
                winston.info(`Worker process id: ${process.pid}`);
                winston.info('=========================================');
                res();
            })
            .on('error', (error) => {
                mongoose.disconnect();
                rej(error);
            });
            return server;
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => (
        new Promise((res, rej) => {
            winston.info('Closing server.');
            server.close((err) => {
                if (err) {
                    return rej(err);
                }
                return res();
            });
        })
    ));
}

if (require.main === module) {
    throng({
        workers: WORKERS,
        lifetime: Infinity,
    }, () => {
        runServer(DATABASE_URL).catch(err => winston.info(err));
    });
}

module.exports = { app, runServer, closeServer };
