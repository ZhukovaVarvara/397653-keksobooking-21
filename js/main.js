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
const MAX_ROOMS_VALUE = 100;
const MIN_CAPACITY_VALUE = 0;
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
const mapFilter = document.querySelector(`.map__filters-container`);
const similarMapCardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
let pins = [];

const disableFields = function () {
  for (let formElement of formElements) {
    formElement.setAttribute(`disabled`, true);
  }
  for (let formFilter of formFilters) {
    formFilter.setAttribute(`disabled`, true);
  }
  formHeader.setAttribute(`disabled`, true);
  formFeatures.setAttribute(`disabled`, true);
};
disableFields();

const setAddressValue = function () {
  const leftPosition = parseInt(mainPin.style.left, 10);
  const topPosition = parseInt(mainPin.style.top, 10);
  const addressValuLeft = leftPosition + (mainPinWidth / 2);
  const addressValuTop = topPosition + (mainPinHeight / 2);
  addressField.value = `${addressValuLeft}, ${addressValuTop}`;
};

mainPin.addEventListener(`mousedown`, function (evt) {
  if (evt.button === 0) {
    activatePage();
  }
});

mainPin.addEventListener(`keydown`, function (evt) {
  if (evt.key === `Enter`) {
    activatePage();
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
  for (let i = 1; i < randomArrayLength; i++) {
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

const onChangeCapacityValidity = function () {
  let roomNumberValue = Number(roomNumber.value);
  let capacityValue = Number(capacity.value);
  if (roomNumberValue === MAX_ROOMS_VALUE && capacityValue !== MIN_CAPACITY_VALUE || roomNumberValue !== MAX_ROOMS_VALUE && capacityValue === MIN_CAPACITY_VALUE) {
    capacity.setCustomValidity(`100 комнат - не для гостей`);
  } else if (roomNumberValue < capacityValue) {
    capacity.setCustomValidity(`Количество гостей не может быть больше количества комнат`);
  } else {
    capacity.setCustomValidity(``);
  }
};

roomNumber.addEventListener(`change`, onChangeCapacityValidity);
capacity.addEventListener(`change`, onChangeCapacityValidity);

const init = function () {
  setAddressValue();
  for (let formElement of formElements) {
    formElement.removeAttribute(`disabled`);
  }
  for (let formFilter of formFilters) {
    formFilter.removeAttribute(`disabled`);
  }
  formHeader.removeAttribute(`disabled`);
  formFeatures.removeAttribute(`disabled`);
};

const activatePage = function () {
  map.classList.remove(`map--faded`);
  form.classList.remove(`ad-form--disabled`);
  generateElements();
  init();
};
map.classList.remove(`map--faded`);
generateElements();

let firstElement = pins[0];

const mapOfferType = {
  'bungalow': `Бунгало`,
  'flat': `Квартира`,
  'house': `Дом`,
  'palace': `Дворец`
};

const createFeatures = function (features) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < features.length; i++) {
    const popupFeature = document.createElement(`li`);
    popupFeature.classList.add(`popup__feature`);
    popupFeature.classList.add(`popup__feature--` + features[i]);
    fragment.appendChild(popupFeature);
  }
  return fragment;
};

const createPhotos = function (photos) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < photos.length; i++) {
    const popupPhoto = document.createElement(`img`);
    popupPhoto.src = photos[i];
    popupPhoto.classList.add(`popup__photo`);
    popupPhoto.setAttribute(`width`, `45`);
    popupPhoto.setAttribute(`height`, `40`);
    popupPhoto.setAttribute(`alt`, `Фотография жилья`);
    fragment.appendChild(popupPhoto);
  }
  return fragment;
};

const renderCard = function (card) {
  const cardElement = similarMapCardTemplate.cloneNode(true);

  cardElement.querySelector(`.popup__features`).innerHTML = ``;
  if (card.offer.features.length) {
    cardElement.querySelector(`.popup__features`).appendChild(createFeatures(card.offer.features));
  }
  cardElement.querySelector(`.popup__photos`).innerHTML = ``;
  if (card.offer.photos.length) {
    cardElement.querySelector(`.popup__photos`).appendChild(createPhotos(card.offer.photos));
  }
  cardElement.querySelector(`.popup__title`).textContent = card.offer.title;
  cardElement.querySelector(`.popup__text--address`).textContent = card.offer.address;
  cardElement.querySelector(`.popup__text--price`).textContent = card.offer.price + `₽/ночь`;
  cardElement.querySelector(`.popup__type`).textContent = mapOfferType[card.offer.type];
  cardElement.querySelector(`.popup__text--capacity`).textContent = card.offer.rooms + ` комнаты для ` + card.offer.guests + ` гостей`;
  cardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ` + card.offer.checkin + `, выезд до ` + card.offer.checkout;
  cardElement.querySelector(`.popup__description`).textContent = card.offer.description;
  cardElement.querySelector(`.popup__avatar`).src = card.author.avatar;

  return cardElement;
};

const generateCards = function () {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(renderCard(firstElement));
  map.insertBefore(fragment, mapFilter);
};
generateCards();
