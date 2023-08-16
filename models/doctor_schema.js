const mongoose=require("mongoose");
const bcrypt = require("bcryptjs");
const validator=require("validator");

const doctorSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50,
        pattern: /^[a-zA-Z ]*$/
      },
      phone_number: {
        type: String,
        required: false,
        unique: true,
        minlength: 10,
        maxlength: 10,
        Validate(value){
          if(!validator.isMobilePhone(value)){
            throw new Error("mobile number is invalid");
          }
          }
      },
      password: {
        type: String,
        required: true,
        minlength:4,
        maxlength:16
      }
});
const Doctor=new mongoose.model('Doctor',doctorSchema);
module.exports=Doctor;