(function () {
  const PHONE_LENGTH = 18;

  const form = document.querySelector('.free-workout-form');
  const formPhones = form.querySelectorAll('.form-phone-field input');

  function maskPhone(selector, masked = '+7 (___) ___-__-__') {
    const elems = document.querySelectorAll(selector);

    function mask(event) {
      const keyCode = event.keyCode;
      const template = masked;
      const def = template.replace(/\D/g, '');
      const val = this.value.replace(/\D/g, '');

      let i = 0;
      let newValue = template.replace(/[_\d]/g, function (a) {
        return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
      });

      i = newValue.indexOf('_');

      if (i !== -1) {
        newValue = newValue.slice(0, i);
      }

      let reg = template.substr(0, this.value.length).replace(/_+/g, function (a) {
        return '\\d{1,' + a.length + '}';
      }).replace(/[+()]/g, '\\$&');

      reg = new RegExp('^' + reg + '$');

      if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
        this.value = newValue;
      }

      if (event.type === 'blur' && this.value.length < 5) {
        this.value = '';
      }
    }

    for (const elem of elems) {
      elem.addEventListener('input', mask);
      elem.addEventListener('focus', mask);
      elem.addEventListener('blur', mask);
    }
  }

  maskPhone('.form-phone-field input');

  function checkPhoneLength(phoneField) {
    if (phoneField.value.length < PHONE_LENGTH) {
      phoneField.setCustomValidity('+7 (XXX) XXX XX XX');
    } else {
      phoneField.setCustomValidity('');
    }

    phoneField.reportValidity();
  }

  if (formPhones) {
    formPhones.forEach(function (item) {
      item.addEventListener('input', function () {
        checkPhoneLength(item);
      });
    });
  }
})();

'use strict';

(function () {
  document.body.classList.add('js');
})();

(function () {
  const seasonTicketsScroll = document.querySelector('.promo__button');
  const seasonTickets = document.querySelector('#season-tickets');

  function scrollTo(element) {
    window.scroll({
      left: 0,
      top: element.offsetTop,
      behavior: 'smooth',
    });
  }

  if (seasonTicketsScroll && seasonTickets) {
    seasonTicketsScroll.addEventListener('click', function (evt) {
      evt.preventDefault();
      scrollTo(seasonTickets);
    });
  }
})();

(function () {
  const TABLET_MIN_WIDTH = 768;
  const TABLET_MAX_WIDTH = 1199;
  const MOBILE_MAX_WIDTH = 767;
  const TOUCH_TRACK = 50;

  const sliders = document.querySelectorAll('.slider');

  const initSlider = (slider, desktopShownQuantity = 1, tabletShownQuantity = 1, mobileShownQuantity = 1, desktopStep = desktopShownQuantity, tabletStep = tabletShownQuantity, mobileStep = mobileShownQuantity) => {
    const slidesContainer = slider.querySelector('.slider__wrapper');
    const sliderTrack = slider.querySelector('.slider__list');
    const slides = slider.querySelectorAll('.slider__item');
    const sliderButtonsContainer = slider.querySelector('.slider__buttons-wrapper');
    const sliderButtonPrev = slider.querySelector('.slider__button--prev');
    const sliderButtonNext = slider.querySelector('.slider__button--next');

    let position = 0;
    let slidesShownQuantity = desktopShownQuantity;
    let sliderStep = desktopStep;
    let slideWidth = 0;
    let movePosition = 0;

    if (window.outerWidth >= TABLET_MIN_WIDTH && window.outerWidth <= TABLET_MAX_WIDTH) {
      slidesShownQuantity = tabletShownQuantity;
      sliderStep = tabletStep;
    }

    if (window.outerWidth <= MOBILE_MAX_WIDTH) {
      slidesShownQuantity = mobileShownQuantity;
      sliderStep = mobileStep;
    }

    if (slidesContainer) {
      slideWidth = Math.floor((slidesContainer.clientWidth + parseFloat(getComputedStyle(slides[0]).marginRight)) / slidesShownQuantity);
      movePosition = sliderStep * slideWidth;
    }

    if (sliderButtonsContainer) {
      sliderButtonsContainer.classList.remove('slider__buttons-wrapper--hidden');
    }

    const onButtonPrevClick = () => {
      const slidesLeft = Math.abs(position) / slideWidth;

      position += slidesLeft >= sliderStep ? movePosition : slidesLeft * slideWidth;

      setPosition();
      checkButtons();
    }

    const onButtonNextClick = () => {
      const slidesLeft = slides.length - (Math.abs(position) + slidesShownQuantity * slideWidth) / slideWidth;

      position -= slidesLeft >= sliderStep ? movePosition : slidesLeft * slideWidth;

      setPosition();
      checkButtons();
    }

    if (sliderButtonPrev) {
      sliderButtonPrev.addEventListener('click', onButtonPrevClick);
    }

    if (sliderButtonNext) {
      sliderButtonNext.addEventListener('click', onButtonNextClick);
    }

    const setPosition = () => {
      if (sliderTrack) {
        sliderTrack.style.transform = `translateX(${position}px)`;
      }
    };

    const checkButtons = () => {
      if (sliderButtonPrev && sliderButtonNext) {
        sliderButtonPrev.disabled = position === 0;
        sliderButtonNext.disabled = position <= -(slides.length - slidesShownQuantity) * slideWidth;
      }
    };

    checkButtons();

    const swipeSlider = () => {
      sliderTrack.addEventListener('touchstart', function (evt) {
        let startCoords = evt.changedTouches[0].clientX;
        let endCoords = evt.changedTouches[0].clientX;

        const onMouseMove =(moveEvt) => {
          endCoords = moveEvt.changedTouches[0].clientX;
        };

        const onMouseUp = (upEvt) => {
          upEvt.preventDefault();
          slidesContainer.removeEventListener('touchmove', onMouseMove);
          slidesContainer.removeEventListener('touchend', onMouseUp);
          let shift = startCoords - endCoords;

          if (Math.abs(shift) > TOUCH_TRACK) {
            if (shift > 0) {
              onButtonNextClick();
            } else {
              onButtonPrevClick();
            }
          }
        };

        slidesContainer.addEventListener('touchmove', onMouseMove);
        slidesContainer.addEventListener('touchend', onMouseUp);
        sliderButtonPrev.addEventListener('touchstart', onButtonPrevClick);
        sliderButtonNext.addEventListener('touchstart', onButtonNextClick);
      });
    }

    if (window.outerWidth >= TABLET_MIN_WIDTH && window.outerWidth <= TABLET_MAX_WIDTH) {
      swipeSlider();
    }

    if (window.outerWidth <= MOBILE_MAX_WIDTH) {
      swipeSlider();
    }

    const reinitSlider = (shownQuantity, step = shownQuantity) => {
      slidesShownQuantity = shownQuantity;
      sliderStep = step;

      if (slidesContainer) {
        slideWidth = Math.floor((slidesContainer.clientWidth + parseFloat(getComputedStyle(slides[0]).marginRight)) / slidesShownQuantity);
        movePosition = sliderStep * slideWidth;
      }
    }

    function onWindowResize() {
      if (window.outerWidth >= TABLET_MIN_WIDTH && window.outerWidth <= TABLET_MAX_WIDTH) {
        reinitSlider(tabletShownQuantity);
      }

      if (window.outerWidth <= MOBILE_MAX_WIDTH) {
        reinitSlider(mobileShownQuantity);
      }

      if (window.outerWidth > TABLET_MAX_WIDTH) {
        reinitSlider(desktopShownQuantity);
      }
    }

    window.addEventListener('resize', onWindowResize);
  }

  sliders.forEach((item) => {
    if (item.classList.contains('slider--four-two-one')) {
      initSlider(item, 4, 2, 1);
    } else {
      initSlider(item);
    }
  });
})();

(function () {
  const seasonTicketsTabsContainer = document.querySelector('.season-tickets__tabs');
  const seasonTicketsTabSwitchersContainer = seasonTicketsTabsContainer.querySelector('.season-tickets__tab-switchers');
  const seasonTicketsTabSwitchers = seasonTicketsTabSwitchersContainer.querySelectorAll('.season-tickets__tab-switcher');
  const seasonTicketsTabData = seasonTicketsTabsContainer.querySelectorAll('.season-tickets__offers');

  const seasonTicketHeadingPeriods = seasonTicketsTabsContainer.querySelectorAll('h3 span');

  if (seasonTicketsTabSwitchersContainer) {
    seasonTicketsTabSwitchersContainer.classList.add('season-tickets__tab-switchers--shown');
  }

  if (seasonTicketHeadingPeriods) {
    seasonTicketHeadingPeriods.forEach((item) => {
      item.classList.add('visually-hidden');
    });
  }

  if (seasonTicketsTabData) {
    seasonTicketsTabData.forEach((item, index) => {
      if (!seasonTicketsTabSwitchers[index].classList.contains('season-tickets__tab-switcher--active')) {
        item.classList.add('season-tickets__offers--hidden');
      }
    });
  }

  const switchTab = (evt, tabSwitchers, switcherStyleClass, activeSwitcherStyleClass, tabData, activeTabInfoStyleClass, hiddenTabInfoStyleClass) => {
    const clickedSwitcherIndex = Array.from(tabSwitchers).indexOf(evt.target);

    if (evt.target.classList.contains(switcherStyleClass) && !evt.target.classList.contains(activeSwitcherStyleClass)) {
      for (let i = 0; i < tabSwitchers.length; i++) {
        if (tabSwitchers[i].classList.contains(activeSwitcherStyleClass)) {
          tabSwitchers[i].classList.remove(activeSwitcherStyleClass);
          tabSwitchers[i].removeAttribute('tabindex');
          break;
        }
      }

      evt.target.classList.add(activeSwitcherStyleClass);
      evt.target.setAttribute('tabindex', '-1');

      for (let i = 0; i < tabData.length; i++) {
        if (tabData[i].classList.contains(activeTabInfoStyleClass)) {
          tabData[i].classList.remove(activeTabInfoStyleClass);
          tabData[i].classList.add(hiddenTabInfoStyleClass);
          break;
        }
      }

      tabData[clickedSwitcherIndex].classList.add(activeTabInfoStyleClass);
      tabData[clickedSwitcherIndex].classList.remove(hiddenTabInfoStyleClass);
    }
  };

  if (seasonTicketsTabSwitchersContainer && seasonTicketsTabSwitchers && seasonTicketsTabData) {
    seasonTicketsTabSwitchersContainer.addEventListener('click', function (evt) {
      switchTab(evt, seasonTicketsTabSwitchers, 'season-tickets__tab-switcher', 'season-tickets__tab-switcher--active', seasonTicketsTabData, 'season-tickets__offers--active', 'season-tickets__offers--hidden');
    });
  }
})();

(function () {
  const gymVideoContainer = document.querySelector('.gym__video');
  const gymVideoPlayer = gymVideoContainer.querySelector('video');
  const gymVideoLink = gymVideoContainer.querySelector('.gym__video-link');

  if (gymVideoPlayer && gymVideoLink) {
    gymVideoLink.addEventListener('click', function (evt) {
      evt.preventDefault();
      gymVideoLink.classList.add('gym__video-link--hidden');
      gymVideoPlayer.play();
    });

    gymVideoPlayer.addEventListener('ended', function () {
      gymVideoLink.classList.remove('gym__video-link--hidden');
    });
  }
})();
