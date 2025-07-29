document.getElementById('signupForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  const phone = document.getElementById('phone').value.trim();
  const errorMsg = document.getElementById('signupError');
  const successMsg = document.getElementById('signupSuccess');

  // Reset messages
  errorMsg.textContent = '';
  successMsg.textContent = '';

  // Validate inputs
  if (name.length < 2) {
    errorMsg.textContent = 'Name must be at least 2 characters long.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errorMsg.textContent = 'Please enter a valid email address.';
    return;
  }
  if (password.length < 6) {
    errorMsg.textContent = 'Password must be at least 6 characters long.';
    return;
  }
  if (!/^[0-9]{10}$/.test(phone)) {
    errorMsg.textContent = 'Phone number must be 10 digits.';
    return;
  }

  // Check if email already exists
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.some(user => user.email === email)) {
    errorMsg.textContent = 'Email already registered. Please log in.';
    return;
  }

  // Save user data
  users.push({ name, email, password, phone });
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify({ email, name }));

  // Show success message and redirect
  successMsg.textContent = 'Sign-up successful! Redirecting to login...';
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 2000);
});