// ===== DOOR OPEN INTERACTION =====
const doorFrame   = document.getElementById('doorFrame');
const doorScreen  = document.getElementById('door-screen');
const openBtn     = document.getElementById('openDoorBtn');

// ===== MUSIC PLAYER =====
const musicPlayer = document.getElementById('musicPlayer');
const musicToggle = document.getElementById('musicToggle');
const bgMusic     = document.getElementById('bgMusic');
const iconPlay    = musicToggle.querySelector('.icon-play');
const iconPause   = musicToggle.querySelector('.icon-pause');

let doorsOpened = false;
let isPlaying = false;

function openDoors() {
  if (doorsOpened) return;
  doorsOpened = true;

  // Start music automatically when doors open
  bgMusic.play()
    .then(() => {
      isPlaying = true;
      updateMusicUI();
    })
    .catch(() => {
      console.warn('Add your music file at audio/papa-meri-jaan.mp3 to enable playback.');
    });

  doorFrame.classList.add('opened');
  openBtn.classList.add('fired');

  // allow the door swing + light burst to play, then reveal the page
  setTimeout(() => {
    doorScreen.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }, 1500);
}

openBtn.addEventListener('click', openDoors);
doorFrame.addEventListener('click', openDoors);

// lock scroll until doors open
document.body.style.overflow = 'hidden';

// ===== SCROLL-TRIGGERED PHOTO POP / BURST =====
const memories = document.querySelectorAll('.memory');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.28 });

memories.forEach(m => observer.observe(m));

// ===== MUSIC TOGGLE BUTTON =====
musicToggle.addEventListener('click', () => {
  if (!isPlaying) {
    bgMusic.play()
      .then(() => {
        isPlaying = true;
        updateMusicUI();
      })
      .catch(() => {
        console.warn('Could not play audio.');
      });
  } else {
    bgMusic.pause();
    isPlaying = false;
    updateMusicUI();
  }
});

function updateMusicUI() {
  musicPlayer.classList.toggle('playing', isPlaying);

  iconPlay.style.display = isPlaying ? 'none' : 'block';
  iconPause.style.display = isPlaying ? 'block' : 'none';

  musicToggle.setAttribute(
    'aria-label',
    isPlaying ? 'Pause background music' : 'Play background music'
  );

  musicToggle.setAttribute(
    'title',
    isPlaying ? 'Pause music' : 'Play music'
  );
}

// Keep UI synced if music pauses
bgMusic.addEventListener('pause', () => {
  if (isPlaying) {
    isPlaying = false;
    updateMusicUI();
  }
});

bgMusic.addEventListener('play', () => {
  if (!isPlaying) {
    isPlaying = true;
    updateMusicUI();
  }
});