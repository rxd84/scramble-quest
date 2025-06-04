let soundIsEnabled = true;

function applyScale() {
  const wrapper = document.querySelector('.screen-wrapper');
  if (!wrapper) return;
  const baseWidth = 1920;
  const baseHeight = 1080;
  const scaleX = window.innerWidth / baseWidth;
  const scaleY = window.innerHeight / baseHeight;
  const scale = Math.min(scaleX, scaleY);
  wrapper.style.transform = `scale(${scale})`;
  wrapper.style.transformOrigin = 'top left';
}

window.addEventListener('resize', applyScale);

function transitionToScreen(callback) {
  // Get or create fade screen
  let fade = document.getElementById("fade-screen");
  if (!fade) {
    fade = document.createElement('div');
    fade.id = 'fade-screen';
    fade.style.position = 'fixed';
    fade.style.top = '0';
    fade.style.left = '0';
    fade.style.width = '100%';
    fade.style.height = '100%';
    fade.style.backgroundColor = 'black';
    fade.style.opacity = '0';
    fade.style.transition = 'opacity 1s ease-in-out'; // Longer duration with ease-in-out timing
    fade.style.zIndex = '9999';
    document.body.appendChild(fade);
  }

  // Ensure the fade screen is visible
  fade.style.display = 'block';
  
  // Give the browser a chance to render the fade screen before starting the transition
  requestAnimationFrame(() => {
    fade.style.opacity = '1';
    
    // Wait for fade in to complete
    setTimeout(() => {
      callback();
      
      // Start fade out
      fade.style.opacity = '0';
      
      // Hide the fade screen when fully faded out
      setTimeout(() => {
        fade.style.display = 'none';
      }, 1000); // Match fade duration
    }, 1000); // Match fade duration
  });
}





let currentLevelNumber = 1;


function enterFullscreen() {
  if (document.fullscreenElement == null) {
    document.documentElement.requestFullscreen().catch(err => {
      console.warn("Fullscreen request denied:", err);
    });
  }
}

window.onload = function () {


// ⏩ TEMP: Debug Button to Skip to Last Word of Level 10
const testBtn = document.createElement("button");
testBtn.textContent = "⏩ Jump to Last Level";
testBtn.style.position = "fixed";
testBtn.style.top = "20px";
testBtn.style.right = "20px";
testBtn.style.zIndex = "9999";
testBtn.style.padding = "10px 20px";
testBtn.style.fontSize = "16px";
testBtn.style.background = "#222";
testBtn.style.color = "#fff";
testBtn.style.border = "2px solid #fff";
testBtn.style.cursor = "pointer";
testBtn.style.opacity = "0.7";

testBtn.onclick = () => {
  const category = "food";
  const level = 10;
  const allWordsInLevel = allWords[category].levels[level];

  currentCategory = category;
  currentLevelNumber = level;
  currentWords = [...allWordsInLevel]; // clone the array
  currentLevel = allWordsInLevel.length - 1;
  score = 9;

  showWordScreen(currentWords[currentLevel]);
};

document.body.appendChild(testBtn);



 // ✅ Ensures cursor shows normally unless hidden on purpose
const globalCursorFix = document.createElement('style');
globalCursorFix.textContent = `
  body {
    cursor: auto !important;
  }
`;
document.head.appendChild(globalCursorFix);

const hideCursorStyle = document.createElement("style");
hideCursorStyle.textContent = `
  html.hide-cursor,
  body.hide-cursor,
  .hide-cursor *,
  .hide-cursor {
    cursor: none !important;
    pointer-events: none !important;
  }
`;
document.head.appendChild(hideCursorStyle);


  // Initialize fade screen if it doesn't exist
  const fadeScreen = document.getElementById('fade-screen');
  if (!fadeScreen) {
    const fadeDiv = document.createElement('div');
    fadeDiv.id = "fade-screen";
    fadeDiv.style.position = "fixed";
    fadeDiv.style.top = 0;
    fadeDiv.style.left = 0;
    fadeDiv.style.width = "100vw";
    fadeDiv.style.height = "100vh";
    fadeDiv.style.backgroundColor = "black";
    fadeDiv.style.opacity = "0";
    fadeDiv.style.transition = "opacity 0.5s ease";
    fadeDiv.style.display = "none";
    fadeDiv.style.zIndex = 9999;
    document.body.appendChild(fadeDiv);
  }

  // Show intro screen
  showIntroScreen();
};

function showIntroScreen() {
  const content = document.getElementById('main-content');
  if (!content) return;

  content.innerHTML = `
    <div class="screen-wrapper" style='
      background-image: url("assets/screen1-bg.png");
      background-size: cover;
      background-position: center;
      height: 1080px;
      width: 1920px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 60px;
    '>
     <div class='audio-button' onclick='handleSoundClick()' id="sound-on">
  <img src='assets/sound-on.png' alt='Audio On'>
  <img class='hover-overlay' src='assets/sound-on-overlay.png' alt='Audio On Hover'>
</div>
<div class='audio-button' onclick='handleSoundOffClick()' id="sound-off">
  <img src='assets/sound-off.png' alt='Audio Off'>
  <img class='hover-overlay' src='assets/sound-off-overlay.png' alt='Audio Off Hover'>
</div>

  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    html, body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: black;
    }

    .screen-wrapper {
      width: 1920px;
      height: 1080px;
      position: relative;
      margin: auto;
    }

    .audio-button {
      position: relative;
      width: 16vw;
      max-width: 160px;
      aspect-ratio: 1 / 1;
      transform: translate(0px, 0px);
      cursor: pointer;
    }

    .audio-button img {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: contain;
      top: 0;
      left: 0;
    }

    .audio-button .hover-overlay {
      opacity: 0;
      transition: opacity 0.3s;
    }

    .audio-button:hover .hover-overlay {
      opacity: 1;
    }

.audio-button:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}


  `;
  document.head.appendChild(style);
  applyScale();
}





function handleSoundClick() {
   // 🔒 Instantly disable both buttons
  document.getElementById("sound-on").style.pointerEvents = "none";
  document.getElementById("sound-off").style.pointerEvents = "none";

 enterFullscreen();

 // ⏱️ Wait just a bit so the click is processed visually first
  setTimeout(() => {
    document.body.classList.add("hide-cursor");
  }, 100); // 100ms is enough

  const audio = document.getElementById("monkeySound");
  if (audio) {
    audio.currentTime = 0;
    audio.play();

    audio.onended = () => {
      transitionToScreen(() => showLogoScreen());
    };
  } else {
    // Fallback: just go to logo screen
    transitionToScreen(() => showLogoScreen());
  }
}


function handleSoundOffClick() {

document.getElementById("sound-on").style.pointerEvents = "none";
document.getElementById("sound-off").style.pointerEvents = "none";

  soundIsEnabled = false; // 🔇 mute future screens
  enterFullscreen();
  transitionToScreen(() => showLogoScreen());

  // ⏱️ Hide cursor just like in sound-on
  setTimeout(() => {
    document.body.classList.add("hide-cursor");
  }, 100);

  transitionToScreen(() => showLogoScreen());

}



function showLogoScreen() {
  document.getElementById("main-content").innerHTML = `

    <div class="screen-wrapper" style="
      background-image: url('assets/logo-screen.png');
      background-size: cover;
      background-position: center;
      height: 1080px;
      width: 1920px;
    ">
    </div>
  `;
  applyScale();


const music = document.getElementById("bgMusic");
if (music) {
  music.currentTime = 0;
  if (soundIsEnabled) {
    music.volume = 0.4;
    music.play();
  } else {
    music.volume = 0;
    music.pause();
  }
}



  setTimeout(() => {
    transitionToScreen(() => showStartScreen());
  }, 3000);
}


function showStartScreen() {
  
document.body.classList.remove("hide-cursor");

  const content = document.getElementById('main-content');
  if (!content) return;

  content.innerHTML = `
    <div class="screen-wrapper" style="
      position: fixed;
      top: 0; left: 0;
      width: 1920px;
      height: 1080px;
      background-color: black;
      background-image: url('assets/menu-start.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
    ">
      <img id="startPrompt" src="assets/press-enter-to-start.png"
        style="
          position: absolute;
          bottom: 5vh;
          left: 50%;
          transform: translateX(-55%);
          width: 20vw;
          max-width: 300px;
          opacity: 1;
          transition: opacity 1s;
        ">
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    html, body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: black;
    }
  `;
  document.head.appendChild(style);
  applyScale();

  const prompt = document.getElementById("startPrompt");
  let fade = false;
  setInterval(() => {
    fade = !fade;
    prompt.style.opacity = fade ? 0.2 : 1;
  }, 1000);

  document.querySelector(".screen-wrapper").addEventListener("click", () => {
  playStartSound();
  transitionToScreen(() => showCategorySelection());
});

}

function handleEnterKey(e) {
  if (e.key === 'Enter') {
    window.removeEventListener('keydown', handleEnterKey);
    transitionToScreen(() => showCategorySelection());
  }
}


function fadeOutMusic(duration = 2000) {
  const music = document.getElementById("bgMusic");
  if (!music || music.paused || music.volume === 0) return;

  const step = 50; // ms
  const steps = duration / step;
  const volumeStep = music.volume / steps;
  const fadeInterval = setInterval(() => {
    if (music.volume - volumeStep > 0) {
      music.volume -= volumeStep;
    } else {
      music.volume = 0;
      music.pause();
      clearInterval(fadeInterval);
    }
  }, step);
}


function playLevelCompleteSound() {
  const sfx = document.getElementById("levelCompleteSound");
  if (sfx) {
    sfx.currentTime = 0;
    sfx.play();
  }
}

function playLevelFailSound() {
  const sfx = document.getElementById("levelFailSound");
  if (sfx) {
    sfx.currentTime = 0;
    sfx.play();
  }
}


function playHoverSound() {
  const hoverAudio = document.getElementById("hoverSound");
  if (hoverAudio) {
    hoverAudio.currentTime = 0;
    hoverAudio.volume = 1;
    hoverAudio.play().catch(e => console.warn("Hover sound error:", e));
  }
}


// ---- SOUND HELPER ----
function playClickSound() {
    const clickAudio = document.getElementById("sound-click");
    if (clickAudio) {
        clickAudio.currentTime = 0;
        clickAudio.play();
    }
}

// ---- START SOUND ----
function playStartSound() {
  const startAudio = document.getElementById("sound-start");
  if (startAudio) {
    startAudio.currentTime = 0;
    startAudio.play();
  }
}

// MUSIC TOGGLE HANDLING (used everywhere except the intro screen)
function toggleSound() {
    playClickSound();
    const music = document.getElementById("bg-music");
    const toggles = document.querySelectorAll(".sound-toggle");

    if (music.paused || music.muted || music.volume === 0) {
        music.muted = false;
        music.volume = 0.5;
        music.play();
        toggles.forEach(t => t.src = "images/sound_on.png");
    } else {
        music.muted = true;
        music.pause();
        toggles.forEach(t => t.src = "images/sound_off.png");
    }
}

// Fade and go to main menu
function goToMainMenu() {
    const fade = document.getElementById("fade-overlay");
    fade.classList.add("active");
    setTimeout(function () {
        document.querySelectorAll(".background").forEach(div => div.style.display = "none");
        document.getElementById("menu-screen").style.display = "flex";

        // Always switch to menu music when returning home
        if (typeof setMainMusic === "function") {
            setMainMusic();
        }

        // Only update sound toggles that actually exist (menu and beyond)
        const soundToggles = document.querySelectorAll(".sound-toggle");
        const music = document.getElementById("bg-music");
        if (music.paused || music.muted || music.volume === 0) {
            soundToggles.forEach(t => t.src = "images/sound_off.png");
        } else {
            soundToggles.forEach(t => t.src = "images/sound_on.png");
        }

        if (typeof attachSoundToggleListeners === "function") attachSoundToggleListeners();
        fade.classList.remove("active");
    }, 400);
}

// Attach toggles to all sound icons (menu and later screens)
document.addEventListener("DOMContentLoaded", () => {
    const music = document.getElementById("bg-music");
    const toggles = document.querySelectorAll(".sound-toggle");

    if (toggles.length > 0) {
        // Set correct icon on load
        if (music.paused || music.muted || music.volume === 0) {
            toggles.forEach(t => t.src = "images/sound_off.png");
        } else {
            toggles.forEach(t => t.src = "images/sound_on.png");
        }
        toggles.forEach(toggle => {
            toggle.addEventListener("click", function() {
                playClickSound();
                if (music.paused || music.muted || music.volume === 0) {
                    music.muted = false;
                    music.volume = 0.5;
                    music.play();
                    toggles.forEach(t => t.src = "images/sound_on.png");
                } else {
                    music.muted = true;
                    music.pause();
                    toggles.forEach(t => t.src = "images/sound_off.png");
                }
            });
        });
    }
});

function showCategorySelection() {
  const content = document.getElementById('main-content');
  if (!content) return;

  content.innerHTML = `
    <div class="screen-wrapper">
      <div class="select-container" id="selectContainer">
        <div class="sliced-button">
          <img src="assets/select-screen/07.png" alt="Left Button">
          <img class="hover-overlay" src="assets/select-screen/07-overlay.png" alt="Left Overlay">
        </div>

        <div class="sliced-button right-slice">
          <img src="assets/select-screen/09.png" alt="Right Button">
          <img class="hover-overlay" src="assets/select-screen/09-overlay.png" alt="Right Overlay">
        </div>

        <div class="center-ui">
          <div class="start-button">
            <img class="normal" src="assets/start-quest.png" alt="Start" />
            <img class="hover" src="assets/start-quest-overlay.png" alt="Start Hover" />
          </div>
        </div>
      </div>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    html, body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: black;
    }

    .screen-wrapper {
      width: 1920px;
      height: 1080px;
      position: relative;
      margin: auto;
    }

    .select-container {
      position: relative;
      width: 1920px;
      height: 1080px;
      background-color: black;
    }

    .sliced-part {
      position: absolute;
      object-fit: contain;
      z-index: 1;
    }

    .sliced-button {
      position: absolute;
      width: 146px;
      height: 243px;
      top: 387px;
      left: 388px;
      z-index: 2;
      transform: translate(0px, -1px);
      cursor: pointer;
    }

    .right-slice {
      transform: translate(0px, -5px);
      width: 115px;
      height: 236px;
      top: 395px;
      left: 1333px;
    }

    .sliced-button img {
      width: 100%;
      height: 100%;
      position: absolute;
      object-fit: contain;
      top: 0;
      left: 0;
    }

    .sliced-button .hover-overlay {
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 3;
    }

    .sliced-button:hover .hover-overlay {
      opacity: 1;
    }

    .center-ui {
      position: absolute;
      top: 60%;
      left: 50%;
      transform: translate(-58%, -25%);
      color: white;
      z-index: 4;
      text-align: center;
    }

    .start-button {
      position: relative;
      width: 300px;
      height: auto;
      cursor: pointer;
      z-index: 10;
      display: inline-block;
      margin-top: 40px;
    }

    .start-button img.normal {
      display: block;
      width: 100%;
      height: auto;
      object-fit: contain;
      position: relative;
      z-index: 1;
    }

    .start-button img.hover {
      display: block;
      width: 100%;
      height: auto;
      object-fit: contain;
      position: absolute;
      top: 0;
      left: 0;
z-index: 2; /* 👈 ensures it's above the normal image */
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    .start-button:hover img.hover {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
  applyScale();

  // Add sliced parts
  document.getElementById('selectContainer').innerHTML += `
    <img src="assets/select-screen/01.png" class="sliced-part" style="top: 0px; left: 0px; width: 388px; height: 390px;">
    <img src="assets/select-screen/02.png" class="sliced-part" style="top: 0px; left: 388px; width: 146px; height: 390px;">
    <img src="assets/select-screen/03.png" class="sliced-part" style="top: 0px; left: 534px; width: 799px; height: 390px;">
    <img src="assets/select-screen/04.png" class="sliced-part" style="top: 0px; left: 1333px; width: 115px; height: 390px;">
    <img src="assets/select-screen/05.png" class="sliced-part" style="top: 0px; left: 1448px; width: 472px; height: 390px;">
    <img src="assets/select-screen/06.png" class="sliced-part" style="top: 390px; left: 0px; width: 388px; height: 236px;">
    <img src="assets/select-screen/08.png" class="sliced-part" style="top: 390px; left: 534px; width: 799px; height: 236px;">
    <img src="assets/select-screen/10.png" class="sliced-part" style="top: 390px; left: 1448px; width: 472px; height: 236px;">
    <img src="assets/select-screen/11.png" class="sliced-part" style="top: 626px; left: 0px; width: 388px; height: 454px;">
    <img src="assets/select-screen/12.png" class="sliced-part" style="top: 626px; left: 388px; width: 146px; height: 454px;">
    <img src="assets/select-screen/13.png" class="sliced-part" style="top: 626px; left: 534px; width: 799px; height: 454px;">
    <img src="assets/select-screen/14.png" class="sliced-part" style="top: 626px; left: 1333px; width: 115px; height: 454px;">
    <img src="assets/select-screen/15.png" class="sliced-part" style="top: 626px; left: 1448px; width: 472px; height: 454px;">
  `;

  
  // Initialize category selection
  const categories = ['food', 'animals', 'jobs'];
  let currentCategoryIndex = 0;

  // Create category image
  const categoryImg = document.createElement('img');
  categoryImg.id = 'categoryImage';
  categoryImg.src = 'assets/food.png';
  categoryImg.style.position = 'absolute';
  categoryImg.style.top = '388px';
  categoryImg.style.left = '810px';
  categoryImg.style.width = '240px';
  categoryImg.style.zIndex = 5;
  document.getElementById('selectContainer').appendChild(categoryImg);

  // Add event listeners
  const rightSlice = document.querySelector('.right-slice');
  const leftSlice = document.querySelector('.sliced-button');
  const startButton = document.querySelector('.start-button');

  if (rightSlice && leftSlice && startButton) {
  rightSlice.addEventListener('click', () => {
    playClickSound();
    currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
    categoryImg.src = `assets/${categories[currentCategoryIndex]}.png`;
  });

  leftSlice.addEventListener('click', () => { // ← this was wrong before
    playClickSound();
    currentCategoryIndex = (currentCategoryIndex - 1 + categories.length) % categories.length;
    categoryImg.src = `assets/${categories[currentCategoryIndex]}.png`;
  });

 startButton.addEventListener('click', () => {
  playStartSound();
  transitionToScreen(() => showLevelSelection(categories[currentCategoryIndex]));
});

} else {
    console.error('Missing required elements in category selection screen');
  }

  // Remove dropdown if it exists
  const label = document.querySelector('label[for="category"]');
  const select = document.getElementById("category");
  if (label) label.remove();
  if (select) select.remove();

}

let currentCategory = '';
let currentWords = [];
let currentLevel = 0;
let score = 0;

function startGame(category, level = 1) {
  currentLevelNumber = level;
  currentCategory = category;
  localStorage.setItem("lastCategory", category);
  currentWords = allWords[category].levels[level].slice(); // clone
  currentLevel = 0;
  score = 0;
  showWordScreen(currentWords[currentLevel]);
}

const bgMusic = document.getElementById("bgMusic");
if (bgMusic) {
  bgMusic.pause();
  bgMusic.currentTime = 0;
}



// DEBUG: Skip to last question with full score
const skipButton = document.createElement('button');
skipButton.textContent = '⏩ Skip to Last Word';
skipButton.style.position = 'absolute';
skipButton.style.top = '20px';
skipButton.style.left = '20px';
skipButton.style.padding = '10px 20px';
skipButton.style.fontSize = '16px';
skipButton.style.zIndex = '999';
skipButton.onclick = () => {
  score = currentWords.length - 1; // give full score minus 1
  currentLevel = currentWords.length - 1; // jump to last word
  showWordScreen(currentWords[currentLevel]);
};
document.body.appendChild(skipButton);


const style = document.createElement("style");
style.textContent = `
  .hint-btn:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
  }
`;
document.head.appendChild(style);

function showWordScreen(word) {
  const scrambled = word.split('').sort(() => Math.random() - 0.5);
  const boxes = word.length;

  let unlocked = JSON.parse(localStorage.getItem('unlockedLevels') || '[1]');
  if (score === currentWords.length && !unlocked.includes(currentLevelNumber + 1) && currentLevelNumber < 10) {
    unlocked.push(currentLevelNumber + 1);
    localStorage.setItem('unlockedLevels', JSON.stringify(unlocked));
  }


const style = document.createElement("style");
style.textContent = `
  .hint-btn {
    cursor: url("assets/cursor.png"), auto !important;
  }

  img[onclick]:hover,
  .hint-btn:hover,
  img.letter:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
  }
`;
document.head.appendChild(style);



  document.getElementById("main-content").innerHTML = `
    <style>

img.drop-box,
  img.letter {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }

      html, body {
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: black;
      }
    </style>





    <div style="display: flex; justify-content: center;">
      <div class="screen-wrapper" style="
        width: 1920px;
        height: 1080px;
        position: relative;
        background-image: url('assets/game-screen.png');
        background-size: cover;
        background-position: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-top: 60px;
      ">
        <div id="game"></div>


<div id="scoreDisplay" style="
  position: absolute;
  top: 50px;
  right: 60px;
  display: flex;
  align-items: center;
  font-size: 48px;
  color: white;
  font-weight: bold;
  z-index: 10;
  pointer-events: none;
">
  <span id="scoreText">${score}</span>
  <img src="assets/coin.png" style="width: 100px; height: 100px; margin-left: 10px;" />
</div>


        <div id="result" style="color: white; margin-top: 20px;"></div>
        <div style="margin-top: 40px; display: flex; gap: 20px;">
          <img id="jack" src="assets/jack-normal.png" style="
            position: absolute;
            bottom: -230px;
            left: 0;
            transform: translateX(-150px);
            width: 900px;
            z-index: 5;
                 pointer-events: none;
          " />



<!-- HINT BUTTONS -->
<!-- NEW HINT BUTTONS AS PNGs -->
<img src="assets/1st.png" class="hint-btn" data-index="0" style="
  position: absolute;
  top: 750px;
  left: 750px;
  width: 120px;
  height: 120px;
  cursor: pointer;
  z-index: 10;
">
<img src="assets/2nd.png" class="hint-btn" data-index="1" style="
  position: absolute;
  top: 750px;
  left: 900px;
  width: 120px;
  height: 120px;
  cursor: pointer;
  z-index: 10;
">
<img src="assets/3rd.png" class="hint-btn" data-index="2" style="
  position: absolute;
  top: 750px;
  left: 1050px;
  width: 120px;
  height: 120px;
  cursor: pointer;
  z-index: 10;
">





<div style="position: absolute; top: 900px; left: 750px;">
  <img src="assets/answer.png" style="width: 120px; height: 120px; cursor: pointer;" onclick="playClickSound(); checkAnswer()" />
</div>
<div style="position: absolute; top: 900px; left: 900px;">
  <img src="assets/reset.png" style="width: 120px; height: 120px; cursor: pointer;" onclick="playClickSound(); resetWord()" />
</div>
<div style="position: absolute; top: 900px; left: 1050px;">
  <img src="assets/undo.png" style="width: 120px; height: 120px; cursor: pointer;" onclick="playClickSound(); undoLetter()" />
</div>


        </div>
      </div>
    </div>
  `;

  applyScale();

 const game = document.getElementById('game');

// Centered wrapper for both rows
const rowsWrapper = document.createElement('div');
rowsWrapper.style.display = 'flex';
rowsWrapper.style.flexDirection = 'column';
rowsWrapper.style.alignItems = 'center';
rowsWrapper.style.justifyContent = 'center';
rowsWrapper.style.height = '100%'; // vertically center the rows
game.appendChild(rowsWrapper);
rowsWrapper.style.background = 'transparent';


// Drop boxes row - FIXED POSITION
const boxRow = document.createElement('div');
boxRow.id = 'boxRow';
boxRow.style.position = 'absolute';
						boxRow.style.top = '230px';  // Adjust this Y position as needed
						boxRow.style.left = '51%';
boxRow.style.transform = 'translateX(-50%)';
boxRow.style.display = 'flex';
boxRow.style.justifyContent = 'center';
boxRow.style.gap = '10px'; // Increase space between boxes
boxRow.style.background = 'transparent';
boxRow.style.zIndex = '5';
game.appendChild(boxRow);


for (let i = 0; i < boxes; i++) {
 const boxWrapper = document.createElement('div');
boxWrapper.className = 'drop-box';
boxWrapper.dataset.index = i;
boxWrapper.style.position = 'relative';
							boxWrapper.style.width = '120px';
							boxWrapper.style.height = '120px';
boxWrapper.style.background = 'transparent';
boxWrapper.style.border = 'none';



const background = document.createElement('img');
background.src = 'assets/empty-piece.png';
							background.style.width = '100%';
							background.style.height = '100%';
background.style.position = 'absolute';
background.style.top = '0';
background.style.left = '0';
background.style.pointerEvents = 'none';

const foreground = document.createElement('img');
foreground.className = 'box-letter';
							foreground.style.width = '100%';
							foreground.style.height = '100%';
foreground.style.position = 'absolute';
foreground.style.top = '0';
foreground.style.left = '0';
foreground.style.opacity = '0';
foreground.style.pointerEvents = 'none';

boxWrapper.appendChild(background);
boxWrapper.appendChild(foreground);
boxRow.appendChild(boxWrapper);

}


// Grabbing letters row
const letterRow = document.createElement('div');
letterRow.id = 'letterRow';
letterRow.style.display = 'flex';
letterRow.style.justifyContent = 'center';
							letterRow.style.gap = '5px';
letterRow.style.background = 'transparent';
rowsWrapper.appendChild(letterRow);

scrambled.forEach(letter => {
  const img = document.createElement('img');
  img.className = 'letter';
  img.src = `assets/letter-${letter.toLowerCase()}.png`;

// Play hover sound on mouse enter
  img.addEventListener('mouseenter', () => {
    if (soundIsEnabled) playHoverSound();
  });

  							img.style.width = '120px';
  							img.style.height = '120px';
                                   letterRow.style.marginTop = '-310px'; // increase = move down, decrease = move up
                                   letterRow.style.transform = 'translateX(17px)'; // Negative = move left, Positive = move right

  img.style.transition = 'transform 0.2s ease';
  img.style.position = 'relative';
  img.style.zIndex = '20';
  img.style.pointerEvents = 'auto';
  img.style.cursor = 'pointer';
  img.style.objectFit = 'contain';
  img.draggable = false;

  img.onclick = () => {
  const sfx = document.getElementById("letterClickSound");
  if (sfx) {
    sfx.currentTime = 0;
sfx.volume = 1; // ✅ Add this line to make sure volume is up
    sfx.play().catch(e => console.error("Audio error:", e));

  }
  fillNextBox(letter, img);
};


  letterRow.appendChild(img);
});




let nextHintIndex = 0;

// ✅ Attach functionality to hint buttons
const hintButtons = document.querySelectorAll('.hint-btn');

hintButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const index = parseInt(btn.dataset.index);
    const wordArr = word.split('');
    const boxes = document.querySelectorAll('.drop-box');

    if (index >= wordArr.length) return;

    const box = boxes[index];
    const letter = wordArr[index];
    const letterImg = box.querySelector('.box-letter');

    // 🚫 Do nothing if this box is already filled
    if (letterImg.dataset.filled) return;

    // ✅ Place correct letter
    letterImg.src = `assets/letter-${letter.toLowerCase()}.png`;
    letterImg.dataset.filled = "hint";
    letterImg.style.opacity = '1';
    userAnswer[index] = letter;

    // 🔊 Play sound
    const sfx = document.getElementById("letterClickSound");
    if (sfx) {
      sfx.currentTime = 0;
      sfx.volume = 1;
      sfx.play().catch(e => console.error("Audio error:", e));
    }

    // ❌ Remove used letter from pool below
    const letterRow = document.getElementById("letterRow");
    const letterImgs = letterRow.querySelectorAll("img.letter");
    for (let img of letterImgs) {
      if (img.src.includes(`letter-${letter.toLowerCase()}.png`) && img.style.display !== "none") {
        img.style.display = "none";
        break;
      }
    }

    // 🔒 Hide hint button
    btn.style.display = 'none';
  });
});







  userAnswer = [];
  usedButtons = [];
}








let userAnswer = [];
let usedButtons = [];

function fillNextBox(letter, button) {
  const boxes = document.querySelectorAll('.drop-box');
  for (let box of boxes) {
    const letterImg = box.querySelector('.box-letter');
    if (!letterImg.dataset.filled) {
      letterImg.src = `assets/letter-${letter.toLowerCase()}.png`;
      letterImg.dataset.filled = "true";
      letterImg.style.opacity = '1';

      userAnswer.push(letter);
      usedButtons.push(button);
      button.style.display = 'none';
      break;
    }
  }
}



function undoLetter() {
  if (userAnswer.length === 0) return;
  const boxes = document.querySelectorAll('.drop-box');
  for (let i = boxes.length - 1; i >= 0; i--) {
    const letterImg = boxes[i].querySelector('.box-letter');
   
if (letterImg.dataset.filled === "hint") continue;
 if (letterImg.dataset.filled === "true") {

      letterImg.style.opacity = '0';
      letterImg.dataset.filled = "";
      const lastButton = usedButtons.pop();
      if (lastButton) lastButton.style.display = 'inline-block';
      userAnswer.pop();
      break;
    }
  }
}



function resetWord() {
  const boxes = document.querySelectorAll('.drop-box');
  boxes.forEach(box => {
    const letterImg = box.querySelector('.box-letter');
   if (letterImg.dataset.filled !== "hint") {
  letterImg.style.opacity = '0';
  letterImg.dataset.filled = "";
}
  });

  usedButtons.forEach(btn => btn.style.display = 'inline-block');
  userAnswer = [];
  usedButtons = [];
}



function checkAnswer() {
  const jackImg = document.getElementById('jack');
  const word = currentWords[currentLevel];
 



// Fix potential alignment issues caused by hints + undo
const boxes = document.querySelectorAll('.drop-box');
userAnswer = [];

boxes.forEach(box => {
  const letterImg = box.querySelector('.box-letter');
  const src = letterImg.src;
  const match = src.match(/letter-([a-z])\.png$/i);
  if (match) {
    userAnswer.push(match[1].toLowerCase());
  } else {
    userAnswer.push("");
  }
});

 const answer = userAnswer.join('');
 
if (userAnswer.includes("") || userAnswer.length < word.length) {
  result.textContent = '';
  return;
}

const result = document.getElementById('result');
  if (answer.length < word.length) {
    result.textContent = '';
    return;
  }
  
  if (answer === word) {
    score++;
    result.textContent = '';
    if (jackImg) jackImg.src = 'assets/jack-happy.png';
    document.getElementById('scoreText').textContent = score;
 } else {
  result.textContent = '';
  if (jackImg) jackImg.src = 'assets/jack-sad.png';
document.body.classList.add("hide-cursor");



  // 💥 NEW FAIL LOGIC
setTimeout(() => {
  transitionToScreen(() => {
    // ✅ Inject global style if missing
    if (!document.getElementById("hide-cursor-style")) {
      const style = document.createElement("style");
      style.id = "hide-cursor-style";
      style.textContent = `body.hide-cursor { cursor: none !important; }`;
      document.head.appendChild(style);
    }

    // ✅ Hide cursor
    document.body.style.cursor = "none";

    // ✅ Render fail screen
  document.getElementById("main-content").innerHTML = `
      <div class="screen-wrapper" style="
        background-image: url('assets/fail-screen.png');
        background-size: cover;
        background-position: center;
        height: 1080px;
        width: 1920px;
        cursor: none;">
      </div>
  `;
  applyScale();


    playLevelFailSound();

    setTimeout(() => {
      // ✅ Restore cursor
      document.body.classList.remove("hide-cursor");
      const lastCategory = localStorage.getItem("lastCategory") || "food";
      transitionToScreen(() => showLevelSelection(lastCategory));
    }, 4000);
  });
}, 800);

}


setTimeout(() => {
  if (currentLevel < currentWords.length - 1) {
    currentLevel++;
        showWordScreen(currentWords[currentLevel]);
  } else {
    if (score === currentWords.length) {
      let unlocked = JSON.parse(localStorage.getItem('unlockedLevels') || '[1]');
      if (!unlocked.includes(currentLevelNumber + 1) && currentLevelNumber < 10) {
        unlocked.push(currentLevelNumber + 1);
        localStorage.setItem('unlockedLevels', JSON.stringify(unlocked));
      }

if (currentLevelNumber === 10) {
  fadeOutMusic(2000); // Fade out background music

  transitionToScreen(() => {
    // Show the final image
    document.getElementById("main-content").innerHTML = `
      <div class="screen-wrapper" style="
        background-image: url('assets/game-complete.png');
        background-size: cover;
        background-position: center;
        height: 1080px;
        width: 1920px;">
      </div>
    `;
    applyScale();

    // Fade in game-complete audio
    const completeSound = document.getElementById("gameCompleteSound");
    if (completeSound && soundIsEnabled) {
      completeSound.volume = 0;
      completeSound.currentTime = 0;
      completeSound.play();

      const fadeIn = setInterval(() => {
        if (completeSound.volume < 0.9) {
          completeSound.volume += 0.05;
        } else {
          completeSound.volume = 1;
          clearInterval(fadeIn);
        }
      }, 100);
    }

    // After 5 seconds, go to level selection
    setTimeout(() => {
      const lastCategory = localStorage.getItem("lastCategory") || "food";
      transitionToScreen(() => showLevelSelection(lastCategory));
    }, 5000);
  });

  return;
}


      const paddedLevel = String(currentLevelNumber).padStart(2, '0');
      const gemImage = `assets/gem${paddedLevel}.png`;
      const scoreContent = `
        <style>
          html, body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            width: 1920px;
            height: 1080px;
            background: url('${gemImage}') no-repeat center center;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            cursor: none;
          }
        </style>
      `;

      playLevelCompleteSound();

      transitionToScreen(() => {
        document.getElementById("main-content").innerHTML = `${scoreContent}`;
        applyScale();
        const completeAudio = document.getElementById("levelCompleteSound");
        if (completeAudio) {
          completeAudio.onended = () => {
            const lastCategory = localStorage.getItem("lastCategory") || "food";
            transitionToScreen(() => showLevelSelection(lastCategory));
          };
        } else {
          setTimeout(() => {
            const lastCategory = localStorage.getItem("lastCategory") || "food";
            transitionToScreen(() => showLevelSelection(lastCategory));
          }, 5000);
        }
      });
    } else {
      transitionToScreen(() => {
        document.getElementById("main-content").innerHTML = `
          <div class="screen-wrapper" style="
            background-image: url('assets/fail-screen.png');
            background-size: cover;
            background-position: center;
            height: 1080px;
            width: 1920px;">
          </div>
        `;
        applyScale();
        setTimeout(() => {
          const lastCategory = localStorage.getItem("lastCategory") || "food";
          transitionToScreen(() => showLevelSelection(lastCategory));
        }, 2000);
      });
    }
  }
}, 1200);

}

function showLevelSelection(category) {
  const content = document.getElementById('main-content');
  if (!content) return;

  const music = document.getElementById("bgMusic");
if (music && soundIsEnabled && music.paused) {
  music.currentTime = 0;
  music.volume = 0.4;
  music.play();
}


  content.innerHTML = `
    <div class="screen-wrapper">
      <h1 style="margin-bottom: 30px; color: white;"></h1>
      <div class="level-grid" id="levelButtons"></div>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    html, body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: black;
    }
    .screen-wrapper {
      width: 1920px;
      height: 1080px;
      background-image: url('assets/game-screen.png');
      background-size: cover;
      background-position: center;
      margin: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

  .level-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 40px;
  transform: translateY(0px); /* 👈 shifts the whole grid down */
}

    .level-wrapper {
      position: relative;
      width: 200px;
    }
    .level-image {
      width: 100%;
      height: auto;
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    .level-image:hover {
      transform: scale(1.05);
    }
    .locked-level {
      opacity: 1;
      cursor: default;
      pointer-events: none;
    }
    .lock-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: auto;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);
  // Scale the wrapper after rendering
  applyScale();

  const container = document.getElementById('levelButtons');
  const unlocked = JSON.parse(localStorage.getItem('unlockedLevels') || '[1]');
  for (let i = 1; i <= 10; i++) {
    const wrapper = document.createElement('div');
    wrapper.className = 'level-wrapper';

    const img = document.createElement('img');
    img.src = 'assets/lv' + i + '.png';
    img.className = 'level-image';

    if (!unlocked.includes(i)) {
      img.classList.add('locked-level');
      const overlay = document.createElement('img');
      overlay.src = 'assets/lock.png';
      overlay.className = 'lock-overlay';
      wrapper.appendChild(img);
      wrapper.appendChild(overlay);
    } else {
img.onclick = () => {
  playClickSound();
  fadeOutMusic(); // 🔉 fade out before game
  transitionToScreen(() => startGame(category, i));
};

      wrapper.appendChild(img);
    }

    container.appendChild(wrapper);
  }
}

document.addEventListener("mouseover", (e) => {
const hoverTargets = [
  "sound-on", "sound-off",
  "start-quest", "start-quest-overlay",
  "select-screen/07", "select-screen/09", // Arrows
  "reset", "undo", "answer",
  "hint-btn", "level-image"
];

  const src = e.target?.src || "";
  const id = e.target?.id || "";
  const className = e.target?.className || "";

  if (
    hoverTargets.some(name => src.includes(name) || id.includes(name) || className.includes(name))
  ) {
    playHoverSound();
  }

});

