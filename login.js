document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('loginError');
  const successMsg = document.getElementById('loginSuccess');

  // Reset messages
  errorMsg.textContent = '';
  successMsg.textContent = '';

  // Validate inputs
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errorMsg.textContent = 'Please enter a valid email address.';
    return;
  }

  // Check credentials
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(user => user.email === email && user.password === password);

  if (!user) {
    errorMsg.textContent = 'Invalid email or password.';
    return;
  }

  // Save current user and redirect
  localStorage.setItem('currentUser', JSON.stringify({ email: user.email, name: user.name }));
  successMsg.textContent = 'Login successful! Redirecting...';
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 2000);
});