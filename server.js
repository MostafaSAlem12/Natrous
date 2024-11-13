const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './.env' });

const DB = process.env.DATABASE

// Connect to the database
mongoose
.connect(DB)
.then(() => console.log('DB connection Successful'))
.catch(err => console.error('DB connection error:', err));

console.log('Database URL:', DB);  // Log the URL to verify it’s correct


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});


process.on('unhandledRejection', err=>{

  console.log('UNHANDLED REJECTION ❌ SHUTTING DOWN ...')
  console.log(err);
  server.close(()=>{
    process.exit(1);
    
  })
})


process.on('unhandledException', err=>{
  console.log('UNCAUGHT EXCEPTION ❌ SHUTTING DOWN ...')
  console.log(err);
  server.close(()=>{
    process.exit(1);
    
  })
})

//eslint eslint-config-prettier  prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-ally eslint-plugin-react  

