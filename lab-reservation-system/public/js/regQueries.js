$(document).ready(function () {
  $('#registrationForm').on('submit', function (e) {
    e.preventDefault();
    $('#formMessage').empty();
    clearErrors();

    const errors = [];

    const firstName = $('#firstName').val().trim();
    const lastName = $('#lastName').val().trim();
    const email = $('#email').val().trim();
    const id = $('#id').val().trim();
    const username = $('#username').val().trim();
    const password = $('#password').val();
    const confirmPassword = $('#confirmPassword').val();

    // Validation rules
    if (!/^[a-zA-Z]{2,}$/.test(firstName)) {
      errors.push('First name must be at least 2 letters and contain only letters.');
      showError('#firstName');
    }

    if (!/^[a-zA-Z]{2,}$/.test(lastName)) {
      errors.push('Last name must be at least 2 letters and contain only letters.');
      showError('#lastName');
    }

    if (!/^[1-100]$/.test(email)) {
      errors.push('Please enter a valid email address.');
      showError('#email');
    }

    if (id && !/^(\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$/.test(phone)) {
      errors.push('Please enter a valid id number.');
      showError('#id');
    }

    if (!/^[a-zA-Z0-9]{4,}$/.test(username)) {
      errors.push('Username must be at least 4 characters and contain only letters and numbers.');
      showError('#username');
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)) {
      errors.push('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
      showError('#password');
    }

    if (password !== confirmPassword) {
      errors.push('Passwords do not match.');
      showError('#confirmPassword');

    // Output result
    if (errors.length > 0) {
      $('#formMessage').html(`<div class="error">${errors.join('<br>')}</div>`);
    } else {
      $('#formMessage').html('<div class="success">Registration successful!</div>');
      //this.reset();
      this.submit();
    }
  });

  function showError(selector) {
    $(selector).css('border-color', 'red');
  }

  function clearErrors() {
    $('#registrationForm input, #registrationForm select').css('border-color', '');
  }
});
