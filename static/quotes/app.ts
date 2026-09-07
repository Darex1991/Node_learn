import type { Quote } from "../types/quotes";

const onRemoveQuote = async (id: string) => {
  console.log(id, " id");
  try {
    const quote = await fetch(`/api/quotes/${id}`, {
      method: "DELETE",
    });
    const quoteData = await quote.json();
    if (quoteData) {
      console.log("Quote removed");
      getQuotes();
    } else {
      console.log("Quote not removed");
    }
  } catch (error) {
    console.error(error);
  }
};

const onRemove = (id: string) => {
  const confirm = window.confirm("Are you sure you want to remove this quote?");
  if (confirm) {
    onRemoveQuote(id);
  }
  return;
};

const onEditQuote = async (quote: Quote) => {
  try {
    const { _id, ...quoteToUpdate } = quote;
    console.log({body: quoteToUpdate, quote})
    const quoteResponse = await fetch(`/api/quotes/${_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quoteToUpdate),
    });
    const quoteUpdated = await quoteResponse.json();
    console.log(quoteUpdated, "quoteUpdated");

    if (quoteUpdated) {
      console.log("Quote updated");
      const addModal = document.getElementById("addModal");
      if (addModal) {
        addModal.classList.add("hidden");
      }
      getQuotes();
    } else {
      console.log("Quote not updated");
    }
  } catch (error) {
    console.error(error);
  }
};

const showModal = (quote: Quote) => {
  const modal = document.getElementById("addModal");
  const span = document.getElementsByClassName("close")[0];
  let quoteInputValue: string = quote.quote;
  let authorInputValue: string = quote.author;

  if (!modal || !span) {
    console.log("modal, btn or span not found");
    return;
  }

  console.log(modal, "modal");
  const quoteInput = modal.querySelector("input[name='quote']");
  const authorInput = modal.querySelector("input[name='author']");

  if (quoteInput && authorInput) {
    (quoteInput as HTMLInputElement).value = quoteInputValue;
    (authorInput as HTMLInputElement).value = authorInputValue;
  }

  span.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  quoteInput?.addEventListener("change", (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      quoteInputValue = event.target.value;
    }
  });

  authorInput?.addEventListener("change", (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      authorInputValue = event.target.value;
    }
  });

  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.classList.add("hidden");
    }
  });

  modal.addEventListener("submit", (event: Event) => {
    event.preventDefault();
    onEditQuote({ ...quote, quote: quoteInputValue, author: authorInputValue });
  });

  modal.classList.remove("hidden");
};

const getQuotes = async () => {
  try {
    const getQuotes = await fetch("/api/quotes");
    const quotes = await getQuotes.json();
    if (!quotes) {
      console.log("No quotes found");
      return;
    }
    const quoteElement = document.querySelector("#quotes");
    if (!quoteElement) {
      console.log("quotesElement not found");
      return;
    }
    quoteElement.innerHTML = "";
    const tableElement = document.createElement("table");
    const tableHead = document.createElement("thead");
    tableHead.innerHTML = `<tr><th>Quote</th><th>Author</th></tr>`;
    const tableBody = document.createElement("tbody");
    quotes.forEach((quote: Quote) => {
      const newElement = document.createElement("tr");
      const thElement = document.createElement("th");
      thElement.innerHTML = quote._id.toString().slice(-6);
      const tdElement2 = document.createElement("td");
      tdElement2.innerHTML = quote.quote;
      const tdElement = document.createElement("td");
      tdElement.innerHTML = quote.author;

      const tdElementRemove = document.createElement("td");
      const buttonElement = document.createElement("button");
      buttonElement.innerHTML = "Remove";
      buttonElement.addEventListener("click", () =>
        onRemove(quote._id.toString()),
      );

      const tdElementEdit = document.createElement("td");
      const buttonEditElement = document.createElement("button");
      buttonEditElement.innerHTML = "Edit";
      buttonEditElement.addEventListener("click", () => showModal(quote));

      tdElementRemove.appendChild(buttonElement);
      tdElementEdit.appendChild(buttonEditElement);

      newElement.appendChild(thElement);
      newElement.appendChild(tdElement2);
      newElement.appendChild(tdElement);
      newElement.appendChild(tdElementRemove);
      newElement.appendChild(tdElementEdit);
      tableBody.appendChild(newElement);
    });
    tableElement.appendChild(tableHead);
    tableElement.appendChild(tableBody);
    quoteElement.appendChild(tableElement);
  } catch (error) {
    console.error(error);
  }
};

getQuotes();
