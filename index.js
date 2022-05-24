const playBtn = document.querySelector(".play-btn");
const teatherBtn = document.querySelector(".teather-btn");
const fullScreenBtn = document.querySelector(".full-screen-btn");
const miniPlayBtn = document.querySelector(".mini-play-btn");
const video = document.querySelector("video");
const videoContainer = document.querySelector(".video-container");
const muteBtn = document.querySelector(".mute-btn");
const volumeSlider = document.querySelector(".volume-slider");
const currentTime = document.querySelector(".current-time");
const totalDuration = document.querySelector(".total-duration");
const captions = document.querySelector(".captions-btn");

fullScreenBtn.addEventListener("click", toggleFullScreenBtn);

teatherBtn.addEventListener("click", toggleTeather);

miniPlayBtn.addEventListener("click", toggleMiniPlay);

document.addEventListener("keydown", (e) => {
  const tagName = document.activeElement.tagName.toLocaleLowerCase();
  if (tagName === "input") return;

  switch (e.key.toLowerCase()) {
    case " ":
      if (tagName === "button") return;
    case "k":
      togglePlayBtn();
      break;
    case "i":
      toggleMiniPlay();
      break;
    case "t":
      toggleTeather();
      break;
    case "f":
      toggleFullScreenBtn();
      break;
    case "m":
      toggleMute();
      break;
    case "arrowright":
    case "l":
      manipulateTime(5);
      break;
    case "arrowleft":
    case "j":
      manipulateTime(-5);
      break;
    default:
      break;
  }
});

// pause/play functionality
playBtn.addEventListener("click", togglePlayBtn);
video.addEventListener("click", togglePlayBtn);

function togglePlayBtn() {
  video.paused ? video.play() : video.pause();
}

video.addEventListener("play", () => {
  videoContainer.classList.remove("paused");
});
video.addEventListener("pause", () => {
  videoContainer.classList.add("paused");
});
// end play/pause functionality

// view
function toggleFullScreenBtn() {
  if (document.fullscreenElement) {
    document
      .exitFullscreen()
      .then(() => videoContainer.classList.remove("full-screen"));
  } else {
    videoContainer
      .requestFullscreen()
      .then(() => videoContainer.classList.add("full-screen"));
  }
}

function toggleTeather() {
  if (document.fullscreenElement) {
    document
      .exitFullscreen()
      .then(() => videoContainer.classList.remove("full-screen"));
  }
  videoContainer.classList.toggle("teather");
}

function toggleMiniPlay() {
  if (videoContainer.classList.contains("mini-play")) {
    document.exitPictureInPicture();
  }
  video.requestPictureInPicture();
}

video.addEventListener("enterpictureinpicture", () =>
  videoContainer.classList.add("mini-play")
);
video.addEventListener("leavepictureinpicture", () =>
  videoContainer.classList.remove("mini-play")
);

// volume
muteBtn.addEventListener("click", toggleMute);
volumeSlider.addEventListener("input", (e) => {
  video.volume = e.target.value;
  video.muted = e.target.value == 0;
});

function toggleMute() {
  video.muted = !video.muted;
}

video.addEventListener("volumechange", () => {
  volumeSlider.value = video.volume;
  let levelVolume;
  if (video.muted || video.volume === 0) {
    volumeSlider.value = 0;
    levelVolume = "muted";
  } else if (video.volume >= 0.5) {
    levelVolume = "high";
  } else {
    levelVolume = "low";
  }
  videoContainer.dataset.volumeLevel = levelVolume;
});

// duration video
video.addEventListener("loadeddata", () => {
  totalDuration.textContent = formatDuration(video.duration);
});
video.addEventListener("timeupdate", () => {
  currentTime.textContent = formatDuration(video.currentTime);
});

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
});
function formatDuration(seconds) {
  const second = Math.floor(seconds % 60);
  const minute = Math.floor(seconds / 60) % 60;
  const hours = Math.floor(seconds / 3600);

  if (hours === 0) {
    return `${minute}:${leadingZeroFormatter.format(second)}`;
  } else {
    return `${hours}:${leadingZeroFormatter.format(
      minute
    )}:${leadingZeroFormatter.format(second)}`;
  }
}

function manipulateTime(time) {
  video.currentTime += time;
}

captions.addEventListener("click", () => {
  videoContainer.classList.toggle("captions");
});
