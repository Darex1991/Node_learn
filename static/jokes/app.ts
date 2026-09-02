const getJokesData = async () => {
  const response = await fetch("/api/jokes/random", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data, "data");
  return data;
};

const displayJokesData = (joke: { text: string }) => {
  console.log(document.querySelector(".some-jokes"));
  const jokeElement = document
    .querySelector(".some-jokes")
    ?.getElementsByTagName("span")
    ?.item(0);

  if (!jokeElement) {
    console.log("jokeElement not found");
    return;
  }
  jokeElement.textContent = joke.text;
};

const showLoading = () => {
  const loadingElement = document.querySelector(".loading");
  if (!loadingElement) {
    console.log("loadingElement not found");
    return;
  }
  loadingElement.classList.remove("hidden");
};

const hideLoading = () => {
  const loadingElement = document.querySelector(".loading");
  if (!loadingElement) {
    console.log("loadingElement not found");
    return;
  }
  loadingElement.classList.add("hidden");
};

const showSomeJokes = () => {
  const someJokesElement = document.querySelector(".some-jokes");
  if (!someJokesElement) {
    console.log("someJokesElement not found");
    return;
  }
  someJokesElement.classList.remove("hidden");
};

const hideSomeJokes = () => {
  const someJokesElement = document.querySelector(".some-jokes");
  if (!someJokesElement) {
    console.log("someJokesElement not found");
    return;
  }
  someJokesElement.classList.add("hidden");
};

export const nextJoke = async () => {
  hideSomeJokes();
  showLoading();

  const joke = await getJokesData();
  displayJokesData(joke);

  hideLoading();
  showSomeJokes();
};

document.addEventListener("DOMContentLoaded", nextJoke);
document.getElementById("next-joke")?.addEventListener("click", nextJoke);
