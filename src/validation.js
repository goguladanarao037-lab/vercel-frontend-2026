// validation.js

export const validateUserForm = (form) => {
  const errors = {};

  if (!form.first_name.trim()) {
    errors.first_name = "First name is required";
  }

  if (!form.last_name.trim()) {
    errors.last_name = "Last name is required";
  }

  if (!form.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^\d{10}$/.test(form.phone)) {
    errors.phone = "Phone number must be 10 digits";
  }

  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
  ) {
    errors.email = "Invalid email address";
  }

  return errors;
};
