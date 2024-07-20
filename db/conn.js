const mongoose= require("mongoose");

mongoose.connect("mongodb+srv://shahabadin25:adin2001@cluster0.hcla0xa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/appointment",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log(`connection successful`);
}).catch((e)=>{
    console.log(e);
})
