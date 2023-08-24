const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const dotenv = require('dotenv');
const app = express(); 
const db = require('./config/db');


const homepageRouter = require('./Routes/homepageRouter');
const userRouter = require('./Routes/userRouter');
const adminRouter = require('./Routes/adminRouter');
const productRouter = require('./Routes/productRouter');

dotenv.config();
db.connect();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));


app.use('/costa', homepageRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/home', productRouter);


// app.use((req, res, next) => {
//   const error = new Error('Not Found');
//   error.status = 404;
//   next(error);
// });


// app.use((err, req, res, next) => {
  
//   res.status(err.status || 500);
//  res.render("error")
// });


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});
