// ✅ Hamburger Menu Toggle (Mobile)
function toggleMenu() {
  const nav = document.getElementById("navLinks");
  nav.classList.toggle("show");
}

// ✅ Logout
function logout() {
  sessionStorage.removeItem("isLoggedIn");
  alert("You have been logged out.");
  window.location.href = "../index.html";
}

// ✅ DOM Ready Code
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("darkModeToggle");

  // Load dark mode
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    toggle.checked = true;
  }

  toggle.addEventListener("change", () => {
    const isDark = toggle.checked;
    document.body.classList.toggle("dark-mode", isDark);
    localStorage.setItem("darkMode", isDark);
  });

  // Customize Profile Modal
  const customizeTrigger = document.getElementById('customizeTrigger');
  const customizeModal = document.getElementById('customizeModal');
  const closeModal = document.getElementById('closeModal');

  if (customizeTrigger && customizeModal && closeModal) {
    customizeTrigger.addEventListener('click', () => {
      customizeModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });

    closeModal.addEventListener('click', () => {
      customizeModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
      if (e.target === customizeModal) {
        customizeModal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }

  initDPUpload();

  // ✅ Load local user profile
  const saved = JSON.parse(localStorage.getItem('userProfile'));
  if (saved) {
    applyProfileData(saved);

    document.querySelector('.username').textContent = saved.username || 'user';

    const stats = document.querySelectorAll('.stats div');
    if (stats.length === 3) {
      stats[0].querySelector('strong').textContent = '0'; // Posts
      stats[1].querySelector('strong').textContent = '0'; // Followers
      stats[2].querySelector('strong').textContent = '0'; // Following
    }
  }
});

// ✅ Profile Pic Upload
function initDPUpload() {
  const avatar = document.getElementById('avatarPreview');
  let dpInput = document.getElementById('dpInput');
  

  if (!avatar || !dpInput) return;

  dpInput.addEventListener('change', function handleChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const overlay = document.createElement('div');
      overlay.className = 'overlay';
      overlay.innerHTML = `
        <div class="overlay-content">
          <img src="${reader.result}" alt="Preview" />
          <div>
            <button class="btn-update">Update</button>
            <button class="btn-cancel">Cancel</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      overlay.querySelector('.btn-cancel').onclick = () => {
        overlay.remove();
        dpInput.value = '';
      };

      overlay.querySelector('.btn-update').onclick = () => {
        avatar.style.backgroundImage = `url('${reader.result}')`;
        avatar.style.backgroundSize = 'cover';
        avatar.style.backgroundPosition = 'center';
        avatar.classList.add('has-image');
        avatar.innerHTML = '';

        const label = document.createElement('label');
        label.setAttribute('for', 'dpInput');
        label.innerHTML = '<i class="fas fa-camera"></i>';

        const input = document.createElement('input');
        input.type = 'file';
        input.id = 'dpInput';
        input.accept = 'image/*';
        input.style.display = 'none';

        input.addEventListener('change', handleChange);

        avatar.appendChild(label);
        avatar.appendChild(input);
        dpInput = input;

        overlay.remove();
      };
    };
    reader.readAsDataURL(file);
  });
}

// ✅ Tabs
document.querySelectorAll('.tabs div').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tabs div').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ✅ Edit
document.querySelector('.edit-btn')?.addEventListener('click', () => {
  const data = getProfileData();
  document.getElementById('editUsername').value = data.username;
  document.getElementById('editDisplayName').value = data.displayName;
  document.getElementById('editBio1').value = data.bio1;
  document.getElementById('editBio2').value = data.bio2;
  document.getElementById('editContact').value = data.contact;
  document.getElementById('editWebsite').value = data.website;

  document.getElementById('editOverlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
});

// ✅ Save Profile
function saveProfileChanges() {
  const updated = {
    username: document.getElementById('editUsername').value.trim(),
    displayName: document.getElementById('editDisplayName').value.trim(),
    bio1: document.getElementById('editBio1').value.trim(),
    bio2: document.getElementById('editBio2').value.trim(),
    contact: document.getElementById('editContact').value.trim(),
    website: document.getElementById('editWebsite').value.trim()
  };

  localStorage.setItem('userProfile', JSON.stringify(updated));
  applyProfileData(updated);
  closeEditOverlay();
}

function applyProfileData(data) {
  document.querySelector('.username').textContent = data.username || 'user';

  const avatar = document.getElementById("avatarPreview");

  // ✅ Reset initials if no image
  if (!avatar.classList.contains("has-image")) {
    avatar.style.backgroundImage = "";
    avatar.classList.remove("has-image");

    avatar.innerHTML = getInitialsFromName(data.displayName || data.username || "U") +
      `<label for="dpInput"><i class="fas fa-camera"></i></label>
       <input type="file" id="dpInput" accept="image/*" style="display: none;" />`;

    // 🛠 Re-bind upload event
    const newInput = avatar.querySelector("#dpInput");
    if (newInput) {
      newInput.addEventListener("change", function handleChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
          const overlay = document.createElement("div");
          overlay.className = "overlay";
          overlay.innerHTML = `
            <div class="overlay-content">
              <img src="${reader.result}" alt="Preview" />
              <div>
                <button class="btn-update">Update</button>
                <button class="btn-cancel">Cancel</button>
              </div>
            </div>
          `;
          document.body.appendChild(overlay);

          overlay.querySelector(".btn-cancel").onclick = () => {
            overlay.remove();
            newInput.value = '';
          };

          overlay.querySelector(".btn-update").onclick = () => {
            avatar.style.backgroundImage = `url('${reader.result}')`;
            avatar.style.backgroundSize = "cover";
            avatar.style.backgroundPosition = "center";
            avatar.classList.add("has-image");

            avatar.innerHTML = `
              <label for="dpInput"><i class="fas fa-camera"></i></label>
              <input type="file" id="dpInput" accept="image/*" style="display: none;" />
            `;

            overlay.remove();
            // 🔁 DP input rebinding
            initDPUpload();
          };
        };
        reader.readAsDataURL(file);
      });
    }
  }

  // ✅ Set full profile info
  const bio = document.querySelector('.bio');
  if (bio) {
    bio.innerHTML = '';
    if (data.displayName) bio.innerHTML += `<p><strong>${data.displayName}</strong></p>`;
    if (data.bio1) bio.innerHTML += `<p>${data.bio1}</p>`;
    if (data.bio2) bio.innerHTML += `<p>${data.bio2}</p>`;
    if (data.contact) bio.innerHTML += `<p>✉️ <a href="#">${data.contact}</a></p>`;
    if (data.website) bio.innerHTML += `<p>🔗 <a href="${data.website}" target="_blank">${data.website}</a></p>`;
  }
}


// ✅ Get Profile Data
function getProfileData() {
  return {
    username: document.querySelector('.username')?.textContent || '',
    displayName: document.querySelector('.bio p strong')?.textContent || '',
    bio1: document.querySelectorAll('.bio p')[1]?.textContent || '',
    bio2: document.querySelectorAll('.bio p')[2]?.textContent || '',
    contact: document.querySelector('.bio p a')?.textContent || '',
    website: ''
  };
}

// ✅ Close Edit Overlay
function closeEditOverlay() {
  document.getElementById('editOverlay').style.display = 'none';
  document.body.style.overflow = 'auto';
}

// ✅ Share Profile
document.querySelector('.share-btn')?.addEventListener('click', () => {
  const username = document.querySelector('.username')?.textContent || 'user';
  const shareUrl = `https://onlyinfluencer.com/${username}`;
  document.getElementById('shareLink').value = shareUrl;
  document.getElementById('shareOverlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
});

function copyShareLink() {
  const link = document.getElementById('shareLink');
  link.select();
  document.execCommand('copy');
  alert('Link copied!');
}

function closeShareOverlay() {
  document.getElementById('shareOverlay').style.display = 'none';
  document.body.style.overflow = 'auto';
}

// ✅ Avatar Initials Logic
function getInitialsFromName(name) {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase() + '..';
  } else {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }
}


