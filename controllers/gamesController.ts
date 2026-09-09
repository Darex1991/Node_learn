import mongoose from "mongoose";
import { connect, close } from "../data/games/games";
import { Game } from "../model/gameModel";

type GameType = InstanceType<typeof Game>;

export let gamesConnection: mongoose.Connection | null = null;

export const connectToGames = async () => {
  try {
    if (gamesConnection) {
      console.log("Games connection already opened");
      return gamesConnection;
    }

    const client = await connect();
    gamesConnection = client.connection;
    console.log("Games connection opened");
    return gamesConnection;
  } catch (error) {
    return new Error("Failed to connect to games", { cause: error });
  }
};

export const closeGames = async () => {
  try {
    await close();
  } catch (error) {
    return new Error("Failed to close games", { cause: error });
  }
};

export const getAllGames = async (): Promise<GameType[] | Error> => {
  try {
    await connectToGames();

    const games = await Game.find();

    if (!games || games.length === 0) {
      return new Error("No games found");
    }
    return games;
  } catch (error) {
    return new Error("Failed to get all games", { cause: error });
  }
};

export const addGame = async (): Promise<GameType | Error> => {
  try {
    await connectToGames();

    const game = new Game({
      _id: new mongoose.Types.ObjectId(),
      name: "Game 3",
      description: "Description 1",
      price: 100,
      image: "image.jpg",
      category: "Category 1",
      ratings: [
        {
          rating: 5,
        },
        {
          rating: 4,
        },
        {
          rating: 3,
        },
        {
          rating: 2,
        },
        {
          rating: 1,
        },
      ],
    });

    console.log(game.name, "game");

    const done = await Game.findOne({ name: game.name }).then(
      async (foundGame) => {
        console.log(foundGame, "foundGame");
        if (!foundGame) {
          await game.save();
          console.log("Game saved");
          return game;
        } else {
          console.log("Game already exists");
          return foundGame;
        }
      },
    );

    console.log(done.getAverageRating());
    if (!done) {
      return new Error("Failed to add game");
    }
    return done;
  } catch (error) {
    return new Error("Failed to add game", { cause: error });
  }
};
