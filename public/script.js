const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");

const nameError = document.getElementById("nameErrorMessage");
const phoneError = document.getElementById("phoneErrorMessage");
const emailError = document.getElementById("emailErrorMessage");

const addButton = document.getElementById("addButton");
const tableBody = document.getElementById("tableBody");
const searchBar = document.getElementById("searchBar");
const sortSelect = document.getElementById("sort");

// Hide error messages initially
nameError.style.display = "none";
phoneError.style.display = "none";
emailError.style.display = "none";

// Store contacts (load from existing table first)
let contacts = [];

// Load existing rows from HTML table into contacts array
function loadInitialContacts() {
  const rows = tableBody.querySelectorAll("tr");

  rows.forEach(row => {
    const cols = row.querySelectorAll("td");
    if (cols.length === 3) {
      contacts.push({
        name: cols[0].innerText.trim(),
        phone: cols[1].innerText.trim(),
        email: cols[2].innerText.trim()
      });
    }
  });
}

// Render table based on provided data
function renderTable(data) {
  tableBody.innerHTML = "";

  data.forEach(contact => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${contact.name}</td>
      <td>${contact.phone}</td>
      <td>${contact.email}</td>
    `;
    tableBody.appendChild(tr);
  });
}

// Validations
function isValidName(name) {
  return /^[A-Za-z ]+$/.test(name) && name.length > 0 && name.length <= 20;
}

function isValidPhone(phone) {
  return /^[0-9]{10}$/.test(phone);
}

function isValidEmail(email) {
  return (
    email.length > 0 &&
    email.length <= 40 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}

// Add Contact
addButton.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const email = emailInput.value.trim();

  let valid = true;

  if (!isValidName(name)) {
    nameError.style.display = "block";
    valid = false;
  } else {
    nameError.style.display = "none";
  }

  if (!isValidPhone(phone)) {
    phoneError.style.display = "block";
    valid = false;
  } else {
    phoneError.style.display = "none";
  }

  if (!isValidEmail(email)) {
    emailError.style.display = "block";
    valid = false;
  } else {
    emailError.style.display = "none";
  }

  if (!valid) return;

  // Add to array
  contacts.push({ name, phone, email });

  // Render updated table
  renderTable(contacts);

  // Clear inputs
  nameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
});

// Search (instant filtering)

searchBar.addEventListener("input", () => {
  const query = searchBar.value.trim();

  const filtered = contacts.filter(contact => {
    return (
      contact.name.includes(query) ||
      contact.phone.includes(query) ||
      contact.email.includes(query)
    );
  });

  renderTable(filtered);
});

// Sorting function
function applySorting() {
  const order = sortSelect.value;

  if (order === "ascending") {
    contacts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (order === "descending") {
    contacts.sort((a, b) => b.name.localeCompare(a.name));
  }

  renderTable(contacts);
}

// Sort event
sortSelect.addEventListener("change", applySorting);
sortSelect.addEventListener("click", applySorting);

// Initial load
loadInitialContacts();
