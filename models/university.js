const mongoose = require('mongoose');

const universitySchema = mongoose.Schema({
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
    universityRut:
            { type: String,
              required: true,
              unique: true,
              match: /^0*(\d{1,3}(\.?\d{3})*)\-?([\dkK])$/
            },
    shortName:
            { type: String,
              required: true,
            },
    fullName:
            { type: String,
              required: true
            }
});

module.exports = mongoose.model('University', universitySchema);