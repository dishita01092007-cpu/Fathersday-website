// ===== DOOR OPEN INTERACTION =====
const doorFrame   = document.getElementById('doorFrame');
const doorScreen  = document.getElementById('door-screen');
const openBtn     = document.getElementById('openDoorBtn');

let doorsOpened = false;

function openDoors(){
  if(doorsOpened) return;
  doorsOpened = true;

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
    if(entry.isIntersecting){
      // restart burst animation each time it's freshly triggered
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target); // pop once, like a balloon - doesn't need to repeat
    }
  });
}, { threshold: 0.28 });

memories.forEach(m => observer.observe(m));

// ===== MUSIC PLAYER =====
const musicPlayer = document.getElementById('musicPlayer');
const musicToggle = document.getElementById('musicToggle');
const bgMusic      = document.getElementById('bgMusic');
const iconPlay     = musicToggle.querySelector('.icon-play');
const iconPause    = musicToggle.querySelector('.icon-pause');

let isPlaying = false;

musicToggle.addEventListener('click', () => {
  if(!isPlaying){
    bgMusic.play().catch(() => {
      // Audio file not added yet at audio/papa-meri-jaan.mp3
      console.warn('Add your music file at audio/papa-meri-jaan.mp3 to enable playback.');
    });
    isPlaying = true;
  } else {
    bgMusic.pause();
    isPlaying = false;
  }
  updateMusicUI();
});

function updateMusicUI(){
  musicPlayer.classList.toggle('playing', isPlaying);
  iconPlay.style.display  = isPlaying ? 'none' : 'block';
  iconPause.style.display = isPlaying ? 'block' : 'none';
  musicToggle.setAttribute('aria-label', isPlaying ? 'Pause background music' : 'Play background music');
  musicToggle.setAttribute('title', isPlaying ? 'Pause music' : 'Play music');
}

// if playback ends unexpectedly (e.g. file missing), reset icon state
bgMusic.addEventListener('pause', () => {
  if(isPlaying && bgMusic.currentTime === 0){
    isPlaying = false;
    updateMusicUI();
  }
});