const celsiusInput = document.getElementById("celsius");
const fahrenheitInput = document.getElementById("fahrenheit");

let lock = false; // Prevent infinite update loops

celsiusInput.addEventListener("input", () => {
  if (lock) return;
  lock = true;

  const c = parseFloat(celsiusInput.value);
  if (!isNaN(c)) {
    fahrenheitInput.value = (c * 9/5 + 32).toFixed(2);
  } else {
    fahrenheitInput.value = "";
  }

  lock = false;
});

fahrenheitInput.addEventListener("input", () => {
  if (lock) return;
  lock = true;

  const f = parseFloat(fahrenheitInput.value);
  if (!isNaN(f)) {
    celsiusInput.value = ((f - 32) * 5/9).toFixed(2);
  } else {
    celsiusInput.value = "";
  }

  lock = false;
});