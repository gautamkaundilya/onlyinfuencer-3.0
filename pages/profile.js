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

document.addEventListener("DOMContentLoaded", function () {
  const uploadTrigger = document.getElementById("uploadTrigger");
  const overlay = document.getElementById("multiStepUploadOverlay");
  const stepContent = document.getElementById("uploadStepContent");

  // 1st Step: Show Instagram style upload
  function showUploadStep1() {
    stepContent.innerHTML = `
      <button class="close-btn" onclick="closeMultiStepOverlay()">&times;</button>
      <div class="upload-instagram-step1">
        <h3 style="font-weight: 600; margin-bottom: 10px;">Create new post</h3>
        <div class="upload-instagram-icon">
          <i class="fas fa-photo-video"></i>
        </div>
        <div style="color: #262626; font-size: 1.05rem; margin-bottom: 8px;">
          Drag photos and videos here
        </div>
        <button class="upload-instagram-btn" id="uploadSelectBtn">Select From Computer</button>
        <input type="file" id="multiStepMediaInput" accept="image/*,video/*" multiple style="display: none;">
      </div>
    `;
    overlay.style.display = "flex";
    document.body.style.overflow = "hidden";

    // Drag-drop functionality can be added here if needed.

    // Button: Select from Computer
    const selectBtn = document.getElementById("uploadSelectBtn");
    const input = document.getElementById("multiStepMediaInput");
    selectBtn.onclick = () => input.click();

    // On file select, go to Step 2 (preview)
    input.onchange = function () {
      if (input.files.length === 0) return;
      // TODO: Go to Step 2: Preview & Next
      showUploadStep2(Array.from(input.files));
    };
  }

  // Step 2: Media Preview
  function showUploadStep2(files) {
    stepContent.innerHTML = `
      <button class="close-btn" onclick="closeMultiStepOverlay()">&times;</button>
      <div style="padding: 30px 18px; min-height: 280px;">
        <h3 style="font-weight: 600; margin-bottom: 10px;">Preview & Next</h3>
        <div id="multiStepPreview" style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-bottom: 16px;"></div>
        <button class="upload-instagram-btn" id="uploadNextStepBtn">Next</button>
      </div>
    `;
    // Preview rendering
    const preview = document.getElementById("multiStepPreview");
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      let el;
      if (file.type.startsWith("image/")) {
        el = document.createElement("img");
        el.src = url;
        el.style.width = "80px";
        el.style.height = "80px";
        el.style.objectFit = "cover";
        el.style.borderRadius = "8px";
      } else {
        el = document.createElement("video");
        el.src = url;
        el.controls = true;
        el.style.width = "80px";
        el.style.height = "80px";
        el.style.borderRadius = "8px";
        el.style.objectFit = "cover";
      }
      preview.appendChild(el);
    });

    // Next step
    document.getElementById("uploadNextStepBtn").onclick = () => {
      showUploadStep3(files);
    };
  }

  // Step 3: Caption & Details
  function showUploadStep3(files) {
    stepContent.innerHTML = `
      <button class="close-btn" onclick="closeMultiStepOverlay()">&times;</button>
      <div style="padding: 30px 18px;">
        <h3 style="font-weight: 600; margin-bottom: 10px;">Add Details</h3>
        <textarea id="multiStepCaption" placeholder="Write a caption..." rows="3"
          style="width: 100%; border-radius: 8px; padding: 10px; font-size: 14px; resize: none; margin-bottom: 18px;"></textarea>
        <button class="upload-instagram-btn" id="uploadPostBtn">Post</button>
      </div>
    `;
    document.getElementById("uploadPostBtn").onclick = () => {
      const caption = document.getElementById("multiStepCaption").value.trim();
      showUploadStep4(files, caption);
    };
  }

  // Step 4: Post Confirmed
  function showUploadStep4(files, caption) {
    stepContent.innerHTML = `
      <div style="padding: 50px 18px; text-align: center;">
        <h3 style="font-weight: 600; margin-bottom: 20px;">Post Created!</h3>
        <div style="font-size: 2.5rem; margin-bottom: 18px;">✅</div>
        <div style="margin-bottom: 8px;">Your post is ready.</div>
        <button class="upload-instagram-btn" onclick="closeMultiStepOverlay()">Close</button>
      </div>
    `;
    // Optional: Save to localStorage / render gallery here
    // (Can add more logic as needed)
    savePost(files, caption);
  }

  // Save post to localStorage & refresh gallery
  function savePost(files, caption) {
    // Convert files to base64
    const readerPromises = files.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve({ type: file.type, data: reader.result });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readerPromises).then(mediaData => {
      const post = {
        caption: caption,
        media: mediaData,
        time: Date.now()
      };
      const posts = JSON.parse(localStorage.getItem("userPosts") || "[]");
      posts.unshift(post);
      localStorage.setItem("userPosts", JSON.stringify(posts));
      if (window.renderPosts) window.renderPosts();
    });
  }

  // Overlay close
  window.closeMultiStepOverlay = function () {
    overlay.style.display = "none";
    document.body.style.overflow = "auto";
  };

  // Floating Upload Trigger
  uploadTrigger.onclick = showUploadStep1;
});


