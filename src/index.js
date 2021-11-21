import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const boxInput = document.querySelector('[id="search-box"]');
const containerInfo = document.querySelector('.country-info');
const listContainer = document.querySelector('.country-list');

function showCountry() {
  fetchCountries(boxInput.value.trim())
    .then(country => {
      containerInfo.innerHTML = '';
      listContainer.innerHTML = '';

      if (country.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
      } else if (country.length >= 2 && country.length <= 10) {
        listCountry(country);
      } else if (country.length === 1) {
        infoCountry(country);
      }
    })
    .catch(showError);
}

function listCountry(country) {
  const markup = country
    .map(({ flags, name }) => {
      return `<li class="country-list"> 
      <img class="flag-list" src ="${flags.svg}" alt="Flag of ${name.common}"  width="50"/>
      <span class = "name-list">${name.common}</span></li>`;
    })
    .join('');
  listContainer.innerHTML = markup;
}

function infoCountry([{ name, flags, capital, population, languages }]) {
  containerInfo.innerHTML = `<img src ="${flags.svg}" class="flags"  alt="Flag of ${
    name.official
  }" width="50"/>
         <span class="country-name">${name.official}</span>
       <p class = "info"> Capital: <span class = "info-span">${capital}</span></p>
       <p class = "info"> Population: <span class = "info-span">${population}</span></p>
       <p class = "info"> Languages: <span class = "info-span">${Object.values(languages).join(
         ', ',
       )}
        </span></p>`;
}

function showError(error) {
  Notify.failure('Oops, there is no country with that name');
  containerInfo.innerHTML = '';
  listContainer.innerHTML = '';
}

boxInput.addEventListener('input', debounce(showCountry, DEBOUNCE_DELAY));
