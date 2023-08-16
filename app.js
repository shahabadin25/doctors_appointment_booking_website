const bodyParser = require("body-parser");
const express=require("express");
const path = require("path");
const app=express();
const mongoose=require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require('fs');
const ejs = require('ejs');
const alert=require("alert");
//const router=express.Router();
require("./db/conn");
const Detail=require("./models/detail_schema");
const Doctor=require("./models/doctor_schema");
const Enterdetails=require("./models/enterdetails_schema");
const { ifError } = require("assert");



const port =process.env.PORT  || 80;

// Set the public directory as the static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false })); 
app.use(express.urlencoded({ extended: true }));
// Middleware setup
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.set('view engine', 'ejs');
 // Set the views directory to the "public" directory
app.set('views', path.join(__dirname, 'public'));



// get request for detail.html
app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, 'public', 'detail.html'));
  });
  

//create a new user in database
app.post("/detail", async (req, res) => {
  try {
    const { name, age, gender, blood_group, date, phone_number, medical_history,password } = req.body;

    const user = await Enterdetails.findOne({ phone_number: phone_number });

    if (!user) {
      return res.status(401).render("user not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const alertMessage=`incorrect password!`
     alert(alertMessage);
    }
    const currentDate = new Date(date);
    const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
    const count = await Detail.countDocuments({
      date: { $gte: startOfDay, $lt: endOfDay }
    });

    if (count >= 20) {
      const alertMessage = `Doctor's schedule is packed for ${date}.Please book an appointment for another date.`;
      alert(alertMessage);
    }

    const newDetail = new Detail({
      name,
      age,
      gender,
      blood_group,
      date,
      phone_number,
      medical_history,
      password
    });
    await newDetail.save();
    
    //deletes the data from the database after one day
    await Detail.deleteMany({ date: { $lt: date } }); 
    const alertMessage=`Your appoinment has been booked for ${date} successfully!`
    alert(alertMessage);
    res.status(201).redirect("index.html");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});



    // Serve enterdetails.html
   
app.get('/enterdetails.html', (req, res) => {
  return res.sendFile(path.join(__dirname, 'public', 'enterdetails.html'));
});

// Redirect to enterdetails.html
app.get('/open-enterdetails-page', (req, res) => {
  res.redirect('/enterdetails.html');
});
  

  
app.post('/enterdetails',async(req,res)=>{
  const {name, phone_number, password, confirm_password}=req.body;
  if(!name ||  !phone_number || !password || !confirm_password){
    return res.status(422).json({error: "please fill the field property"});
  }
  try{
    const userExist=await Enterdetails.findOne({ phone_number: phone_number,name: name});
    if(userExist){
      console.log(userExist);
      return res.status(422).json({error: "you are already registered"});  
    }
    if(password==confirm_password){
      const appointment = new Enterdetails({
        name,
        phone_number,
        password,
        confirm_password
      });
      await appointment.validate();
      await appointment.save();
      
      console.log(appointment);
      res.status(201).redirect('/index.html');
      const alertMessage=`Congratulations! You have been successfully registered!`
     alert(alertMessage);
    }else{
      const alertMsg=`Passwords should match!`
      alert(alertMsg);
    }
    
    
  }catch(e){
    console.log(e);
  }
})



// Serve doctor.html
app.get('/doctor.html', (req, res) => {
    return res.sendFile(path.join(__dirname, 'public', 'doctor.html'));
  });
  
  // Redirect to doctor.html
  app.get('/open-doctor-page', (req, res) => {
    res.redirect('/doctor.html');
  });


  



// post request for doctor.html
app.post('/doctor', async (req, res) => {
  try {
    const appointment = new Doctor({
      name: req.body.name,
      phone_number: req.body.phone_number,
      password: req.body.password,
    });

    // for phone number comparison
const docphn = await Doctor.findOne({ phone_number: req.body.mobile_number });

if (!docphn) {
  return res.send("User not found"); // Send an error response if the user is not found
}

try {
  const isMatch = await docphn.comparePassword(req.body.password);
  if (!isMatch) {
    return res.send("Invalid password"); // Send an error response if the password is incorrect
  }

 } catch (error) {
  return res.status(500).send("Error comparing passwords");
}



// for compare passwords
Doctor.methods.comparePassword = async function (enteredPassword) {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    return isMatch;
  } catch (error) {
    throw new Error(error);
  }
};

Doctor.methods.comparePassword = function (enteredPassword, callback) {
  bcrypt.compare(enteredPassword, this.password, (error, isMatch) => {
    if (error) {
      return callback(error);
    } 
  });
  };

      
    await appointment.save();
    console.log(appointment);
    res.status(201).redirect('/doctor.html');
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});



//fetch all
function formatDate(date) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Date(date).toLocaleDateString(undefined, options);
}

app.use(express.static(path.join(__dirname, "public")));
app.get("/table", async (req, res) => {
  try {
    const userDetails = await Detail.find();

    res.render("table", { userDetails });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

app.listen(port, ()=>{
    console.log(`server is running at port no ${port}`);
})

