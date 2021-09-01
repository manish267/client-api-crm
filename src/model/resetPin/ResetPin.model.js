const { ResetPinSchema } = require("./ResetPin.schema");
const {randomPinNumber} =require("./../../utils/randomGenerator")

const setPasswordResetPin = (email) => {

  
  // read 6 digit 
  const restObj={
    email,
    pin:randomPinNumber(6)
  }

  return new Promise((resolve, reject) => {
    ResetPinSchema(restObj)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

const getPinByEmailPin=(email,pin)=>{
return new Promise((resolve,reject)=>{
  try {
    ResetPinSchema.findOne({email,pin},(error,data)=>{
      if(error){
        console.log(error);
        reject(false)
      }
      resolve(data)
    })
  } catch (error) {
    reject(error)
    console.log(error)
  }

})
}


const deletePin=(email,pin)=>{
    try {
      ResetPinSchema.findOneAndDelete({email,pin},(error,data)=>{
        if(error){
          console.log(error);
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

module.exports = {
  setPasswordResetPin,
  getPinByEmailPin,
  deletePin
};
