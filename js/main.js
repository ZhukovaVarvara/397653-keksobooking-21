'use strict';

const TYPES = [`palace`, `flat`, `house`, `bungalow`];
const CHECKINS = [`12:00`, `13:00`, `14:00`];
const CHECKOUTS = [`12:00`, `13:00`, `14:00`];
const FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const AVATAR = `img/avatars/user0`;
const AVATAR_TYPE = `.png`;
const PHOTO = `http://o0.github.io/assets/images/tokyo/hotel`;
const PHOTO_TYPE = `.jpg`;
const MAX_PHOTOS = 3;
const MIN_Y = 130;
const MAX_Y = 630;
const MAX_PINS = 8;
const MIN_ROOMS = 1;
const MAX_ROOMS = 3;
const MIN_GUESTS = 1;
const MAX_GUESTS = 3;
const PIN_WIDTH = 50;
const MIN_PRICE = 0;
const MAX_PRICE = 1000000;
const map = document.querySelector(`.map`);
const mapWidth = map.offsetWidth;
const similarPinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
const similarListElement = document.querySelector(`.map__pins`);
let pins = [];

const randomInteger = function (min, max) {
  let randomNumber = min + Math.random() * (max + 1 - min);
  return Math.floor(randomNumber);
};

const randomArrayItem = function (array) {
  const randomIndex = randomInteger(0, array.length);
  return array[randomIndex];
};

const randomFeatureArray = function (feature) {
  let randomArrayLength = randomInteger(0, feature.length);
  let featureArray = [];
  for (let i = 0; i < randomArrayLength; i++) {
    featureArray.push(feature[i]);
  }
  return featureArray;
};

const randomPhotosArray = function () {
  let randomArrayLength = randomInteger(0, MAX_PHOTOS);
  let photosArray = [];
  for (let i = 0; i < randomArrayLength; i++) {
    photosArray.push(PHOTO + i + PHOTO_TYPE);
  }
  return photosArray;
};

const generatePinsArray = function () {
  const pinArray = [];

  for (let i = 0; i < MAX_PINS; i++) {
    let avatarIndex = i + 1;
    let pinLocation = {
      x: randomInteger(0, mapWidth - PIN_WIDTH),
      y: randomInteger(MIN_Y, MAX_Y),
    };
    const pinItem = {
      'author': {
        'avatar': AVATAR + avatarIndex + AVATAR_TYPE,
      },
      'offer': {
        'title': `Заголовок`,
        'address': pinLocation.x + `, ` + pinLocation.y,
        'price': randomInteger(MIN_PRICE, MAX_PRICE),
        'type': randomArrayItem(TYPES),
        'rooms': randomInteger(MIN_ROOMS, MAX_ROOMS),
        'guests': randomInteger(MIN_GUESTS, MAX_GUESTS),
        'checkin': randomArrayItem(CHECKINS),
        'checkout': randomArrayItem(CHECKOUTS),
        'features': randomFeatureArray(FEATURES),
        'description': `Описание`,
        'photos': randomPhotosArray(),
      },
      'location': {
        'x': pinLocation.x,
        'y': pinLocation.y,
      }
    };
    pinArray.push(pinItem);
  }
  return pinArray;
};

pins = generatePinsArray();

const renderPin = function (pin) {
  const pinElement = similarPinTemplate.cloneNode(true);
  const pinHalfWidth = pinElement.offsetWidth / 2;
  const pinHeight = pinElement.offsetHeight;

  pinElement.style.left = (pin.location.x - pinHalfWidth) + `px`;
  pinElement.style.top = (pin.location.y - pinHeight) + `px`;

  pinElement.querySelector(`.map__pin img`).src = pin.author.avatar;
  pinElement.querySelector(`.map__pin img`).alt = pin.offer.title;

  return pinElement;
};

const generateElements = function () {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < pins.length; i++) {
    fragment.appendChild(renderPin(pins[i]));
  }
  similarListElement.appendChild(fragment);
};

map.classList.remove(`map--faded`);
generateElements();
