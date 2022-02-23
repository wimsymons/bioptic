'use strict';

// constants
const speedMin = 2;
const speedMax = 10;
const speedStep = 1;
const initialSpeed = 5;
const speedMultiplier = 1000;

const initialAnimSpeed = 4;
const animSpeedMin = 1;
const animSpeedMax = 16;
const animSpeedStep = 1;

const fontSizeMin = 0;
const fontSizeMax = 100;
const fontSizeStep = 5;
const initialFontSizeRange = [30, 70];

const allAnimations = ['backInLeft', 'backInRight', 'backInDown', 'backInUp'];

// variables
var intervalId = null;
var fontSizeRange = initialFontSizeRange;
var speed = initialSpeed;
var textColor = "#000000";
var slideDirection = null;
var contentLocation = 'C';
var words;
var animating = false;

// on load: grootte + snelheid slider
document.addEventListener('DOMContentLoaded', function () {
  var fontSizeSlider = document.getElementById('grootte');
  noUiSlider.create(fontSizeSlider, {
    start: initialFontSizeRange,
    connect: true,
    range: {
      'min': fontSizeMin,
      'max': fontSizeMax
    },
    step: fontSizeStep,
    format: {
      from: function (value) {
        return Number(parseInt(value));
      },
      to: function (value) {
        return parseInt(value).toString();
      }
    },
    tooltips: [true, true]
  });
  fontSizeSlider.noUiSlider.on('change', function (values) {
    fontSizeRange = [parseInt(values[0]), parseInt(values[1])];
    console.log("New font size range", fontSizeRange);
    changeElement();
  });

  var speedSlider = document.getElementById('snelheid');
  noUiSlider.create(speedSlider, {
    start: initialSpeed,
    connect: 'lower',
    range: {
      'min': speedMin,
      'max': speedMax
    },
    step: speedStep,
    format: {
      from: function (value) {
        return Number(parseInt(value));
      },
      to: function (value) {
        return parseInt(value) + 's';
      }
    },
    tooltips: true
  });
  speedSlider.noUiSlider.on('change', function (values) {
    speed = parseInt(values[0]);
    if (intervalId) {
      // when started, stop first and re-schedule
      clearInterval(intervalId);
      intervalId = null;
      changeElement(); // show first immediately
      var milliseconds = calculateInterval(speed);
      console.log("Showing every", milliseconds, "ms");
      intervalId = setInterval(changeElement, milliseconds);
    }
  });

  var animSpeedSlider = document.getElementById('animatie-snelheid');
  noUiSlider.create(animSpeedSlider, {
    start: initialAnimSpeed,
    connect: 'lower',
    range: {
      'min': animSpeedMin,
      'max': animSpeedMax
    },
    step: animSpeedStep,
    format: {
      from: function (value) {
        return Number(parseInt(value));
      },
      to: function (value) {
        return parseInt(value) + 's';
      }
    },
    tooltips: true
  });
  animSpeedSlider.noUiSlider.on('change', function (values) {
    setAnimSpeed(parseInt(values[0]));
  });

  setAnimSpeed(initialAnimSpeed);
  loadWords();
});

// sidebar open-close
document.getElementById('openclose').addEventListener('click', function () {
  document.getElementById('sidebar').classList.toggle("sidebar-closed");
  // re-draw
  changeElement();
});

// inhoud
document.getElementById('inhoud').addEventListener('change', function () {
  loadWords();
});

// voorgrond
document.getElementById('voorgrond').addEventListener('change', function () {
  textColor = document.getElementById('voorgrond').value;
  changeElement();
});

// achtergrond
document.getElementById('achtergrond').addEventListener('change', function () {
  document.getElementById('playground').style = 'background-color:' + document.getElementById('achtergrond').value;
});

// plaats: C(entered), R(andom)
document.getElementById('plaats').addEventListener('change', function () {
  contentLocation = document.getElementById('plaats').value;
});

// richting: N(one), L(eft), R(ight), D(own), U(p), A(ll)
document.getElementById('richting').addEventListener('change', function () {
  slideDirection = document.getElementById('richting').value;
});

// start
document.getElementById('start').addEventListener('click', function () {
  if (intervalId) {
    // when started, stop first
    clearInterval(intervalId);
    intervalId = null;
  } else {
    document.getElementById('start').classList.add("started");
    document.getElementById('stop').classList.remove("stopped");
  }
  // start again
  var milliseconds = calculateInterval(speed);
  console.log("Started, show every", milliseconds, "ms");
  changeElement(); // show first immediately
  intervalId = setInterval(changeElement, milliseconds);
});

// stop
document.getElementById('stop').addEventListener('click', function () {
  if (intervalId) {
    document.getElementById('start').classList.remove("started");
    document.getElementById('stop').classList.add("stopped");
    clearInterval(intervalId);
    intervalId = null;
    console.log("Stopped");
  }
});

function changeElement() {
  // don't change while animating
  if (animating) {
    return;
  }

  var elem = document.getElementById('element');
  let playGroundElem = document.getElementById('playground');

  var fontSize = fontSizeRange[0] + Math.floor(Math.random() * (fontSizeRange[1] - fontSizeRange[0]));

  // give new text
  setText(elem);

  // set color and font size to recalc elem width/height
  elem.style.color = textColor;
  elem.style.fontSize = fontSize + 'px';

  // set (end) position
  var x, y;
  if (contentLocation === 'C') {
    x = Math.floor(0.5 * (playGroundElem.clientWidth - elem.clientWidth));
    y = Math.floor(0.5 * (playGroundElem.clientHeight - elem.clientHeight));
  } else if (contentLocation === 'R') {
    x = Math.floor(Math.random() * (playGroundElem.clientWidth - elem.clientWidth));
    y = Math.floor(Math.random() * (playGroundElem.clientHeight - elem.clientHeight));
  }
  elem.style.top = y + 'px';
  elem.style.left = x + 'px';

  animateSlide(elem);
}

function setText(element) {
  if (words) {
    var newWord = words[Math.floor(Math.random() * words.length)];
    console.log("Showing", newWord);
    element.innerText = newWord;
  }
}

function calculateInterval(newSpeed) {
  return newSpeed * speedMultiplier;
}

function loadWords() {
  var wordFile = document.getElementById('inhoud').value;
  console.log("Loading words", wordFile);
  fetch(wordFile).then(function (response) {
    response.text().then(function (text) {
      words = text.split('\n').filter(word => word);
      console.log("Loaded", words.length, "words");
      changeElement();
    });
  });
}

function animateSlide(elem) {
  var animation = null;

  switch (slideDirection) {
    case 'L':
      animation = 'backInLeft';
      break;
    case 'R':
      animation = 'backInRight';
      break;
    case 'U':
      animation = 'backInDown';
      break;
    case 'D':
      animation = 'backInUp';
      break;
    case 'A':
      animation = allAnimations[Math.floor(Math.random() * allAnimations.length)];
      break;
  }

  if (animation === null) {
    return;
  }

  console.log('Animating with', animation);

  const animationName = 'animate__' + animation;

  animating = true;
  elem.classList.add('animate__animated', animationName);

  function handleAnimationEnd(event) {
    event.stopPropagation();
    animating = false;
    elem.classList.remove('animate__animated', animationName);
  }

  elem.addEventListener('animationend', handleAnimationEnd, {once: true});
}

function setAnimSpeed(animSpeed) {
  // set animation speed
  document.documentElement.style.setProperty('--animate-duration', '' + animSpeed + 's');
}
