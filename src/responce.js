import axios from "axios";

const instance = axios.create({
  method: 'get',
  baseURL: "https://pixabay.com/api",
  params: {
    image_type: "photo",
    orientation: "horizontal",
    safesearch: 'true',

  },
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

export function getCardsEl(hits) {
  return hits.map((card) => {
    const cardEl = `<div class="card">
        <a href="${card.largeImageURL}" class="card__link">
        <div class = "card__thumb">
          <img 
            src="${card.webformatURL}"
            alt="${card.tags}"
            loading="lazy"
          />
          </div>
          <div class="info">
            <p class="info__item">
              <b>Likes</b>
              ${card.likes}
            </p>
            <p class="info__item">
              <b>Views</b>
              ${card.views}
            </p>
            <p class="info__item">
              <b>Comments</b>
              ${card.comments}
            </p>
            <p class="info__item">
              <b>Downloads</b>
              ${card.downloads}
            </p>
          </div>
        </a>
      </div>`;
    return cardEl;
  }).join("");
}


function checkResponce(data) {
  if (data.totalHits === 0) {
    throw new Error("is 0");
  }
  else {
    return data;
  }

}

export async function getPhoto(srcAPIKey, keyWords, currentPage = 1, currentPerPage = 40) {

  const responceServer = await instance.get(srcAPIKey, {
    params: {
      q: `${keyWords}`,
      page: currentPage,
      per_page: currentPerPage
    }
  });
  const data = await responceServer.data;
  const resultCheck = await checkResponce(data);
  return resultCheck;
}
