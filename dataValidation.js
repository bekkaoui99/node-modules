const getNumber = (text) => {
  const elements = text.split("");

  const numbersArray = elements.filter((element) => !isNaN(parseInt(element)));

  let result = numbersArray.join("");
  return result;
};

const getString = (text) => {
  const elements = text.split("");

  const numbersArray = elements.filter((element) => isNaN(parseInt(element)));

  let result = numbersArray.join("");
  return result;
};

const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\d{10}$/; // Assumes a 10-digit phone number
  const isValid = phoneRegex.test(phoneNumber);
  const message = isValid
    ? "Valid phone number"
    : "Invalid phone number. Please enter a 10-digit number.";
  return {
    data: phoneNumber,
    isValid,
    message,
  };
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  const message = isValid
    ? "Valid email address"
    : "Invalid email address. Please enter a valid email.";
  return {
    data: email,
    isValid,
    message,
  };
};

const validateName = (name) => {
  const nameRegex = /^[A-Za-z]+$/;
  const isValid = nameRegex.test(name);
  const message = isValid
    ? "Valid name"
    : "Invalid name. Please enter letters only.";
  return {
    data: name,
    isValid,
    message,
  };
};

const validateUrl = (url) => {
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  const isValid = urlRegex.test(url);
  const message = isValid
    ? "Valid URL"
    : "Invalid URL. Please enter a valid URL.";
  return {
    data: url,
    isValid,
    message,
  };
};

module.exports = {
  validatePhoneNumber,
  validateEmail,
  validateName,
  validateUrl,
  getNumber,
  getString,
};
