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

      position = 0;

      setPosition();
      checkButtons();
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
