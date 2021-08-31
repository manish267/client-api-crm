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


module.exports = {
  setPasswordResetPin
};
