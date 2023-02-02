import { getPhoto, getCardsEl } from './responce.js'

import 'notiflix/dist/notiflix-3.2.6.min.css';
import Notiflix from 'notiflix';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

function scroll() {
  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}


const btn = document.querySelector(".search-form");
const input = btn.querySelector('input');
const galleryEl = document.querySelector(".gallery");
let page = 1;
let currentInputValue = "";
let totalHits = 0;

var lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });
const btnNext = document.getElementById("next");


btnNext.style.display = "none";


btnNext.addEventListener("click", () => {
  if (totalHits - 40 * page >= 0) {
    getPhoto(`/?key=33196747-24bc99861df4a38dc77aa0518`, currentInputValue, page).then((rezultRequest) => {

      console.log(rezultRequest);
      galleryEl.insertAdjacentHTML('beforeend', getCardsEl(rezultRequest.hits));
      lightbox.refresh();
      scroll();
    })
  }
  else {

    getPhoto(`/?key=33196747-24bc99861df4a38dc77aa0518`, currentInputValue, page, 40 + (totalHits - 40 * page)).then((rezultRequest) => {
      console.log(rezultRequest);
      galleryEl.insertAdjacentHTML('beforeend', getCardsEl(rezultRequest.hits));
      lightbox.refresh();
      scroll();
      btnNext.style.display = "none";
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    })
  }


  ++page;
});

btn.addEventListener("submit", (event) => {
  event.preventDefault();
  page = 1;
  totalHits = 0;
  btnNext.style.display = "none";
  if (input.value.trim() === "") return;
  getPhoto(`/?key=33196747-24bc99861df4a38dc77aa0518`, input.value.trim(), page).then((rezultRequest) => {
    currentInputValue = input.value.trim();
    if (galleryEl.innerHTML === "") {
      galleryEl.insertAdjacentHTML('beforeend', getCardsEl(rezultRequest.hits));
      console.log(rezultRequest);
      lightbox.refresh();
    }
    else {
      galleryEl.innerHTML = getCardsEl(rezultRequest.hits);
      console.log(rezultRequest);
      lightbox.refresh();

    }

    totalHits = Number(rezultRequest.totalHits);
    if (totalHits - 40 * 2 >= 0) {
      btnNext.style.display = "block";
    }
    ++page;
    console.log(totalHits);
    Notiflix.Notify.success(`Hooray! We found ${rezultRequest.totalHits} images.`);
  })
    .catch(() => {

      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");

    })


})

