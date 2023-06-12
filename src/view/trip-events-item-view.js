import AbstractView from '../framework/view/abstract-view.js';
import { humanizeDate } from '../utils/common.js';

function createTemplate(point, tripDestinations, allOffers) {
  const { basePrice, destination, type, offers, dateFrom, dateTo } = point;

  const destinationInfo = tripDestinations.find((item) => item.id === destination);
  const offersType = allOffers.find((offer) => offer.type === type);
  const checkedOffers = offersType.offers.filter((offer) => offers.includes(offer.id));

  function createOffersListTemplate() {
    if (checkedOffers.length === 0) {

      return (
        `<li class="event__offer">
          <span class="event__offer-title">No additional offers</span>
        </li>`
      );
    }

    return checkedOffers.map((offer) =>
      `<li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </li>`).join('');
  }

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom.toISOString()}">${humanizeDate(dateFrom, 'MMM DD')}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destinationInfo.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom.toISOString()}">${humanizeDate(dateFrom, 'HH:mm')}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateFrom.toISOString()}">${humanizeDate(dateTo, 'HH:mm')}</time>
          </p>
          <p class="event__duration">30M</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createOffersListTemplate()}
        </ul>
        <button class="event__favorite-btn event__favorite-btn--active" type="button">
          <span class="visually-hidden">Add to favorite</span>
             <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
              </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class TripEventsItemView extends AbstractView {
  #point = null;
  #tripDestinations = null;
  #allOffers = null;
  #handleEventRollupClick = null;

  constructor({ point, tripDestinations, allOffers, onEventRollupClick }) {
    super();
    this.#point = point;
    this.#tripDestinations = tripDestinations;
    this.#allOffers = allOffers;
    this.#handleEventRollupClick = onEventRollupClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#eventRollupClickHandler);
  }

  get template() {
    return createTemplate(this.#point, this.#tripDestinations, this.#allOffers);
  }

  #eventRollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEventRollupClick();
  };
}
