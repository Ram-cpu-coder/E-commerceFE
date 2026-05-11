export const UserSignUpInputes = [
  {
    label: "First Name",
    name: "fNAme",
    required: true,
    placeholder: "Maya",
    type: "text",
  },
  {
    label: "Last Name",
    name: "lName",
    required: true,
    placeholder: "Shrestha",
    type: "text",
  },
  {
    label: "Email",
    name: "email",
    required: true,
    placeholder: "maya@example.com",
    type: "email",
  },
  {
    label: "Phone",
    name: "phone",
    required: false,
    placeholder: "0412 345 678",
    type: "text",
  },
  {
    label: "Password",
    name: "password",
    required: true,
    placeholder: "Create a strong password",
    type: "password",
  },
  {
    label: "Confirm Password",
    name: "confirmPassword",
    required: true,
    placeholder: "Re-enter your password",
    type: "password",
  },
];

export const UserLoginInputes = [
  {
    label: "Email",
    name: "email",
    required: true,
    placeholder: "you@example.com",
    type: "email",
  },

  {
    label: "Password",
    name: "password",
    required: true,
    placeholder: "Enter your password",
    type: "password",
  },
];
