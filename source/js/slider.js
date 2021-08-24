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
    let slideWidth = 0;
    let movePosition = 0;

    if (window.matchMedia(`(max-width: ${TABLET_MAX_WIDTH}px)`).matches) {
      slidesShownQuantity = tabletShownQuantity;
      sliderStep = tabletStep;
    }

    if (window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches) {
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

    if (sliderButtonPrev) {
      sliderButtonPrev.addEventListener('click', () => {
        const slidesLeft = Math.abs(position) / slideWidth;

        position += slidesLeft >= sliderStep ? movePosition : slidesLeft * slideWidth;

        setPosition();
        checkButtons();
      });
    }

    if (sliderButtonNext) {
      sliderButtonNext.addEventListener('click', () => {
        const slidesLeft = slides.length - (Math.abs(position) + slidesShownQuantity * slideWidth) / slideWidth;

        position -= slidesLeft >= sliderStep ? movePosition : slidesLeft * slideWidth;

        setPosition();
        checkButtons();
      });
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

    const reinitSlider = (shownQuantity, step = shownQuantity) => {
      slidesShownQuantity = shownQuantity;
      sliderStep = step;

      if (slidesContainer) {
        slideWidth = Math.floor((slidesContainer.clientWidth + parseFloat(getComputedStyle(slides[0]).marginRight)) / slidesShownQuantity);
        movePosition = sliderStep * slideWidth;
      }
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
