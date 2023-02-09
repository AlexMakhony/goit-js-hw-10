// Import library and styles
import './css/styles.css';
// Fetch & promise function
import { fetchCountries } from './fetchCountries';
// Alarm Library
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// Debounce Library
import debounce from 'lodash.debounce';

// Look our El
const input = document.getElementById('search-box');
const list = document.getElementById('country-list');
const info = document.getElementById('country-info');
const DEBOUNCE_DELAY = 300;

// Bring a listener for input
input.addEventListener('input', debounce(SearchCountry, DEBOUNCE_DELAY));

// Create search country function
function SearchCountry (e) {
    // Kill default parametrs
    e.preventDefault();
    // Take target ingo + use trim
    const infoFromInput = e.target.value.trim();
    if (!infoFromInput) {
        list.innerHTML = ``;
        info.innerHTML = ``;
        return;
    }
    // Input + promise from API
    fetchCountries(infoFromInput)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      renderMarkup(data);
    })
    .catch(err => {
      list.innerHTML = '';
      info.innerHTML = '';
      Notify.failure('Oops, there is no country with that name');
    });
}

// After that we make markUp for our 1 country info
const renderMarkup = data => {
    if (data.length === 1) {
        list.innerHTML = '';
        info.innerHTML = `
        <li class="country-item">
            <img class="country-flag" src="${data[0].flags.svg}" alt="flag"/>
            <h2 class="country-name">Country name: ${data[0].name.common}</h2>
            <h3 class="country-capital">Capital: <span>${data[0].capital[0]}</span></h3>
            <p class="country-population">Population: <span>${data[0].population}</span></p>
            <p class="country-language">Languages: <span>${Object.values(data[0].languages).toString().split(",").join(", ")}</span></p>
        </li>
             `;
    } else {
        info.innerHTML = '';
      const markupList = renderListMarkup(data);
      list.innerHTML = markupList;
    }
  };

//   Make a list markUp, when we have more than 1 country in list
const renderListMarkup = data => {
    return data
      .map(
        ({ name, flags }) =>
          `<li class="list"><img class="flag-list" src="${flags.svg}" alt="${name.official}">${name.official}</li>`
      )
      .join('');
  };