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

// Hide errors initially
nameError.style.display = "none";
phoneError.style.display = "none";
emailError.style.display = "none";

let contacts = [];

// ------------------- VALIDATIONS -------------------
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

// ------------------- LOCAL STORAGE -------------------
function saveContacts() {
  localStorage.setItem("phoneDirectoryContacts", JSON.stringify(contacts));
}

function loadContacts() {
  const stored = localStorage.getItem("phoneDirectoryContacts");

  if (stored) {
    contacts = JSON.parse(stored);
  } else {
    // Default contact if no data exists
    contacts = [
      { name: "John Doe", phone: "9999999999", email: "john@email.com" }
    ];
    saveContacts();
  }
}

// ------------------- RENDER TABLE -------------------
function renderTable(data) {
  tableBody.innerHTML = "";

  data.forEach(contact => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${contact.name}</td>
      <td>${contact.phone}</td>
      <td>${contact.email}</td>
    `;

    tableBody.appendChild(row);
  });
}

// ------------------- UNIQUE CHECK -------------------
function isPhoneUnique(phone) {
  return !contacts.some(contact => contact.phone === phone);
}

function isEmailUnique(email) {
  return !contacts.some(contact => contact.email === email);
}

// ------------------- ADD CONTACT -------------------
addButton.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const email = emailInput.value.trim();

  let valid = true;

  // Name validation
  if (!isValidName(name)) {
    nameError.innerText = "Only alphabets/spaces allowed (max 20 chars)";
    nameError.style.display = "block";
    valid = false;
  } else {
    nameError.style.display = "none";
  }

  // Phone validation
  if (!isValidPhone(phone)) {
    phoneError.innerText = "Phone number must be exactly 10 digits";
    phoneError.style.display = "block";
    valid = false;
  } else if (!isPhoneUnique(phone)) {
    phoneError.innerText = "This phone number already exists";
    phoneError.style.display = "block";
    valid = false;
  } else {
    phoneError.style.display = "none";
  }

  // Email validation
  if (!isValidEmail(email)) {
    emailError.innerText = "Enter a valid email (max 40 chars)";
    emailError.style.display = "block";
    valid = false;
  } else if (!isEmailUnique(email)) {
    emailError.innerText = "This email already exists";
    emailError.style.display = "block";
    valid = false;
  } else {
    emailError.style.display = "none";
  }

  if (!valid) return;

  // Add contact
  contacts.push({ name, phone, email });

  // Save + render
  saveContacts();
  renderTable(contacts);

  // Clear inputs
  nameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
});

// ------------------- SEARCH (Instant) -------------------
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

// ------------------- SORT -------------------
function applySorting() {
  const order = sortSelect.value;

  if (order === "ascending") {
    contacts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (order === "descending") {
    contacts.sort((a, b) => b.name.localeCompare(a.name));
  }

  saveContacts();
  renderTable(contacts);
}

sortSelect.addEventListener("change", applySorting);

// ------------------- INITIAL LOAD -------------------
loadContacts();
renderTable(contacts);
