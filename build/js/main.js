'use strict';

(function () {
  document.body.classList.add('js');
})();

(function () {
  const TABLET_MAX_WIDTH = 1199;
  const MOBILE_MAX_WIDTH = 767;

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

    if (window.matchMedia(`(max-width: ${TABLET_MAX_WIDTH}px)`).matches) {
      slidesShownQuantity = tabletShownQuantity;
      sliderStep = tabletStep;
    }

    if (window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches) {
      slidesShownQuantity = mobileShownQuantity;
      sliderStep = mobileStep;
    }

    let slideWidth = Math.floor((slidesContainer.clientWidth + parseFloat(getComputedStyle(slides[0]).marginRight)) / slidesShownQuantity);
    let movePosition = sliderStep * slideWidth;

    sliderButtonsContainer.classList.remove('slider__buttons-wrapper--hidden');

    sliderButtonPrev.addEventListener('click', () => {
      const slidesLeft = Math.abs(position) / slideWidth;

      position += slidesLeft >= sliderStep ? movePosition : slidesLeft * slideWidth;

      setPosition();
      checkButtons();
    });

    sliderButtonNext.addEventListener('click', () => {
      const slidesLeft = slides.length - (Math.abs(position) + slidesShownQuantity * slideWidth) / slideWidth;

      position -= slidesLeft >= sliderStep ? movePosition : slidesLeft * slideWidth;

      setPosition();
      checkButtons();
    });

    const setPosition = () => {
      sliderTrack.style.transform = `translateX(${position}px)`;
    };

    const checkButtons = () => {
      sliderButtonPrev.disabled = position === 0;
      sliderButtonNext.disabled = position <= -(slides.length - slidesShownQuantity) * slideWidth;
    };

    checkButtons();

    const reinitSlider = (shownQuantity, step = shownQuantity) => {
      slidesShownQuantity = shownQuantity;
      sliderStep = step;
      slideWidth = Math.floor((slidesContainer.clientWidth + parseFloat(getComputedStyle(slides[0]).marginRight)) / slidesShownQuantity);
      movePosition = sliderStep * slideWidth;
    }

    function onWindowResize() {
      if (window.outerWidth <= TABLET_MAX_WIDTH) {
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

  gymVideoLink.addEventListener('click', function(evt) {
    evt.preventDefault();
    gymVideoLink.classList.add('gym__video-link--hidden');
    gymVideoPlayer.play();
  });

  gymVideoPlayer.addEventListener('ended', function() {
    gymVideoLink.classList.remove('gym__video-link--hidden');
  });
})();
