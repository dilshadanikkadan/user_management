const mongoose = require('mongoose')

const mongooseConnect =async ()=>{
    const mongoUrl= process.env.MONGO__URL
    try {
        await mongoose.connect(mongoUrl, {})

        console.log("conncted to mongoDb local database");
    } catch (error) {
        console.log(`something error : ${error}`);   
    }
}

module.exports =mongooseConnect