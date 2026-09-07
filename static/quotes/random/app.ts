const getRandomQuote = async () => {
  try {
    const getQuote = await fetch("/api/quotes/random");
    const quote = await getQuote.json();
    if (!quote) {
      console.log("No quote found");
      return;
    }
    const quoteElement = document.querySelector("#random-quote");
    if (!quoteElement) {
      console.log("quoteElement not found");
      return;
    }
    const newElement = document.createElement("div");
    newElement.innerHTML = `<p>${quote.quote} - <span>${quote.author}</span></p>`;
    quoteElement.appendChild(newElement);
  } catch (error) {
    console.error(error);
  }
};

getRandomQuote();
