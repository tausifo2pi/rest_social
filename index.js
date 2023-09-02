const dotenv = require("dotenv")
dotenv.config()

const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')
const morgan = require('morgan');
const { createLogger, transports, format } = require('winston');
const { combine, printf } = format;

//constraints
const PORT = process.env.port
const API_NAME = process.env.API_NAME
const NODE_ENV = process.env.NODE_ENV
const API_PREFIX = process.env.API_PREFIX

const app = express()

// Define the custom log format
const myFormat = printf(({ level, message, timestamp }) => {
  return `[${level}] ${message}\x1b[33m\n`;
});

// Create the logger with the custom log format
const logger = createLogger({
  level: 'info',
  format: combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    myFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ]
});


// Database connection
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;

let uri;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  socketTimeoutMS: 30000,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  connectTimeoutMS: 30000,
};

// const 
if (NODE_ENV === "testing") {
  uri = "mongodb://127.0.0.1:27017/miniwall"


}
else {
  uri = `mongodb+srv://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPassword)}@${encodeURIComponent(dbHost)}/${encodeURIComponent(dbName)}`;

}
//dev server

//production

mongoose.set("strictQuery", true)
mongoose.connect(uri, options)
  .then(() => {
    logger.info('Connected to database');
    app.listen(process.env.PORT, () => {
      logger.info(`Server is listening on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error({ err })
    logger.error(`Failed to connect to database: ${err}`);
  });

// Middleware
app.use(cors())
app.use(express.json())


const logFormat = '\x1b[32m:method\x1b[0m :url :status :response-time ms - :res[content-length]';

// Add the morgan middleware to log each request's response time
app.use(morgan(logFormat, {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Routes

app.use(API_PREFIX, require("./router"))

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

// Graceful shutdown
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    logger.info('Database connection closed');
    process.exit(0);
  });
});
