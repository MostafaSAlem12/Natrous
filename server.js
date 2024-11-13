const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// Connect to the database
mongoose
.connect(DB)
.then(() => console.log('DB connection successful'))
.catch(err => console.error('DB connection error:', err));

console.log('Database URL:', DB);  // Log the URL to verify it’s correct


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});



//eslint eslint-config-prettier  prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-ally eslint-plugin-react  

