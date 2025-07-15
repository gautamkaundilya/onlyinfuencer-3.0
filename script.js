// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5zpNktvPlKyIu5m6lYzEzq-wXd3POw7o",
  authDomain: "onlyinfluencer-3a3cd.firebaseapp.com",
  projectId: "onlyinfluencer-3a3cd",
  storageBucket: "onlyinfluencer-3a3cd.appspot.com",
  messagingSenderId: "279766306715",
  appId: "1:279766306715:web:185ba47cc4c24f868c1b3e",
  measurementId: "G-GKYQVM6J8G"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ✅ Global Variables
let attemptCount = 0;
let lastAttemptTime = null;
let otpInterval;
let otpSeconds = 30;
let currentOTPMethod = "";

// ✅ Navbar Toggle
function toggleMenu() {
  document.getElementById("navMenu").classList.toggle("active");
}

// ✅ Register Modal Toggle
function openModal() {
  document.getElementById("registerModal").style.display = "flex";
  document.getElementById("otpModal").style.display = "none";
  document.body.style.overflow = "hidden";
}
function closeModal() {
  document.getElementById("registerModal").style.display = "none";
  document.body.style.overflow = "auto";
}
window.addEventListener("click", function (e) {
  const modal = document.getElementById("registerModal");
  if (e.target === modal) closeModal();
});

// ✅ Set DOB Max Limit
window.addEventListener("DOMContentLoaded", () => {
  const dob = document.getElementById("dob");
  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());
  dob.max = maxDate.toISOString().split("T")[0];
});

// ✅ Username Validation
const takenUsernames = ['gautam', 'rahul123', 'onlyking'];
const username = document.getElementById("username");
const status = document.getElementById("username-status");
const suggestionsList = document.getElementById("suggestions");

username.addEventListener("input", () => {
  const value = username.value.trim().toLowerCase();
  suggestionsList.innerHTML = "";

  if (value.length < 3) {
    status.textContent = "Username must be at least 3 characters.";
    status.className = "username-status error";
    return;
  }

  if (takenUsernames.includes(value)) {
    status.textContent = "Username is already taken.";
    status.className = "username-status error";
    const suggestions = [value + Math.floor(Math.random() * 1000), "the" + value];
    suggestions.forEach(s => {
      const li = document.createElement("li");
      li.textContent = s;
      suggestionsList.appendChild(li);
    });
  } else {
    status.textContent = "Username is available ✅";
    status.className = "username-status success";
  }
});

// ✅ Password Check
const pass = document.getElementById("password");
const confirm = document.getElementById("confirm-password");
const matchMsg = document.getElementById("password-match");
const passCheck = document.getElementById("password-check");

function checkPass() {
  const p = pass.value;
  const c = confirm.value;

  if (p.length >= 8 && /[^a-zA-Z0-9]/.test(p)) {
    passCheck.textContent = "✅ Password is strong";
    passCheck.classList.add("valid");
  } else {
    passCheck.textContent = "❌ Password must be at least 8 characters & contain a symbol.";
    passCheck.classList.remove("valid");
  }

  if (!c) {
    matchMsg.textContent = "";
  } else if (p === c) {
    matchMsg.textContent = "✅ Passwords match";
    matchMsg.classList.add("valid");
  } else {
    matchMsg.textContent = "❌ Passwords do not match";
    matchMsg.classList.remove("valid");
  }
}
pass.addEventListener("input", checkPass);
confirm.addEventListener("input", checkPass);

// ✅ Login Modal
function openLoginOverlay() {
  document.getElementById("loginOverlay").style.display = "flex";
  document.body.style.overflow = "hidden";
}
function closeLoginOverlay() {
  document.getElementById("loginOverlay").style.display = "none";
  document.body.style.overflow = "auto";
}
function closeLoginOpenRegister() {
  closeLoginOverlay();
  openModal();
}

// ✅ Switch Login Tabs
function switchTab(tab) {
  document.getElementById('emailTab').style.display = tab === 'email' ? 'block' : 'none';
  document.getElementById('phoneTab').style.display = tab === 'phone' ? 'block' : 'none';
  document.querySelectorAll('.tab-buttons button').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.tab-buttons button[onclick="switchTab('${tab}')"]`).classList.add('active');
}

// ✅ Submit Register → OTP Send
const registerForm = document.querySelector(".register-form");
registerForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.querySelector('.register-form input[placeholder="Email address or phone number"]');
  const value = input.value.trim();
  currentOTPMethod = value.includes("@") ? "email" : "sms";

  document.getElementById("registerModal").style.display = "none";
  document.getElementById("otpModal").style.display = "flex";

  const emailOption = document.getElementById("emailOption");
  const smsOption = document.getElementById("smsOption");

  // Reset both options
  emailOption.style.display = "none";
  smsOption.style.display = "none";

  // Show available method as text
  if (currentOTPMethod === "email") {
    document.getElementById("otpEmail").innerText = value;
    emailOption.style.display = "block";

    // Ask phone if missing
    document.getElementById("otpPhone").innerHTML = `<input type="tel" id="enterPhoneNow" placeholder="Enter phone number" class="otp-method-input">`;
    smsOption.style.display = "block";
  } else {
    document.getElementById("otpPhone").innerText = value;
    smsOption.style.display = "block";

    // Ask email if missing
    document.getElementById("otpEmail").innerHTML = `<input type="email" id="enterEmailNow" placeholder="Enter email" class="otp-method-input">`;
    emailOption.style.display = "block";
  }
});


// ✅ Choose Method → Open Code Modal
function proceedToOTPCode(method) {
  currentOTPMethod = method;
  document.getElementById("registerModal").style.display = "none";
  document.getElementById("otpModal").style.display = "none";
  document.getElementById("otpCodeModal").style.display = "flex";

  const target = method === "email"
    ? document.getElementById("otpEmail").innerText
    : document.getElementById("otpPhone").innerText;

  document.getElementById("otpTarget").textContent = target;

  if (method === "sms") sendOTPToPhone(target);
  else sendOTPToEmail(target);

  initOTPInputs();
}
document.getElementById("emailOption").onclick = () => proceedToOTPCode("email");
document.getElementById("smsOption").onclick = () => proceedToOTPCode("sms");

function backToRegister() {
  document.getElementById("otpModal").style.display = "none";
  document.getElementById("registerModal").style.display = "flex";
}


// ✅ Start Timer
function startOTPTimer() {
  const resendCountdown = document.getElementById("resendCountdown");
  const resendLink = document.getElementById("resendLink");
  const timerEl = document.getElementById("otpTimer");

  otpSeconds = 30;
  resendCountdown.style.display = "inline";
  resendLink.style.display = "none";
  timerEl.textContent = otpSeconds;

  clearInterval(otpInterval);
  otpInterval = setInterval(() => {
    otpSeconds--;
    timerEl.textContent = otpSeconds;
    if (otpSeconds <= 0) {
      clearInterval(otpInterval);
      resendCountdown.style.display = "none";
      resendLink.style.display = "inline";
    }
  }, 1000);

  let attemptInfo = document.getElementById("attemptInfo");
  if (!attemptInfo) {
    attemptInfo = document.createElement("div");
    attemptInfo.id = "attemptInfo";
    attemptInfo.style.fontSize = "13px";
    attemptInfo.style.color = "#888";
    attemptInfo.style.marginTop = "5px";
    document.getElementById("resendWrapper").appendChild(attemptInfo);
  }
  attemptInfo.textContent = `Attempts: ${attemptCount}/5`;
}

// ✅ OTP Input Setup
function initOTPInputs() {
  startOTPTimer();
  const inputs = document.querySelectorAll(".otp-input");
  inputs.forEach((input, i) => {
    input.value = '';
    input.addEventListener("input", () => {
      const val = input.value.replace(/\D/g, "");
      input.value = val;
      if (val && i < inputs.length - 1) inputs[i + 1].focus();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && i > 0) inputs[i - 1].focus();
    });
    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const paste = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "").slice(0, 6);
      paste.split("").forEach((ch, idx) => {
        if (inputs[idx]) inputs[idx].value = ch;
      });
    });
    input.addEventListener("input", () => {
      document.getElementById("otpErrorMsg").textContent = "";
      input.style.borderColor = "#ccc";
    });
  });
}

// ✅ Resend OTP
function resendOTP() {
  const inputs = document.querySelectorAll(".otp-input");
  inputs.forEach(i => i.value = '');
  window.confirmationResult = null;

  if (currentOTPMethod === "email") {
    sendOTPToEmail(document.getElementById("otpEmail").innerText, true);
  } else {
    sendOTPToPhone(document.getElementById("otpPhone").innerText, true);
  }

  startOTPTimer();
  const info = document.getElementById("attemptInfo");
  if (info) info.textContent = `Attempts: ${attemptCount}/5`;
}

// ✅ Phone OTP Send
function sendOTPToPhone(phone, isResend = false) {
  if (attemptCount >= 5 && lastAttemptTime && new Date().getTime() - lastAttemptTime < 3600000) {
    document.getElementById("otpErrorMsg").textContent = "Too many attempts. Try again after 1 hour.";
    return;
  }

  if (!phone.startsWith('+')) {
    phone = '+91' + phone.replace(/\D/g, '');
  }

  // Clear existing reCAPTCHA DOM & object (⚠️ fix starts here)
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
    document.getElementById("recaptcha-container").innerHTML = "";
  }

  // Recreate reCAPTCHA
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    size: 'invisible',
    callback: () => { },
    'expired-callback': () => { }
  });

  // Render and resend
  window.recaptchaVerifier.render().then(() => {
    auth.signInWithPhoneNumber(phone, window.recaptchaVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        if (!isResend) startOTPTimer();
        document.getElementById("otpErrorMsg").textContent = "";
      })
      .catch((error) => {
        console.error("OTP send error:", error);
        document.getElementById("otpErrorMsg").textContent = "❌ Failed to send OTP. Please check number and try again.";
      });
  });
}


// ✅ Email OTP Mock
function sendOTPToEmail(email, isResend = false) {
  window.confirmationResult = {
    confirm: (code) => new Promise((resolve, reject) => {
      if (code === "123456") resolve({ user: { email } });
      else reject(new Error("Invalid OTP"));
    })
  };
  if (!isResend) startOTPTimer();
}

// ✅ Modal Close
function closeOTPModal() {
  document.getElementById("otpCodeModal").style.display = "none";
  document.body.style.overflow = "auto";
}
function backToOTPOptions() {
  document.getElementById("otpCodeModal").style.display = "none";
  document.getElementById("otpModal").style.display = "flex";
}

// for email verification 
document.getElementById("emailOption").onclick = () => {
  const emailField = document.getElementById("enterEmailNow");
  const email = emailField ? emailField.value.trim() : document.getElementById("otpEmail").innerText;
  if (!email || !email.includes("@")) {
    alert("Please enter a valid email.");
    return;
  }
  document.getElementById("otpEmail").innerText = email;
  proceedToOTPCode("email");
};

// for phone verification
document.getElementById("smsOption").onclick = () => {
  const phoneField = document.getElementById("enterPhoneNow");
  let phone = phoneField ? phoneField.value.trim() : document.getElementById("otpPhone").innerText;
  if (!phone || phone.length < 10) {
    alert("Please enter a valid phone number.");
    return;
  }
  if (!phone.startsWith("+")) {
    phone = "+91" + phone.replace(/\D/g, '');
  }
  document.getElementById("otpPhone").innerText = phone;
  proceedToOTPCode("sms");
};

// ✅ Verify OTP (fixed)
function verifyEnteredOTP() {
  const inputs = document.querySelectorAll('.otp-input');
  const errorBox = document.getElementById("otpErrorMsg");
  const code = Array.from(inputs).map(input => input.value).join('');
  const now = new Date().getTime();

  errorBox.textContent = "";

  if (attemptCount >= 5 && lastAttemptTime && now - lastAttemptTime < 3600000) {
    errorBox.textContent = "❌ Too many attempts. Please try again after 1 hour.";
    return;
  }

  if (code.length !== 6) {
    errorBox.textContent = "❌ Please enter the complete 6-digit OTP.";
    return;
  }

  if (!window.confirmationResult || typeof window.confirmationResult.confirm !== "function") {
    errorBox.textContent = "❌ OTP session expired. Please resend code.";

    const inputs = document.querySelectorAll('.otp-input');
    inputs.forEach(input => {
      input.value = '';
      input.style.borderColor = 'red';
    });
    if (inputs[0]) inputs[0].focus();

    return;
  }


  window.confirmationResult.confirm(code)
    .then(() => {
      attemptCount = 0;
      lastAttemptTime = null;

      // ✅ SAVE USER DATA TO localStorage
      const userData = {
        username: document.getElementById("username").value.trim(),
        fullName: document.getElementById("fullname")?.value.trim() || "New User",
        contact: document.querySelector('.register-form input[placeholder="Email address or phone number"]').value.trim(),
        followers: 0,
        following: 0
      };
      localStorage.setItem("userProfile", JSON.stringify(userData));

      // ✅ Now redirect to profile.html
      window.location.href = "pages/profile.html";
    })

    .catch(() => {
      attemptCount++;
      lastAttemptTime = now;

      inputs.forEach(input => {
        input.value = '';
        input.style.borderColor = 'red';
      });
      if (inputs[0]) inputs[0].focus();

      const remaining = 5 - attemptCount;
      errorBox.textContent = `❌ Incorrect OTP. ${remaining} attempt${remaining === 1 ? '' : 's'} left.`;

      const info = document.getElementById("attemptInfo");
      if (info) info.textContent = `Attempts: ${attemptCount}/5`;

      if (attemptCount >= 5) {
        document.getElementById("resendLink").style.display = "none";
      }
    });
}

// ✅ Enter key triggers OTP verify
window.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && document.getElementById("otpCodeModal").style.display === "flex") {
    e.preventDefault();
    verifyEnteredOTP();
  }
});
