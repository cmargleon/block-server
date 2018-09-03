const mongoose = require('mongoose');
var rutVerifier = require('rut-verifier');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: 
           { type: String,
             required: true, 
             match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
            },
    password: 
            { type: String,
              required: true,
              unique: true,
              match: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/
            },
    cardId:
            { type: String,
              required: true,
              unique: true,
            },
    graduateRut:
            { type: String,
              required: true,
              unique: true,
              validate: {
                validator: function(v) {
                  console.log(v)
                  return rutVerifier.verify(v);
                },
                message: props => `${props.value} no es un RUT válido`
              }
            },
    firstName:
            { type: String,
              required: true,
            },
    lastName:
            { type: String,
              required: true
            }
});

module.exports = mongoose.model('User', userSchema);