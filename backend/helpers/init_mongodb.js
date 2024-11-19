const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI,{
    dbName: process.env.DB_NAME,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    
})
.then(()=>{
    console.log(`MongoDB Connected to database: ${process.env.DB_NAME}`);
})
.catch(err => console.log(err.message))


mongoose.connection.on('connected',()=>{
    console.log(`Mongoose Connected to database: ${process.env.DB_NAME}`);
})
mongoose.connection.on('error',(err)=>{
    console.log('err.message')
})

mongoose.connection.on('disconnected' , ()=>{
    console.log('Mongooose connection is disconnected..')
})

process.on('SIGINT' , async()=>{
    await mongoose.connection.close()
    process.exit(0)
})
