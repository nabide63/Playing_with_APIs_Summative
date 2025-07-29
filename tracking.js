document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  // Display welcome message with user's name
  document.getElementById('welcomeMessage').textContent = `Welcome, ${currentUser.name}!`;
  document.getElementById('logoutBtn').style.display = 'block';

  // Logout button
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  });

  // Hamburger menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.innerHTML = navMenu.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });

  const lastPeriodInput = document.getElementById('lastPeriod');
  const saveDateBtn = document.getElementById('saveDateBtn');
  const todayStr = new Date().toISOString().split('T')[0];
  lastPeriodInput.max = todayStr;

  // Disable save button if no date is selected
  saveDateBtn.disabled = !lastPeriodInput.value;
  lastPeriodInput.addEventListener('input', () => {
    saveDateBtn.disabled = !lastPeriodInput.value;
  });

  // Load saved date from localStorage
  const savedDate = localStorage.getItem(`lastPeriodDate_${currentUser.email}`);
  if (savedDate) {
    lastPeriodInput.value = savedDate;
    showPrediction(savedDate);
  }

  // Save date button event
  document.getElementById('saveDateBtn').addEventListener('click', () => {
    const dateInput = document.getElementById('lastPeriod').value;
    if (!dateInput) {
      alert('Please select a date first.');
      return;
    }
    localStorage.setItem(`lastPeriodDate_${currentUser.email}`, dateInput);
    showSavedMessage('dateSavedMsg');
    showPrediction(dateInput);
  });

  // Clear date button
  document.getElementById('clearDateBtn').addEventListener('click', () => {
    localStorage.removeItem(`lastPeriodDate_${currentUser.email}`);
    document.getElementById('lastPeriod').value = '';
    document.getElementById('prediction-result').textContent = '';
    showSavedMessage('dateSavedMsg');
    document.getElementById('dateSavedMsg').textContent = 'Date cleared!';
  });
});

// Show date saved message briefly
function showSavedMessage(id) {
  const msg = document.getElementById(id);
  msg.classList.add('show');
  setTimeout(() => {
    msg.classList.remove('show');
  }, 2000);
}

// Predict next period date assuming 28-day cycle
function showPrediction(lastDateStr) {
  const lastDate = new Date(lastDateStr);
  if (isNaN(lastDate.getTime())) {
    document.getElementById('prediction-result').textContent = 'Invalid date selected.';
    return;
  }
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + 28);
  document.getElementById('prediction-result').textContent = `Your next estimated period start date is: ${nextDate.toDateString()}`;
}