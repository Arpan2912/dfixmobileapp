export default class Validation {

  /**
   * @description Empty/Whitespace validator
   * @param control 
   */
  static noEmptyWhiteSpace(text) {
    if (text) {
      if (text.indexOf(' ') >= 0) {
        return { error: true, errorMsg: 'No empty white space allowed' };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  static onlyWhiteSpaceNotAllowed(text) {
    if (text) {
      if (text.indexOf(' ') >= 0) {
        // check wether any character inside string 
        var charactersValidator = text.search(/[a-zA-Z0-9!@#$%&'*+\/=?^_`{|}~-]/);
        if (charactersValidator == -1) {
          return { error: true, errorMsg: 'Only white space not allowed' };
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  /**
   * @description email validator
   * @param control 
   */
  static emailValidator(email) {
    const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email) {
      // if (email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
      if (email.match(pattern)) {
        return null;
      } else {
        return { error: true, errorMsg: 'Email is not valid'};
      }
    } else {
      return null;
    }
  }

  /**
   * @description password validator
   * @param control 
   */
  static passwordValidator(text) {
    // [^ ]*         - Assert password has no spaces
    if (text && text.match(/^[^ ]*$/)) {
      return null;
    } else {
      return { error: true, errorMsg: 'Password should not contain spaces'};
    }
  }

  /**
   * @description username validator
   * @param control 
   */
  static usernameValidator(text) {
    if (text && text.trim() === '' || text.match(/^[a-zA-Z]+$/)) {
      return null;
    } else {
      return { error: true, errorMsg: 'UserName is not valid' };
    }
  }

  /**
   * @description Password match validators
   * @param group 
   */
  static passwordMatchValidator(password,confirmPassword) {
    if (password == confirmPassword) {
      return null;
    } else {
      return { error: true, errorMsg: 'Password does not match' };
    }
  }


  /**
   * @description Number validator (Allow only positive integer or decimal number)
   * @param control 
   */
  static numberValidator(number) {
    let pattern = /^[0-9]+(\.[0-9]+)?$/;
    if (number.length === 0) {
      return { error: true, errorMsg: 'Number is empty' }
    } else if (false === pattern.test(number)) {
      return { error: true, errorMsg: 'Please enter only numbers'}
    } else {
      return null;
    }
  }

  static mobileNumberValidator(number) {
    // let number = number;
    if (!!number) {
      number = number.replace(/^[+-.\s()]/g, "");
      number = (!!number) ? number.trim() : "";
      let pattern = /^[0-9+-.\s()]+$/;

      if (number.length === 0) {
        return null;
      } else if (false === pattern.test(number)) {
        console.log("invalid number");
        return { error: true, errorMsg: 'Mobile Number is not valid' }
      } else {
        return null;
      }
    }
  }

//   static customEmailValidator(control) {
//     let number = control.value;
//     let pattern = /^[0-9]+(\.[0-9]+)?$/;
//     if (number.length === 0) {
//       return { blankNumber: true }
//     } else if (false === pattern.test(number)) {
//       return { invalidNumber: true }
//     } else {
//       return null;
//     }
//   }

  /**
   * @description email validator with requried field
   * @param control 
//    */
//   static emailValidatorWithRequired(control) {
//     let email = control && control.value ? control.value.toLowerCase() : control.value;
//     let pattern = /[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
//     if (email.length === 0) {
//       return { 'blankEmailAddress': true };
//     } else if (false === pattern.test(email)) {
//       return { 'invalidEmailAddress': true };
//     } else {
//       return null;
//     }
//   }

//   static dateValidator(control) {
//     if (control && control.value) {
//       let d = control.value;
//       try {
//         let newDate = moment(d);
//         if (newDate.isValid()) {
//           return null;
//         } else {
//           return { invalidDate: true }
//         }
//       } catch (e) {
//         return { invalidDate: true }
//       }
//     }
//   }


}