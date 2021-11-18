// constants
const alphabet = 'ABCDEFGHIJKLMNROPQRSTUVWXYZabcdefghijklmnropqrstuvwxyz0123456789';

// variables
var horizontalPercentageOffset = 0; // default L
var fontSizeRange = [20, 50];
var speed = 0;
var textColor = "#000000";
var elemType = 'A';
var slideDirection = 'L';

// on load: grootte slider
document.addEventListener('DOMContentLoaded', function (event) {
  var slider = document.getElementById('grootte');
  noUiSlider.create(slider, {
    start: fontSizeRange,
    connect: true,
    range: {
      'min': 10,
      'max': 80
    },
    step: 5
  });
  // grootte
  slider.noUiSlider.on('change', function (values) {
    fontSizeRange = [parseInt(values[0]), parseInt(values[1])];
    console.log("New font size range", fontSizeRange);
    changeElement();
  });
});

// sidebar open-close
document.getElementById('openclose').addEventListener('click', function () {
  document.getElementById('sidebar').classList.toggle("sidebar-closed");
});

// oog: L(eft)/R(ight)
document.getElementById('oog').addEventListener('change', function () {
  switch (document.getElementById('oog').value) {
    case 'L':
      horizontalPercentageOffset = 0;
      console.log("Left eye");
      break;
    case 'R':
      horizontalPercentageOffset = 0.5;
      console.log("Right eye");
      break;
  }
});

// inhoud: A(lphabetic)/S(hort)/L(ong)
document.getElementById('inhoud').addEventListener('change', function () {
  elemType = document.getElementById('inhoud').value;
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

// snelheid
document.getElementById('snelheid').addEventListener('change', function () {
  speed = document.getElementById('snelheid').value;
});

// richting: L(eft), R(ight), D(own), U(p), A(ll)
document.getElementById('richting').addEventListener('change', function () {
  slideDirection = document.getElementById('richting').value;
});

// start
document.getElementById('start').addEventListener('click', function () {
  // TODO start animation
  // temporary
  changeElement();
});

// stop
document.getElementById('stop').addEventListener('click', function () {
  // TODO stop animation
});

function changeElement() {
  var elem = document.getElementById('element');
  let playGroundElem = document.getElementById('playground');

  var randomFontSize = fontSizeRange[0] + Math.floor(Math.random() * (fontSizeRange[1] - fontSizeRange[0]));

  // 0-99% afhankelijk van oog
  var randomPctX = horizontalPercentageOffset + (Math.random() * 0.5);
  var randomX = Math.floor(randomPctX * playGroundElem.clientWidth);

  // 0-99% hoogte
  var randomPctY = Math.random();
  var randomY = Math.floor(randomPctY * playGroundElem.clientHeight);
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
      element.innerText = "Kort";
      break;
    case 'L':
      element.innerText = "Hottentottententententoonstelling";
      break;
  }
}
