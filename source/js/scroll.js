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
