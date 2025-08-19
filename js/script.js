
const app = (() => {
  const storageKey = 'customers';

  function loadCustomers() {
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  }

  function saveCustomers(customers) {
    localStorage.setItem(storageKey, JSON.stringify(customers));
  }

  function generateId() {
    return Date.now();
  }

  function renderList() {
    const customers = loadCustomers();
    const tbody = document.getElementById('customersBody');
    const noData = document.getElementById('noData');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (customers.length === 0) {
      noData.style.display = 'block';
      return;
    } else {
      noData.style.display = 'none';
    }
    customers.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${c.id}</td>
        <td>${c.firstName}</td>
        <td>${c.surname}</td>
        <td>${c.email}</td>
        <td>${c.cell}</td>
        <td>
          <a href="edit.html?id=${c.id}">Edit</a>
          <button data-id="${c.id}" class="delete-btn">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = parseInt(e.target.getAttribute('data-id'));
        const updated = customers.filter(c => c.id !== id);
        saveCustomers(updated);
        renderList();
      });
    });
  }

  function initListPage() {
    renderList();
    const form = document.getElementById('homeAddForm');
    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const firstName = document.getElementById('firstName').value.trim();
        const surname = document.getElementById('surname').value.trim();
        const email = document.getElementById('email').value.trim();
        const cell = document.getElementById('cell').value.trim();
        if (firstName && surname && email && cell) {
          const customers = loadCustomers();
          customers.push({ id: generateId(), firstName, surname, email, cell });
          saveCustomers(customers);
          renderList();
          form.reset();
        }
      });
    }
    const searchInput = document.getElementById('search');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        const q = e.target.value.toLowerCase();
        const all = loadCustomers();
        const filtered = all.filter(c =>
          c.firstName.toLowerCase().includes(q) ||
          c.surname.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.cell.toLowerCase().includes(q)
        );
        const tbody = document.getElementById('customersBody');
        tbody.innerHTML = '';
        filtered.forEach(c => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${c.id}</td>
            <td>${c.firstName}</td>
            <td>${c.surname}</td>
            <td>${c.email}</td>
            <td>${c.cell}</td>
            <td>
              <a href="edit.html?id=${c.id}">Edit</a>
              <button data-id="${c.id}" class="delete-btn">Delete</button>
            </td>
          `;
          tbody.appendChild(tr);
        });
      });
    }
  }

  function initEditPage() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const customers = loadCustomers();
    const customer = customers.find(c => c.id === id);
    if (!customer) return;
    document.getElementById('firstName').value = customer.firstName;
    document.getElementById('surname').value = customer.surname;
    document.getElementById('email').value = customer.email;
    document.getElementById('cell').value = customer.cell;
    const form = document.getElementById('editForm');
    form.addEventListener('submit', e => {
      e.preventDefault();
      customer.firstName = document.getElementById('firstName').value.trim();
      customer.surname = document.getElementById('surname').value.trim();
      customer.email = document.getElementById('email').value.trim();
      customer.cell = document.getElementById('cell').value.trim();
      saveCustomers(customers);
      window.location.href = 'index.html';
    });
  }

  return {
    initListPage,
    initEditPage
  };
})();
