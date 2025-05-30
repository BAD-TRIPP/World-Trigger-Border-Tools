// license-check.js

async function validateLicense(key) {
  const res = await fetch('https://api.gumroad.com/v2/licenses/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_id: 'Aupflh7P60J7ngCo8UUSwA==', // Use your actual product_id
      license_key: key
    })
  });

  const data = await res.json();
  return data.success;
}

async function enforceAccess(redirectOnFail = true) {
  let key = localStorage.getItem("gumroad_license");

  if (!key) {
    if (redirectOnFail) {
      alert("No license key found.");
      window.location.href = "/tools.html";
    }
    return false;
  }

  const valid = await validateLicense(key);
  if (!valid) {
    alert("Invalid license.");
    localStorage.removeItem("gumroad_license");
    if (redirectOnFail) {
      window.location.href = "/tools.html";
    }
    return false;
  }

  return true;
}
