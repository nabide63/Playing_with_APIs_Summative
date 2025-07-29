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

  // Close mobile menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });

  // Initialize default store list with images
  let stores = JSON.parse(localStorage.getItem('stores')) || [
    {
      name: 'Simba Supermarket',
      description: 'A popular supermarket chain in Kigali offering a variety of menstrual products including disposable sanitary pads and tampons.',
      address: 'KN 2 Ave, Nyarugenge, Kigali, Rwanda',
      link: 'https://simba.rw/',
      image: 'https://images.pexels.com/photos/7692280/pexels-photo-7692280.jpeg' // Placeholder: Supermarket shelf
    },
    {
      name: 'Kanis Retail Rwanda',
      description: 'An online and physical store providing hygiene products, including menstrual pads and period underwear, with fast delivery in Kigali.',
      address: 'KG 11 Ave, Kigali, Rwanda',
      link: 'https://kanis.rw/',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=100&q=80' // Placeholder: Hygiene products
    },
    {
      name: 'Roots Rwanda',
      description: 'An online store with a wide range of health and hygiene products, likely including menstrual products like pads and tampons.',
      address: 'Online only, delivers in Kigali',
      link: 'https://www.rootsrwanda.rw/',
      image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5b47b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=100&q=80' // Placeholder: Online shopping
    },
    {
      name: 'Murukali',
      description: 'A Kigali-based online marketplace offering hygiene essentials, including menstrual products, with convenient delivery options.',
      address: 'Online only, delivers in Kigali',
      link: 'https://murukali.com/',
      image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=100&q=80' // Placeholder: Marketplace
    },
    {
      name: 'Nyamirambo Women’s Center',
      description: 'A women’s cooperative offering handcrafted goods and potentially reusable menstrual products like cloth pads, supporting local women.',
      address: 'KN 12 Ave, Nyamirambo, Kigali, Rwanda',
      link: 'https://www.tripadvisor.com/Attraction_Review-g293829-d7755480-Reviews-Nyamirambo_Women_s_Center-Kigali_Kigali_Province.html',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=100&q=80' // Placeholder: Handcrafted goods
    },
    {
      name: 'Huru International',
      description: 'A nonprofit providing reusable menstrual pads and education to fight period poverty. Contact for distribution points in Kigali.',
      address: 'Contact for local partners in Kigali',
      link: 'https://www.huruinternational.org/',
      image: 'https://images.unsplash.com/photo-1596464716127-f34a6fa62e84?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=100&q=80' // Placeholder: Reusable pads
    }
  ];

  // Save stores to localStorage
  localStorage.setItem('stores', JSON.stringify(stores));

  // Render store list with images
  const storesList = document.getElementById('stores-list');
  storesList.innerHTML = stores.map(store => `
    <div class="store-card">
    <h3><i class="fas fa-store"></i> ${store.name}</h3>
    <img src="https://images.pexels.com/photos/7692280/pexels-photo-7692280.jpeg" alt="${store.name} logo" class="store-image">
      <p>${store.description}</p>
      <p><strong>Address:</strong> ${store.address}</p>
      <p><a href="${store.link}" target="_blank" class="store-link"><i class="fas fa-link"></i> Visit Website</a></p>
    </div>
  `).join('');
});