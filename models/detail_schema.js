const mongoose=require("mongoose");
const bcrypt = require("bcryptjs");
const validator=require("validator");

const detailSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
        match: /^[a-zA-Z ]*$/
      },
      age: {
        type: Number,
        required: true,
        max: 150
      },
      gender: {
        type: String,
        
        required: true
      },
      blood_group: {
        type:String,
        required: true
      },
      date: {
        type: Date,
        required: true,
        validate: {
          validator: function(value) {
            return validator.isDate(value);
          },
          message: "Invalid date format",
            },
      },
      phone_number: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10,
        match: /^[0-9]+$/,
        validate(value){
          if(!validator.isMobilePhone(value)){
            throw new Error(alert("mobile number is invalid"));
          }
          }
      },
      medical_history: {
        type: String
      },
      password: {
        type:String,
        required: true,
        minlength:4,
        maxlength:16
      }
});
detailSchema.pre("save",async function(next){
  // Check if password field has been modified
  if(this.isModified("password")){
    // Get password value from schema
    this.password= await bcrypt.hash(this.password,10);
  }
  next();
})
const Detail=new mongoose.model('Detail',detailSchema);
module.exports=Detail;