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
