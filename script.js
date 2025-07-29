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

  // Display user details
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === currentUser.email) || {};
  document.getElementById('user-name').textContent = user.name || 'Unknown';
  document.getElementById('user-email').textContent = user.email || 'Unknown';
  document.getElementById('user-phone').textContent = user.phone || 'Unknown';

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

  // Load saved symptoms from localStorage
  const savedSymptoms = JSON.parse(localStorage.getItem(`symptoms_${currentUser.email}`) || '[]');
  savedSymptoms.forEach(symptom => {
    const checkbox = document.querySelector(`input[name="symptom"][value="${symptom}"]`);
    if (checkbox) checkbox.checked = true;
  });

  // Handle symptom form submission
  document.getElementById('periodForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const symptoms = Array.from(document.querySelectorAll("input[name='symptom']:checked"))
      .map(input => input.value);

    if (symptoms.length === 0) {
      alert('Please select at least one symptom.');
      return;
    }

    // Save symptoms locally with user-specific key
    localStorage.setItem(`symptoms_${currentUser.email}`, JSON.stringify(symptoms));

    const tipsDiv = document.getElementById('tips');
    tipsDiv.innerHTML = '<p>Loading suggestions <i class="fas fa-spinner fa-spin"></i></p>';

    const allTips = await Promise.all(symptoms.map((symptom, index) =>
      getTipsForSymptom(symptom).then(tip => ({
        tip,
        index
      }))
    ));

    tipsDiv.innerHTML = allTips
      .map(({ tip, index }) => `<div class="" style="animation-delay: ${index * 0.2}s;">${tip}</div>`)
      .join('');
  });
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function getTipsForSymptom(symptom) {
  const foodKeywords = {
    cramps: 'magnesium',
    headache: 'omega-3',
    nausea: 'ginger',
    bloating: 'peppermint',
    fatigue: 'iron',
    backpain: 'anti-inflammatory',
    mood: 'tryptophan'
  };

  const drugKeywords = {
    cramps: 'pain',
    headache: 'headache',
    nausea: 'nausea',
    bloating: 'digestion',
    fatigue: 'energy',
    backpain: 'pain',
    mood: 'stress'
  };

  const lifestyleTips = {
    cramps: 'Do gentle stretching or yoga, apply a warm compress to your abdomen.',
    headache: 'Stay hydrated, rest in a quiet dark room, avoid screen time.',
    nausea: 'Breathe fresh air, try ginger tea, avoid greasy food.',
    bloating: 'Take short walks, avoid carbonated drinks, eat slowly.',
    fatigue: 'Get enough sleep, try deep breathing, eat small energy-boosting snacks.',
    backpain: 'Maintain good posture, use a heating pad, try light stretches.',
    mood: 'Meditate, listen to calming music, talk to a friend or journal your thoughts.'
  };

  const foodKeyword = foodKeywords[symptom];
  const drugKeyword = drugKeywords[symptom];
  const lifestyle = lifestyleTips[symptom];

  const [foodList, medList] = await Promise.all([
    fetchFoodSuggestions(foodKeyword),
    fetchMedicationSuggestions(drugKeyword)
  ]);

  return `
    <div class="tip-block">
      <h3><i class="fas fa-check-circle"></i> ${capitalize(symptom)}</h3>
      <p><strong>Food/Supplement Suggestions:</strong></p>
      <ul>${foodList.map(f => `<li>${f}</li>`).join('')}</ul>
      <p><strong>OTC Medication Suggestions:</strong></p>
      <ul>${medList.map(m => `<li>${m}</li>`).join('')}</ul>
      <p><strong>Lifestyle Tip:</strong></p>
      <p>${lifestyle}</p>
    </div>
  `;
}

const fallbackFoodSuggestions = {
  magnesium: ['Bananas', 'Dark Chocolate', 'Almonds'],
  'omega-3': ['Salmon', 'Flaxseeds', 'Chia Seeds'],
  ginger: ['Ginger Tea', 'Crackers', 'Peppermint'],
  peppermint: ['Peppermint Tea', 'Cucumber', 'Watermelon'],
  iron: ['Spinach', 'Red Meat', 'Lentils'],
  'anti-inflammatory': ['Turmeric', 'Berries', 'Nuts'],
  tryptophan: ['Turkey', 'Bananas', 'Oats']
};

const fallbackMedicationSuggestions = {
  pain: ['Ibuprofen', 'Naproxen', 'Aspirin'],
  headache: ['Acetaminophen', 'Ibuprofen'],
  nausea: ['Dimenhydrinate', 'Meclizine'],
  digestion: ['Simethicone', 'Loperamide'],
  energy: ['Caffeine Tablets'],
  stress: ['Valerian Root', 'Melatonin']
};

async function fetchFoodSuggestions(keyword) {
  const appId = 'ea17e6dd';
  const appKey = '2bc1c87c9a75c5db823c58d917e4a0e2';
  const url = `https://trackapi.nutritionix.com/v2/search/instant?query=${encodeURIComponent(keyword)}&detailed=true`;

  try {
    const response = await fetch(url, {
      headers: {
        'x-app-id': appId,
        'x-app-key': appKey,
      },
    });
    const data = await response.json();
    console.log('🟣 Food API Response:', data);
    return data.branded?.slice(0, 5).map(item => `${item.food_name} (${item.brand_name})`) || fallbackFoodSuggestions[keyword] || ['No food suggestions available.'];
  } catch (error) {
    console.error('❌ Food API error:', error);
    return fallbackFoodSuggestions[keyword] || ['No food suggestions available.'];
  }
}

async function fetchMedicationSuggestions(keyword) {
  const url = `https://api.fda.gov/drug/label.json?search=indications_and_usage:${encodeURIComponent(keyword)}+AND+openfda.route:ORAL&limit=3`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('🟡 Medication API Response:', data);

    if (!data.results || !Array.isArray(data.results)) {
      console.warn('No medication results found.');
      return fallbackMedicationSuggestions[keyword] || ['No medication suggestions available.'];
    }

    return data.results.map(drug => drug.openfda.brand_name?.[0] || drug.openfda.generic_name?.[0] || 'Unnamed OTC Drug');
  } catch (error) {
    console.error('❌ Medication API error:', error);
    return fallbackMedicationSuggestions[keyword] || ['No medication suggestions available.'];
  }
}