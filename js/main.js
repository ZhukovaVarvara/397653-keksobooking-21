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
const mapFilter = document.querySelector(`.map__filters-container`);
const mapWidth = map.offsetWidth;
const similarPinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
const similarListElement = document.querySelector(`.map__pins`);
const similarMapCardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
let pins = [];
let offerType;

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

map.classList.remove(`map--faded`);
generateElements();

let firstElement = pins[0];

const getOfferType = function () {
  if (firstElement.offer.type === `palace`) {
    offerType = `Дворец`;
    return offerType;
  } else if (firstElement.offer.type === `house`) {
    offerType = `Дом`;
    return offerType;
  } else if (firstElement.offer.type === `bungalow`) {
    offerType = `Бунгало`;
    return offerType;
  } else {
    offerType = `Квартира`;
    return offerType;
  }
};

const renderFeatures = function () {
  const popupFeature = document.createElement(`li`);
  popupFeature.classList.add(`popup__feature`);
  return popupFeature;
};

const generateFeatures = function () {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < firstElement.offer.features.length; i++) {
    fragment.appendChild(renderFeatures());
  }
  similarListElement.appendChild(fragment);
};
generateFeatures();

const renderCard = function () {
  const cardElement = similarMapCardTemplate.cloneNode(true);

  cardElement.querySelector(`.popup__features`).innerHTML = ``;
  cardElement.querySelector(`.popup__title`).textContent = firstElement.offer.title;
  cardElement.querySelector(`.popup__text--address`).textContent = firstElement.offer.address;
  cardElement.querySelector(`.popup__text--price`).textContent = firstElement.offer.price + `₽/ночь`;
  cardElement.querySelector(`.popup__type`).textContent = getOfferType();
  cardElement.querySelector(`.popup__text--capacity`).textContent = firstElement.offer.rooms + ` комнаты для ` + firstElement.offer.guests + ` гостей`;
  cardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ` + firstElement.offer.checkin + `, выезд до ` + firstElement.offer.checkout;
  cardElement.querySelector(`.popup__description`).textContent = firstElement.offer.description;
  cardElement.querySelector(`.popup__avatar`).src = firstElement.author.avatar;

  if (firstElement.offer.photos.length === 1) {
    cardElement.querySelector(`.popup__photos img`).src = firstElement.offer.photos[0];
  } else if (firstElement.offer.photos.length === 0) {
    cardElement.querySelector(`.popup__photos`).remove();
  } else {
    let photosLength = firstElement.offer.photos.length;
    let photoElement = cardElement.querySelector(`.popup__photos img`).cloneNode(true);
    let photos = cardElement.querySelector(`.popup__photos`);
    cardElement.querySelector(`.popup__photos img`).src = firstElement.offer.photos[0];
    for (let i = 1; i < photosLength; i++) {
      photoElement.src = firstElement.offer.photos[i];
      photos.appendChild(photoElement);
    }
  }

  for (let i = 0; i < firstElement.offer.features.length; i++) {
    const popupFeature = document.createElement(`li`);
    popupFeature.classList.add(`popup__feature`);
    popupFeature.classList.add(`popup__feature--` + firstElement.offer.features[i]);
    cardElement.querySelector(`.popup__features`).appendChild(popupFeature);
  }

  return cardElement;
};

const generateCards = function () {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(renderCard());
  map.insertBefore(fragment, mapFilter);
};
generateCards();
