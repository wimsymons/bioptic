// constants
const defaultSpeed = 5;
const maxSpeed = 20;
const speedMultiplier = 100;

// variables
var intervalId = null;
var fontSizeRange = [30, 70];
var speed = defaultSpeed;
var textColor = "#000000";
var slideDirection = 'L';
var words;

// on load: grootte + snelheid slider
document.addEventListener('DOMContentLoaded', function () {
  var fontSizeSlider = document.getElementById('grootte');
  noUiSlider.create(fontSizeSlider, {
    start: fontSizeRange,
    connect: true,
    range: {
      'min': 10,
      'max': 100
    },
    step: 5,
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
    start: defaultSpeed,
    connect: 'lower',
    range: {
      'min': 0,
      'max': 10
    },
    step: 1,
    format: {
      from: function (value) {
        return Number(parseInt(value));
      },
      to: function (value) {
        return parseInt(value).toString();
      }
    },
    tooltips: true
  });
  speedSlider.noUiSlider.on('change', function (values) {
    speed = [parseInt(values[0])];
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    var milliseconds = (maxSpeed - speed) * speedMultiplier;
    console.log("Speed", speed, ",", milliseconds, "ms");
    if (speed > 0) {
      intervalId = setInterval(changeElement, milliseconds);
      document.getElementById('start').classList.add("started");
      document.getElementById('stop').classList.remove("stopped");
    } else {
      document.getElementById('start').classList.remove("started");
      document.getElementById('stop').classList.add("stopped");
    }
  });

  loadWords()
});

// sidebar open-close
document.getElementById('openclose').addEventListener('click', function () {
  document.getElementById('sidebar').classList.toggle("sidebar-closed");
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

// richting: L(eft), R(ight), D(own), U(p), A(ll)
document.getElementById('richting').addEventListener('change', function () {
  slideDirection = document.getElementById('richting').value;
});

// start
document.getElementById('start').addEventListener('click', function () {
  if (speed > 0) {
    document.getElementById('start').classList.add("started");
    document.getElementById('stop').classList.remove("stopped");
  }
  if (!intervalId && speed > 0) {
    var milliseconds = (maxSpeed - speed) * speedMultiplier;
    console.log("Speed", speed, ",", milliseconds, "ms");
    intervalId = setInterval(changeElement, milliseconds);
  } else {
    // show once
    changeElement();
  }
});

// stop
document.getElementById('stop').addEventListener('click', function () {
  document.getElementById('start').classList.remove("started");
  document.getElementById('stop').classList.add("stopped");
  clearInterval(intervalId);
  intervalId = null;
});

function changeElement() {
  var elem = document.getElementById('element');
  let playGroundElem = document.getElementById('playground');

  var randomFontSize = fontSizeRange[0] + Math.floor(Math.random() * (fontSizeRange[1] - fontSizeRange[0]));

  var randomX = Math.floor(Math.random() * playGroundElem.clientWidth);
  var randomY = Math.floor(Math.random() * playGroundElem.clientHeight);

  console.log("x = ", randomX, " y = ", randomX, " size = ", randomFontSize)

  // zet kleur, grootte, locatie
  elem.style = 'color:' + textColor + ';font-size:' + randomFontSize + 'px;top:' + randomY + 'px;left:' + randomX + 'px';

  setText(elem);
}

function setText(element) {
  if (words) {
    element.innerText = words[Math.floor(Math.random() * words.length)];
  }
}

function loadWords() {
  var wordFile = document.getElementById('inhoud').value;
  console.log("Loading words", wordFile);
  fetch(wordFile).then(function (response) {
    response.text().then(function (text) {
      words = text.split('\n');
      console.log("Loaded", words.length, "words");
    });
  });
}
