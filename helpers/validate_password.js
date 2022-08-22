module.exports = function checkPasswordValidation(value) {
    const isWhitespace = /^(?=.*\s)/;
    if (isWhitespace.test(value)) {
      return "Password must not contain Whitespaces.";
    }
    const isContainsUppercase = /^(?=.*[A-Z])/;
    if (!isContainsUppercase.test(value)) {
      return "ต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัวอักษร";
    }
  
  
    const isContainsLowercase = /^(?=.*[a-z])/;
    if (!isContainsLowercase.test(value)) {
      return "ต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัวอักษร";
    }
  
  
    const isContainsNumber = /^(?=.*[0-9])/;
    if (!isContainsNumber.test(value)) {
      return "ต้องมีตัวเลขอย่างน้อย 1 หลัก";
    }
  
  
    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;
    if (!isContainsSymbol.test(value)) {
      return "ต้องมีสัญลักษณ์พิเศษอย่างน้อย 1 ตัวอักษร";
    }
  
  
    const isValidLength = /^.{8,16}$/;
    if (!isValidLength.test(value)) {
      return "รหัสผ่านอย่างน้อย 8 ตัวอักษร";
    }
    return null;
  };