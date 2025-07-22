// --- Дані автомобілів ---
const cars = [
  {
    name: "Toyota Corolla",
    price: 800,
    img: "images/Toyota Corolla.jpg",
    desc: "Надійний, економний та комфортний автомобіль для міста і подорожей."
  },
  {
    name: "Volkswagen Golf",
    price: 900,
    img: "images/Volkswagen Golf.jpg",
    desc: "Стильний хетчбек з сучасними технологіями."
  },
  {
    name: "Renault Duster",
    price: 1000,
    img: "images/Renault Duster.jpg",
    desc: "Позашляховик для будь-яких доріг та пригод."
  },
  {
    name: "Ford Focus",
    price: 850,
    img: "images/Ford Focus.jpg",
    desc: "Динамічний та зручний автомобіль для щоденних поїздок."
  },
  {
    name: "Hyundai Tucson",
    price: 1200,
    img: "images/Hyundai Tucson.jpg",
    desc: "Сучасний кросовер для сімейних подорожей та активного відпочинку."
  },
  {
    name: "BMW X5",
    price: 2000,
    img: "images/BMW X5.jpg",
    desc: "Преміум SUV для справжніх поціновувачів комфорту та стилю."
  },
  {
    name: "Audi A6",
    price: 1800,
    img: "images/Audi A6.jpg",
    desc: "Бізнес-клас для ділових поїздок та подорожей."
  },
  {
    name: "Mercedes-Benz E-Class",
    price: 2200,
    img: "images/Mercedes-Benz E-Class.jpg",
    desc: "Розкіш та інновації у кожній деталі."
  },
  {
    name: "Kia Sportage",
    price: 1100,
    img: "images/Kia Sportage.jpg",
    desc: "Міський кросовер для активного способу життя."
  },
  {
    name: "Nissan Qashqai",
    price: 1050,
    img: "images/Nissan Qashqai.jpg",
    desc: "Ідеальний вибір для сімейних подорожей."
  }
];

// --- Очищення старих оренд з localStorage (для коректних зображень) ---
(function fixOldRents() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.rents && user.rents.length > 0) {
    user.rents = [];
    localStorage.setItem('user', JSON.stringify(user));
  }
})();

// --- Рендеринг авто ---
const carsList = document.getElementById('carsList');
function renderCars() {
  carsList.innerHTML = '';
  cars.forEach((car, idx) => {
    const card = document.createElement('div');
    card.className = 'car-card';
    card.innerHTML = `
      <img src="${car.img}" alt="${car.name}">
      <h2>${car.name}</h2>
      <p>${car.desc}</p>
      <div class="price">${car.price} грн/день</div>
      <button class="rent-btn" data-idx="${idx}">Орендувати</button>
    `;
    carsList.appendChild(card);
  });
}
renderCars();

// --- Модальні вікна ---
function showModal(id) {
  document.getElementById(id).style.display = 'block';
}
function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}
['closeRent','closeRegister','closeLogin','closeWallet'].forEach(id => {
  document.getElementById(id).onclick = () => closeModal(id.replace('close','').toLowerCase()+'Modal');
});
window.onclick = function(event) {
  ['rentModal','registerModal','loginModal','walletModal'].forEach(id => {
    const modal = document.getElementById(id);
    if (event.target === modal) modal.style.display = 'none';
  });
};

// --- Користувач та баланс ---
function getUser() {
  return JSON.parse(localStorage.getItem('user'));
}
function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}
function logout() {
  localStorage.removeItem('user');
  updateHeader();
  renderMyRents();
}
function updateHeader() {
  const user = getUser();
  document.getElementById('loginBtn').style.display = user ? 'none' : 'inline-block';
  document.getElementById('registerBtn').style.display = user ? 'none' : 'inline-block';
  document.getElementById('walletBtn').style.display = user ? 'inline-block' : 'none';
  if (user) {
    if (!document.getElementById('logoutBtn')) {
      const btn = document.createElement('button');
      btn.id = 'logoutBtn';
      btn.textContent = 'Вийти ('+user.name+')';
      btn.onclick = logout;
      document.querySelector('.header-actions').appendChild(btn);
    }
  } else {
    const btn = document.getElementById('logoutBtn');
    if (btn) btn.remove();
  }
  document.getElementById('myRentsSection').style.display = user ? 'block' : 'none';
}
updateHeader();

// --- Реєстрація ---
document.getElementById('registerBtn').onclick = () => showModal('registerModal');
document.getElementById('registerForm').onsubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass = document.getElementById('regPassword').value;
  if (!name || !email || !pass) return;
  setUser({name, email, pass, balance: 2000, rents: []});
  document.getElementById('registerResult').textContent = 'Реєстрація успішна!';
  setTimeout(()=>{ closeModal('registerModal'); updateHeader(); renderMyRents(); }, 1000);
};

// --- Вхід ---
document.getElementById('loginBtn').onclick = () => showModal('loginModal');
document.getElementById('loginForm').onsubmit = function(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;
  const user = getUser();
  if (user && user.email === email && user.pass === pass) {
    document.getElementById('loginResult').textContent = 'Вхід успішний!';
    setTimeout(()=>{ closeModal('loginModal'); updateHeader(); renderMyRents(); }, 1000);
  } else {
    document.getElementById('loginResult').textContent = 'Невірний email або пароль!';
  }
};

// --- Гаманець ---
document.getElementById('walletBtn').onclick = () => {
  const user = getUser();
  if (!user) return;
  document.getElementById('walletInfo').innerHTML = `<b>Баланс:</b> ${user.balance} грн`;
  document.getElementById('addFundsResult').textContent = '';
  showModal('walletModal');
};
document.getElementById('addFundsForm').onsubmit = function(e) {
  e.preventDefault();
  const sum = parseInt(document.getElementById('addFunds').value);
  if (sum > 0) {
    const user = getUser();
    user.balance += sum;
    setUser(user);
    document.getElementById('walletInfo').innerHTML = `<b>Баланс:</b> ${user.balance} грн`;
    document.getElementById('addFundsResult').textContent = 'Баланс поповнено!';
  }
};

// --- Оренда авто ---
carsList.onclick = function(e) {
  if (e.target.classList.contains('rent-btn')) {
    const idx = e.target.getAttribute('data-idx');
    const car = cars[idx];
    document.getElementById('rentCarInfo').innerHTML = `
      <img src="${car.img}" alt="${car.name}" style="width:140px;height:80px;object-fit:cover;margin-bottom:10px;border-radius:10px;">
      <div><b>${car.name}</b></div>
      <div>${car.desc}</div>
      <div style="margin:8px 0;"><b>Ціна:</b> ${car.price} грн/день</div>
    `;
    document.getElementById('rentResult').textContent = '';
    document.getElementById('rentForm').setAttribute('data-idx', idx);
    showModal('rentModal');
  }
};
document.getElementById('rentForm').onsubmit = function(e) {
  e.preventDefault();
  const idx = this.getAttribute('data-idx');
  const days = parseInt(document.getElementById('rentDays').value);
  const car = cars[idx];
  const user = getUser();
  if (!user) {
    document.getElementById('rentResult').textContent = 'Спочатку увійдіть або зареєструйтесь!';
    return;
  }
  const total = car.price * days;
  if (user.balance < total) {
    document.getElementById('rentResult').textContent = 'Недостатньо коштів на балансі!';
    return;
  }
  user.balance -= total;
  // Додаємо оренду з тим самим зображенням
  if (!user.rents) user.rents = [];
  user.rents.push({
    name: car.name,
    img: car.img,
    desc: car.desc,
    days,
    total
  });
  setUser(user);
  document.getElementById('rentResult').textContent = `Оренда підтверджена! Знято ${total} грн. Дякуємо!`;
  renderMyRents();
  setTimeout(()=>{ closeModal('rentModal'); }, 1200);
};

// --- Відображення моїх оренд ---
function renderMyRents() {
  const user = getUser();
  const section = document.getElementById('myRentsSection');
  const list = document.getElementById('myRentsList');
  if (!user || !user.rents || user.rents.length === 0) {
    list.innerHTML = '<div style="color:#888;text-align:center;">У вас ще немає орендованих авто.</div>';
    return;
  }
  list.innerHTML = '';
  user.rents.slice().reverse().forEach(rent => {
    const card = document.createElement('div');
    card.className = 'my-rent-card';
    card.innerHTML = `
      <img src="${rent.img}" alt="${rent.name}">
      <div class="rent-title">${rent.name}</div>
      <div class="rent-desc">${rent.desc}</div>
      <div class="rent-days">Орендовано на <b>${rent.days}</b> днів</div>
      <div class="rent-total">Сума: ${rent.total} грн</div>
    `;
    list.appendChild(card);
  });
}
renderMyRents(); 
