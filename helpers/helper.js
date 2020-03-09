const rand = require("strong-password-generator");
const  defaultPasswordConfig = {
    base: 'WORD',
    length: {
      min: 8,
      max: 12
    },
    capsLetters: {
      min: 3,
      max: 6
    },
    numerals: {
      min: 2,
      max: 5
    },
    spacialCharactors: {
      includes: ['@'],
      min: 1,
      max: 1
    },
    spaces: {
      allow: false,
      min: 0,
      max: 0
    }
  };

 exports.generatePassword = function generatePassword(){
      return rand.generatePassword(defaultPasswordConfig);
  };