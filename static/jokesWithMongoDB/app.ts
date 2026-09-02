const getRandomJoke = async () => {
  console.log("getRandomJoke");
  const response = await fetch("/api/jokesWithMongoDB/random", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(response, "response");
  if (!response.ok) {
    console.log("No joke found");
    return null;
  }
  const joke = await response.json();
  return joke?.joke ?? null;
};

const displayJoke = (jokeText: string | null) => {
  const jokeElement = document
    .querySelector(".some-jokes")
    ?.getElementsByTagName("span")
    ?.item(0);

  if (!jokeElement) {
    console.log("jokeElement not found");
    return;
  }
  jokeElement.textContent = jokeText || "";
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
  const jokeText = await getRandomJoke();
  displayJoke(jokeText);
  hideLoading();
  showSomeJokes();
};

document.addEventListener("DOMContentLoaded", nextJoke);
document.getElementById("next-joke")?.addEventListener("click", nextJoke);
