'use strict';

// load modules
const express = require('express');
const res = require('express/lib/response');
const morgan = require('morgan');
const { sequelize } = require('./models');
const cors = require('cors');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

app.use(express.json());

//Enable all CORS Requests
app.use(cors());

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// route middleware
const userRouter = require('./routes/userRoutes');
const courseRouter = require('./routes/courseRoutes');
app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);

//sync app with database
(async () =>{
  try {
    await sequelize.authenticate();
    console.log('Successfully connected to the database');
  } catch(error) {
    console.log('Unable to connect to the database: ', error);
  }
})();

// send 404 if no other route matched
app.use((req, res, next) => {
  const err = new Error('Route Not Found');
  err.status = 404;
  next(err);
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });

});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

