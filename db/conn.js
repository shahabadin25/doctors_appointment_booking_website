const mongoose= require("mongoose");

mongoose.connect("mongodb+srv://shahabadin25:Cx4Z5WQoYLmvyto1@cluster0.vi2nyjz.mongodb.net/appointment",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log(`connection successful`);
}).catch((e)=>{
    console.log(e);
})