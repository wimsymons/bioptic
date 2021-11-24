// constants
const alphabet = 'ABCDEFGHIJKLMNROPQRSTUVWXYZabcdefghijklmnropqrstuvwxyz0123456789';
const defaultSpeed = 5;
const maxSpeed = 20;
const speedMultiplier = 100;

// variables
var intervalId;
var fontSizeRange = [30, 70];
var speed = defaultSpeed;
var textColor = "#000000";
var elemType = 'A';
var slideDirection = 'L';
var shortWords = [];
var longWords = [];

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

});

// sidebar open-close
document.getElementById('openclose').addEventListener('click', function () {
  document.getElementById('sidebar').classList.toggle("sidebar-closed");
});

// inhoud: A(lphabetic)/S(hort)/L(ong)
document.getElementById('inhoud').addEventListener('change', function () {
  elemType = document.getElementById('inhoud').value;
  switch (elemType) {
    case 'S':
      loadWords(shortWords, 'kort.txt');
      break;
    case 'L':
      loadWords(longWords, 'lang.txt');
      break;
  }
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

  // 0-99% afhankelijk van oog
  var randomX = Math.floor(Math.random() * playGroundElem.clientWidth);

  // 0-99% hoogte
  var randomY = Math.floor(Math.random() * playGroundElem.clientHeight);
  console.log("x = ", randomX, " y = ", randomX, " size = ", randomFontSize)

  // zet kleur, grootte, locatie
  elem.style = 'color:' + textColor + ';font-size:' + randomFontSize + 'px;top:' + randomY + 'px;left:' + randomX + 'px';

  setText(elem);
}

function setText(element) {
  switch (elemType) {
    case 'A':
      element.innerText = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      break;
    case 'S':
      element.innerText = shortWords[Math.floor(Math.random() * shortWords.length)];
      break;
    case 'L':
      element.innerText = longWords[Math.floor(Math.random() * longWords.length)];
      break;
  }
}

function loadWords(wordArray, wordFile) {
  fetch(wordFile).then(function (response) {
    response.text().then(function (text) {
      wordArray.length = 0;
      wordArray.push(...text.split('\n'));
    });
  });
}
