// validate password passwordmby using regex
//At least one digit
//1 uppercase
//1 lowercase
//1- digit
//1 -special character (!@#$%^&*()<>?{|})
//paswword didnt match

export const validator = (password = "", confirmPassword = "") => {
  const error = [];

  password.length < 4 && error.push("At least 4 characters required");

  !/[A-Z]/.test(password) &&
    error.push("Password must contain at least one UPPERCASE");

  !/[a-z]/.test(password) &&
    error.push("Password must contain at least one lowercase");

  !/[0-9]/.test(password) &&
    error.push("Password must contain at least one number");

  !/[!@#$%^&*()<>?{|]/.test(password) &&
    error.push("Password must contain at least one special character");

  password !== confirmPassword && error.push("Password did not match");
  return error;
};
