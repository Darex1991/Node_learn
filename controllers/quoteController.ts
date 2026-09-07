import type { ObjectId } from "mongodb";
import * as quoteModel from "../model/quoteModel";
import type { Quote } from "../types/quotes";

export const getQuotes = async () => {
  try {
    const quotes = await quoteModel.getAllQuotes();
    return quotes;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getQuoteById = async (id: string) => {
  try {
    const quote = await quoteModel.getById(id);
    return quote;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const asyncRandomQuote = async () => {
  try {
    const all = await getQuotes();

    if (all && Array.isArray(all)) {
      const random = Math.floor(Math.random() * all.length);
      return all[random];
    } else {
      console.log("No quotes found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createNewQuotes = async () => {
  const quotes: Omit<Quote, "_id">[] = [
    {
      quote: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    },
    {
      quote: "In the middle of difficulty lies opportunity.",
      author: "Albert Einstein",
    },
    {
      quote:
        "It is not the strongest of the species that survives, nor the most intelligent, but the one most responsive to change.",
      author: "Charles Darwin",
    },
    {
      quote:
        "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
      author: "Aristotle",
    },
    {
      quote:
        "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
    },
    {
      quote: "You miss 100% of the shots you don't take.",
      author: "Wayne Gretzky",
    },
  ];

  try {
    const result = await quoteModel.saveAll(quotes);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const prepareQuotes = async () => {
  try {
    const all = await getQuotes();

    if (!all) {
      await createNewQuotes();
    }

    return all;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const removeQuote = async (id: string) => {
  try {
    const quoteToRemove = await quoteModel.removeById(id);

    if (quoteToRemove) {
      return quoteToRemove;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateQuote = async (id: string, quote: Omit<Quote, "_id">) => {
  console.log(quote, "quote to update");
  try {
    const quoteToUpdate = await quoteModel.updateQuoteById(id, quote);

    if (quoteToUpdate) {
      return quoteToUpdate;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
