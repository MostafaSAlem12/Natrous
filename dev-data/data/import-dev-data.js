const fs= require('fs')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

dotenv.config({ path: './../../.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// Connect to the database
mongoose
.connect(DB)
.then(() => console.log('DB connection successful'))
.catch(err => console.error('DB connection error:', err));


//Read JSON file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'))


//IMPORT DATA INTO DB 

const importData = async()=>{
    try{
        await Tour.create(tours);
        console.log('data success loaded')
    }catch(err){
        console.log(err)
    }
    process.exit();

};


// DELETE ALL DATA FROM DB

const deleteData = async()=>{
    try{
        await Tour.deleteMany();
        console.log('tours deleted!')
    }catch(err){
        console.log(err)
    }
    process.exit();
}


if(process.argv[2] === '--import'){
    importData()
}else if(process.argv[2] === '--delete'){
    deleteData();
}