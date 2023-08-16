const mongoose=require("mongoose");
const bcrypt = require("bcryptjs");
const validator=require("validator");

const enterdetailsSchema = new mongoose.Schema({
  name: {
    type:String,
    required: true,
    minLength: 1,
    maxLength: 50,
    match: /^[a-zA-Z ]*$/
  },
  phone_number: {
    type:String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 10,
    match: /^[0-9]+$/,
    validate(value){
      if(!validator.isMobilePhone(value)){
        throw new Error("mobile number is invalid");
      }
      }
      },
  password: {
    type:String,
    required: true,
    minlength:4,
    maxlength:16
  },
  confirm_password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 16,
    validate: {
      validator: function(value) {
        // Compare confirm password with password
        return value === this.password;
      },
      message: 'Passwords do not match'
    }
  }
});
//password hashing
enterdetailsSchema.pre("save",async function(next){
  // Check if password field has been modified
  if(this.isModified("password")){
    // Get password value from schema
    this.password= await bcrypt.hash(this.password,10);
  }
  this.confirm_password=undefined;
  next();
})
const Enterdetails=new mongoose.model('Enterdetails',enterdetailsSchema);
module.exports=Enterdetails;
