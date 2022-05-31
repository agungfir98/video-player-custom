const playBtn = document.querySelector(".play-btn");
const teatherBtn = document.querySelector(".teather-btn");
const fullScreenBtn = document.querySelector(".full-screen-btn");
const miniPlayBtn = document.querySelector(".mini-play-btn");
const captionBtn = document.querySelector(".captions-btn");
const playBackSpeedBtn = document.querySelector(".playback-speed-btn");
const playSpeedBtns = document.querySelectorAll(".play-speed");

const video = document.querySelector("video");
const videoContainer = document.querySelector(".video-container");
const playbackWrapper = document.querySelector(".playback-wrapper");
const muteBtn = document.querySelector(".mute-btn");
const volumeSlider = document.querySelector(".volume-slider");
const currentTime = document.querySelector(".current-time");
const totalDuration = document.querySelector(".total-duration");
const playbackOption = document.querySelector(".playback-option");
const timelineContainer = document.querySelector(".timeline-container");

fullScreenBtn.addEventListener("click", toggleFullScreenBtn);

teatherBtn.addEventListener("click", toggleTeather);

miniPlayBtn.addEventListener("click", toggleMiniPlay);

document.addEventListener("click", (e) => {
  const isOptionBtn = e.target.matches("[data-option-btn]");
  if (!isOptionBtn) {
    playbackWrapper.classList.remove("active");
  }
});

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
    case "c":
      captionsToggle();
      break;
    default:
      break;
  }
});

// timeline
timelineContainer.addEventListener("mousemove", handleTimeline);
timelineContainer.addEventListener("mousedown", toggleScrubbing);
document.addEventListener("mouseup", (e) => {
  if (isScrubbing) toggleScrubbing(e);
});
document.addEventListener("mousemove", (e) => {
  if (isScrubbing) handleTimeline(e);
});

let isScrubbing = false;
let wasPaused;

function toggleScrubbing(e) {
  const rect = timelineContainer.getBoundingClientRect();
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

  isScrubbing = (e.buttons & 1) === 1;
  videoContainer.classList.toggle("scrubbing", isScrubbing);
  if (isScrubbing) {
    wasPaused = video.paused;
    video.pause();
  } else {
    video.currentTime = percent * video.duration;
    if (!wasPaused) video.play();
  }
  handleTimeline(e);
}

function handleTimeline(e) {
  const rect = timelineContainer.getBoundingClientRect();
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

  timelineContainer.style.setProperty("--preview-position", percent);

  if (isScrubbing) {
    e.preventDefault();
    timelineContainer.style.setProperty("--progress-position", percent);
  }
}

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
  const percent = video.currentTime / video.duration;
  timelineContainer.style.setProperty("--progress-position", percent);
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

// captions
video.textTracks[0].mode = "hidden";

function captionsToggle() {
  const captions = video.textTracks[0];
  const isHidden = captions.mode === "hidden";
  captions.mode = isHidden ? "showing" : "hidden";
  videoContainer.classList.toggle("captions", isHidden);
}

captionBtn.addEventListener("click", captionsToggle);

// playback speed
const dataPlaybackSpeed = videoContainer.dataset.playSpeed;

video.playbackRate = dataPlaybackSpeed;
video.playbackRate;

const checkListNode = document.createElement("span");
checkListNode.className = "checklist";
const checkList = document.createTextNode(" ✔");
checkListNode.appendChild(checkList);

playSpeedBtns.forEach((i) => {
  if (i.dataset.playSpeed === videoContainer.dataset.playSpeed) {
    i.prepend(checkListNode);
  }
  i.addEventListener("click", changePlaybackrate);
});

function changePlaybackrate() {
  video.playbackRate = this.dataset.playSpeed;
  videoContainer.dataset.playSpeed = this.dataset.playSpeed;
  playSpeedBtns.forEach((i) => {
    if (i.dataset.playSpeed === videoContainer.dataset.playSpeed) {
      i.prepend(checkListNode);
    }
  });
}

playBackSpeedBtn.addEventListener("click", togglePlaySpeed);
function togglePlaySpeed() {
  const isPlaybackWreapperActive = playbackWrapper.classList.contains("active");
  if (isPlaybackWreapperActive) {
    playbackWrapper.classList.remove("active");
  } else {
    playbackWrapper.classList.add("active");
  }
}
