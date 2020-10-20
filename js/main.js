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
const form = document.querySelector(`.ad-form`);
const mapWidth = map.offsetWidth;
const similarPinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
const similarListElement = document.querySelector(`.map__pins`);
const mainPin = document.querySelector(`.map__pin--main`);
const mainPinWidth = mainPin.offsetWidth;
const mainPinHeight = mainPin.offsetHeight;
const formElements = document.querySelectorAll(`.ad-form__element`);
const formHeader = document.querySelector(`.ad-form-header`);
const formFilters = document.querySelectorAll(`.map__filter`);
const formFeatures = document.querySelector(`.map__features`);
const addressField = document.querySelector(`#address`);
const roomNumber = document.querySelector(`#room_number`);
const capacity = document.querySelector(`#capacity`);
let pins = [];

const getAddressValue = function () {
  const leftPosition = parseInt(mainPin.style.left, 10);
  const topPosition = parseInt(mainPin.style.top, 10);
  const addressValuLeft = leftPosition + (mainPinWidth / 2);
  const addressValuTop = topPosition + (mainPinHeight / 2);
  addressField.value = addressValuLeft + `, ` + addressValuTop;
};
getAddressValue();

const disableFields = function () {
  for (let formElement of formElements) {
    formElement.setAttribute(`disabled`, `disabled`);
  }
  for (let formFilter of formFilters) {
    formFilter.setAttribute(`disabled`, `disabled`);
  }
  formHeader.setAttribute(`disabled`, `disabled`);
  formFeatures.setAttribute(`disabled`, `disabled`);
};
disableFields();

const activatePage = function () {
  map.classList.remove(`map--faded`);
  form.classList.remove(`ad-form--disabled`);

  for (let formElement of formElements) {
    formElement.removeAttribute(`disabled`, `disabled`);
  }
  for (let formFilter of formFilters) {
    formFilter.removeAttribute(`disabled`, `disabled`);
  }
  formHeader.removeAttribute(`disabled`, `disabled`);
  formFeatures.removeAttribute(`disabled`, `disabled`);
};

mainPin.addEventListener(`mousedown`, function (evt) {
  if (evt.which === 1) {
    activatePage();
  }
});

mainPin.addEventListener(`keydown`, function (evt) {
  if (evt.key === `Enter`) {
    activatePage();
  }
});

capacity.addEventListener(`change`, function () {
  if (roomNumber.value === 1 && capacity.value === 2) {
    capacity.setCustomValidity(`Обязательное поле`);
  }
});

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

generateElements();
