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
// multiple overlays
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
        <button class="upload-instagram-btn" id="uploadSelectBtn">Select From Gallery</button>
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
  let currIdx = 0;

  // Each file ki crop state store: { cropMode, zoom, offset }
  let mediaState = files.map(() => ({
    cropMode: "original",
    zoom: 1,
    offset: { x: 0, y: 0 }
  }));

  function getAspect(aspect) {
    if (aspect === "1:1") return 1;
    if (aspect === "4:5") return 4 / 5;
    if (aspect === "16:9") return 16 / 9;
    return null;
  }

  function renderStep2() {
    const file = files[currIdx];
    const state = mediaState[currIdx];
    let aspectVal = getAspect(state.cropMode);

    // Instagram style crop box
    let cropW = 330, cropH = 370;
    if (state.cropMode !== "original" && aspectVal) {
      if (aspectVal >= 1) {
        cropW = 330; cropH = Math.round(330 / aspectVal);
      } else {
        cropH = 330; cropW = Math.round(330 * aspectVal);
      }
    } else {
      // Original: keep a nice box, fit media inside
      cropW = 330; cropH = 370;
    }
    if (window.innerWidth < 600) {
      cropW = Math.min(280, window.innerWidth - 38);
      cropH = state.cropMode !== "original" && aspectVal
        ? Math.round(cropW / aspectVal)
        : 280;
    }

    stepContent.innerHTML = `
      <div class="step2-crop-main" style="align-items:center;">
        <div class="step2-header">
          <button type="button" class="back-btn" style="font-size:1.6rem;background:none;border:none;">&lt;</button>
          <span class="crop-title">Crop</span>
          <button class="next-btn" id="cropNextBtn">Next</button>
        </div>
        <div class="crop-image-view" style="height:${cropH + 0}px;display:flex;align-items:center;justify-content:center;">
          <div class="crop-image-wrap ${state.cropMode === "original" ? "original" : "ratio"}" style="width:${cropW}px;height:${cropH}px;margin:auto;position:relative;">
            ${
              file.type.startsWith("image/")
                ? `<img src="${URL.createObjectURL(file)}" id="mainCropMedia" draggable="false" style="background:#fff;" />`
                : `<video src="${URL.createObjectURL(file)}" id="mainCropMedia" autoplay muted loop draggable="false" style="background:#fff;"></video>`
            }
          </div>
          ${files.length > 1 ? `
            <button class="crop-arrow left" id="prevCrop" style="left:10px;"><i class="fas fa-chevron-left"></i></button>
            <button class="crop-arrow right" id="nextCrop" style="right:10px;"><i class="fas fa-chevron-right"></i></button>
          ` : ''}
          <div class="crop-tools">
            <button class="crop-tool-btn" title="Resize" id="resizeBtn"><i class="fas fa-expand"></i></button>
            <button class="crop-tool-btn" title="Zoom" id="zoomBtn"><i class="fas fa-search-plus"></i></button>
          </div>
          <div class="crop-aspect-options" id="cropAspectOptions" style="display:none;">
            <label>
              <input type="radio" name="aspect" value="original" ${state.cropMode === "original" ? "checked" : ""} />
              <span class="aspect-label">Original</span>
              <span class="aspect-icon"><i class="far fa-image"></i></span>
            </label>
            <label>
              <input type="radio" name="aspect" value="1:1" ${state.cropMode === "1:1" ? "checked" : ""} />
              <span class="aspect-label">1:1</span>
              <span class="aspect-icon"><i class="fas fa-square"></i></span>
            </label>
            <label>
              <input type="radio" name="aspect" value="4:5" ${state.cropMode === "4:5" ? "checked" : ""} />
              <span class="aspect-label">4:5</span>
              <span class="aspect-icon"><i class="fas fa-rectangle-vertical"></i></span>
            </label>
            <label>
              <input type="radio" name="aspect" value="16:9" ${state.cropMode === "16:9" ? "checked" : ""} />
              <span class="aspect-label">16:9</span>
              <span class="aspect-icon"><i class="fas fa-rectangle-wide"></i></span>
            </label>
          </div>
          <div class="crop-zoom-bar" id="zoomBar" style="display:none;">
            <span class="zoom-label"><i class="fas fa-search-minus"></i></span>
            <input type="range" min="1" max="2.6" step="0.01" id="zoomSlider" value="${state.zoom}">
            <span class="zoom-label"><i class="fas fa-search-plus"></i></span>
          </div>
        </div>
        <div class="step2-thumbnails">
          ${files.map((f, idx) => `
            <div class="thumb-wrapper">
              ${f.type.startsWith("image/") ?
                `<img src="${URL.createObjectURL(f)}" class="thumb-image${currIdx === idx ? ' selected' : ''}" data-idx="${idx}" />`
                :
                `<video src="${URL.createObjectURL(f)}" class="thumb-video${currIdx === idx ? ' selected' : ''}" data-idx="${idx}" muted loop></video>
                  <span class="thumb-video-icon"><i class="fas fa-play"></i></span>`
              }
              <button class="thumb-remove-btn" data-idx="${idx}" title="Remove">&times;</button>
            </div>
          `).join('')}
          ${files.length < 5 ? `<div class="thumb-add-btn" id="addMoreThumb">+</div>` : ''}
        </div>
      </div>
    `;

    // Crop transform, pan/zoom logic (per-media)
    setTimeout(() => {
      const media = document.getElementById('mainCropMedia');
      if (!media) return;

      function getFrameBox() {
        return { w: cropW, h: cropH, aspect: aspectVal };
      }
      function applyTransform() {
        // In "original", always center with object-fit:contain (no crop, no transform)
        if (state.cropMode === "original") {
          media.style.transform = "";
          return;
        }
        let cx = state.offset.x, cy = state.offset.y;
        media.style.transform = `translate(${cx}px,${cy}px) scale(${state.zoom})`;
      }
      function clampOffsets(nx, ny) {
        let mw = media.naturalWidth || media.videoWidth || cropW;
        let mh = media.naturalHeight || media.videoHeight || cropH;
        let rw = mw * state.zoom, rh = mh * state.zoom;
        let frame = getFrameBox();
        let minX = Math.min(0, frame.w - rw);
        let minY = Math.min(0, frame.h - rh);
        if (state.cropMode === 'original') {
          // Not actually used, but for safety
          if (rw <= frame.w) nx = (frame.w - rw) / 2;
          else nx = Math.min(0, Math.max(nx, frame.w - rw));
          if (rh <= frame.h) ny = (frame.h - rh) / 2;
          else ny = Math.min(0, Math.max(ny, frame.h - rh));
        } else {
          nx = Math.max(minX, Math.min(nx, 0));
          ny = Math.max(minY, Math.min(ny, 0));
        }
        return { x: nx, y: ny };
      }
      // Drag logic (only for non-original)
      const wrap = media.parentElement;
      if (state.cropMode !== "original") {
        wrap.onmousedown = e => {
          dragging = true;
          dragStart = { x: e.clientX, y: e.clientY };
          offsetStart = { ...state.offset };
          e.preventDefault();
        };
        document.onmousemove = e => {
          if (!dragging) return;
          let dx = e.clientX - dragStart.x, dy = e.clientY - dragStart.y;
          let nx = offsetStart.x + dx, ny = offsetStart.y + dy;
          state.offset = clampOffsets(nx, ny);
          applyTransform();
        };
        document.onmouseup = e => dragging = false;
        wrap.ontouchstart = e => {
          dragging = true;
          dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          offsetStart = { ...state.offset };
        };
        wrap.ontouchmove = e => {
          if (!dragging) return;
          let dx = e.touches[0].clientX - dragStart.x, dy = e.touches[0].clientY - dragStart.y;
          let nx = offsetStart.x + dx, ny = offsetStart.y + dy;
          state.offset = clampOffsets(nx, ny);
          applyTransform();
        };
        wrap.ontouchend = e => dragging = false;
      } else {
        // In "original" mode, no dragging
        wrap.onmousedown = null;
        document.onmousemove = null;
        document.onmouseup = null;
        wrap.ontouchstart = null;
        wrap.ontouchmove = null;
        wrap.ontouchend = null;
      }
      applyTransform();
    }, 100);

    // Resize (aspect) options (per-media)
    const resizeBtn = document.getElementById("resizeBtn");
    const aspectOpts = document.getElementById("cropAspectOptions");
    if (resizeBtn && aspectOpts) {
      resizeBtn.onclick = () => {
        aspectOpts.style.display = aspectOpts.style.display === 'none' ? 'block' : 'none';
      };
      aspectOpts.querySelectorAll('input[name="aspect"]').forEach(radio => {
        radio.onchange = () => {
          state.cropMode = radio.value;
          // On ratio change: reset zoom/offset for that media
          state.zoom = 1.0;
          state.offset = { x: 0, y: 0 };
          renderStep2();
        };
      });
    }

    // Zoom (per-media)
    const zoomBtn = document.getElementById("zoomBtn");
    const zoomBar = document.getElementById("zoomBar");
    if (zoomBtn && zoomBar) {
      zoomBtn.onclick = () => {
        zoomBar.style.display = zoomBar.style.display === 'none' ? 'flex' : 'none';
      };
      const zoomSlider = document.getElementById("zoomSlider");
      if (zoomSlider) {
        zoomSlider.value = state.zoom;
        zoomSlider.oninput = function () {
          state.zoom = parseFloat(this.value);
          setTimeout(() => {
            const media = document.getElementById('mainCropMedia');
            if (media) media.style.transform = `translate(${state.offset.x}px,${state.offset.y}px) scale(${state.zoom})`;
          }, 10);
        };
      }
    }

    // Back (close overlay)
    const backBtn = stepContent.querySelector('.back-btn');
    if (backBtn) backBtn.onclick = () => closeMultiStepOverlay();

    // Next
    const nextBtn = stepContent.querySelector("#cropNextBtn");
    if (nextBtn) nextBtn.onclick = () => showUploadStep3(files);

    // Arrow navigation
    const prevBtn = stepContent.querySelector("#prevCrop");
    if (prevBtn) prevBtn.onclick = () => { currIdx = (currIdx - 1 + files.length) % files.length; renderStep2(); };
    const nextArrowBtn = stepContent.querySelector("#nextCrop");
    if (nextArrowBtn) nextArrowBtn.onclick = () => { currIdx = (currIdx + 1) % files.length; renderStep2(); };

    // Thumbnails
    stepContent.querySelectorAll(".thumb-image, .thumb-video").forEach(img => {
      img.onclick = () => { currIdx = Number(img.getAttribute("data-idx")); renderStep2(); };
    });
    // Remove
    stepContent.querySelectorAll(".thumb-remove-btn").forEach(btn => {
      btn.onclick = () => {
        const removeIdx = Number(btn.getAttribute("data-idx"));
        files.splice(removeIdx, 1);
        mediaState.splice(removeIdx, 1);
        if (files.length === 0) { closeMultiStepOverlay(); return; }
        if (currIdx >= files.length) currIdx = files.length - 1;
        renderStep2();
      };
    });
    // Add more
    const addBtn = stepContent.querySelector("#addMoreThumb");
    if (addBtn) {
      addBtn.onclick = () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*,video/*";
        fileInput.multiple = true;
        fileInput.style.display = "none";
        fileInput.onchange = function () {
          if (fileInput.files.length) {
            let added = Array.from(fileInput.files);
            let allowed = Math.min(5 - files.length, added.length);
            files.push(...added.slice(0, allowed));
            mediaState.push(...added.slice(0, allowed).map(() => ({
              cropMode: "original",
              zoom: 1,
              offset: { x: 0, y: 0 }
            })));
            renderStep2();
          }
        };
        document.body.appendChild(fileInput);
        fileInput.click();
        setTimeout(() => fileInput.remove(), 1200);
      };
    }
  }
  renderStep2();
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


