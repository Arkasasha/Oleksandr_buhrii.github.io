document.querySelectorAll(".slider").forEach(slider => {
  const span = document.getElementById(slider.id + "Value");
  slider.oninput = () => (span.textContent = slider.value);
});

const button = document.querySelector("button[type='button']");
const output1Div = document.getElementById("output1");
const output2Div = document.getElementById("output2");
const popup = document.getElementById("popup");

button.addEventListener("click", function (event) {
  event.preventDefault(); // stop page reload

  // Collect values into an object
  const formData = {
    name: document.getElementById("name-field").value,
    surname: document.getElementById("surname-field").value,
    email: document.getElementById("email-field").value,
    phone: document.getElementById("phonenumber-field").value,
    address: document.getElementById("address-field").value,
    rating1: document.getElementById("q1").value,
    rating2: document.getElementById("q2").value,
    rating3: document.getElementById("q3").value
  };

  // Print object in console
  console.log(formData);

  // Display nicely formatted output under the form
  output1Div.innerHTML = `
    <strong>Name:</strong> ${formData.name}<br>
    <strong>Surname:</strong> ${formData.surname}<br>
    <strong>Email:</strong> ${formData.email}<br>
    <strong>Phone number:</strong> ${formData.phone}<br>
    <strong>Address:</strong> ${formData.address}<br><br>

    <strong>Resume clarity rating:</strong> ${formData.rating1}/10<br>
    <strong>Resume relevance rating:</strong> ${formData.rating2}/10<br>
    <strong>Resume quality rating:</strong> ${formData.rating3}/10<br>
  `;

  let averageScore = (parseInt(formData.rating1) + parseInt(formData.rating2) + parseInt(formData.rating3)) / 3;
  output2Div.innerHTML = `
    <strong>${formData.name} ${formData.surname}:</strong>
  `;
  
  if (averageScore >= 0 && averageScore <= 4) {
    output2Div.innerHTML += `<span style="color: red">${averageScore}</span>`;
  }
  else if (averageScore > 4 && averageScore <= 7) {
    output2Div.innerHTML += `<span style="color: orange">${averageScore}</span>`;
  }
  else {
    output2Div.innerHTML += `<span style="color: green">${averageScore}</span>`;
  }

  // Show popup
  popup.classList.add("show");

  // Hide popup after 3 seconds
  setTimeout(() => {
      popup.classList.remove("show");
  }, 3000);
});


const nameField = document.getElementById("name-field");
const surnameField = document.getElementById("surname-field");
const emailField = document.getElementById("email-field");
const phoneField = document.getElementById("phonenumber-field");
const addressField = document.getElementById("address-field");
const submitBtn = document.querySelector("button[type='button']");

// ==== Error spans ====
const errors = {
    name: document.getElementById("name-error"),
    surname: document.getElementById("surname-error"),
    email: document.getElementById("email-error"),
    phone: document.getElementById("phone-error"),
    address: document.getElementById("address-error")
};

function validateName() {
    let value = nameField.value.trim();
    if (value === "") return setError(nameField, errors.name, "Name cannot be empty");
    if (!/^[A-Za-zÀ-ž\s]+$/.test(value)) return setError(nameField, errors.name, "Only letters allowed");
    return clearError(nameField, errors.name);
}

function validateSurname() {
    let value = surnameField.value.trim();
    if (value === "") return setError(surnameField, errors.surname, "Surname cannot be empty");
    if (!/^[A-Za-zÀ-ž\s]+$/.test(value))
        return setError(surnameField, errors.surname, "Only letters allowed");
    return clearError(surnameField, errors.surname);
}

function validateEmail() {
    let value = emailField.value.trim();
    if (value === "") return setError(emailField, errors.email, "Email cannot be empty");
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) return setError(emailField, errors.email, "Invalid email format");
    return clearError(emailField, errors.email);
}

function validateAddress() {
    let value = addressField.value.trim();
    if (value.length < 3) return setError(addressField, errors.address, "Address too short");
    if (!/[A-Za-z0-9]/.test(value))
        return setError(addressField, errors.address, "Address must contain letters or numbers");
    return clearError(addressField, errors.address);
}

// ==== Phone number masking for Lithuania: +370 6xx xxxxx ====
function maskPhoneNumber() {
    let v = phoneField.value.replace(/\D/g, ""); // digits only

    if (v.startsWith("370")) v = "+" + v; 
    else if (v.startsWith("0")) v = "+370" + v.slice(1);
    else if (v.startsWith("6")) v = "+370" + v;
    else if (!v.startsWith("+370")) v = "+370" + v; 

    // Format: +370 6xx xxxxx
    let formatted = "";
    if (v.length > 0) formatted = v.substring(0, 4);      // +370
    if (v.length > 4) formatted += " " + v.substring(4, 5);  // space + 6
    if (v.length > 5) formatted += v.substring(5, 7);     // xx
    if (v.length > 7) formatted += " " + v.substring(7, 12); // xxxxx

    phoneField.value = formatted;

    // Validate: must contain +370 + 6 + 8 more digits = total 12 digits
    let digitCount = v.replace(/\D/g, "").length;
    if (digitCount !== 12)
        return setError(phoneField, errors.phone, "Phone must be +370 6xx xxxxx");
    return clearError(phoneField, errors.phone);
}

// ==== Error helpers ====
function setError(field, errorSpan, message) {
    field.classList.add("error");
    errorSpan.textContent = message;
    checkFormValidity();
    return false;
}

function clearError(field, errorSpan) {
    field.classList.remove("error");
    errorSpan.textContent = "";
    checkFormValidity();
    return true;
}

// ==== Disable submit unless everything is valid ====
function checkFormValidity() {
    const allValid =
        !nameField.classList.contains("error") &&
        !surnameField.classList.contains("error") &&
        !emailField.classList.contains("error") &&
        !phoneField.classList.contains("error") &&
        !addressField.classList.contains("error") &&
        nameField.value &&
        surnameField.value &&
        emailField.value &&
        phoneField.value &&
        addressField.value;

    submitBtn.disabled = !allValid;
}

// ==== Real-time listeners ====
nameField.addEventListener("input", validateName);
surnameField.addEventListener("input", validateSurname);
emailField.addEventListener("input", validateEmail);
addressField.addEventListener("input", validateAddress);
phoneField.addEventListener("input", maskPhoneNumber);

// Disable initially
submitBtn.disabled = true;