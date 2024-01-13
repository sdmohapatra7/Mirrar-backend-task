const mongoose = require('mongoose');

mongoose.connect(process.env.URL)
    .then(()=>console.log('Mongodb is Up and Connected'));
    // .catch((err)=>console.log('Error While Connect To MongoDb',err)); 