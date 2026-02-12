// validation.js
export function validateUserForm(form) {
  const errors = {};

  // First Name validation
  if (!form.first_name.trim()) {
    errors.first_name = "First Name is required";
  } else if (form.first_name.length < 2) {
    errors.first_name = "First Name must be at least 2 characters";
  }

  // Last Name validation
  if (!form.last_name.trim()) {
    errors.last_name = "Last Name is required";
  } else if (form.last_name.length < 2) {
    errors.last_name = "Last Name must be at least 2 characters";
  }

  // Phone validation
  if (!form.phone.trim()) {
    errors.phone = "Phone is required";
  } else if (!/^\d{10}$/.test(form.phone)) {
    errors.phone = "Phone must be 10 digits";
  }

  // Email validation
  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
  ) {
    errors.email = "Email is invalid";
  }

  return errors;
}
