'use strict';

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
