const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet')
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp')





const app = express();


// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
})

app.use('/api', limiter)
app.use(helmet())

app.use(express.json());

// Data sanitization aganist noSQL query injection
app.use(mongoSanitize())

// Data sanitization aganist XSS
app.use(xss())

// prevent paramter pollution
app.use(hpp({
  whitelist: [
    'duration',
    'price',
    'ratingsQuantity',
    'ratingsAverage',
    'price',
    'maxGroupSize'
  ]
}))

// Serving static
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  // console.log(req.headers)

  next();
})
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  console.log(req.headers)
  next();
});

// 3) ROUTES


app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {

  // const err = new Error(`Can't find ${req.originalUrl} on this server!`)
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} in this server!`, 404));
})


app.use(globalErrorHandler)

// app.use((err,req,res,next)=>{
//   console.log(err.stack)

//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message
//   })
// })

module.exports = app;
