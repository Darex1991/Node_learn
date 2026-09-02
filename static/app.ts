const getJokesData = async () => {
    const response = await fetch('/api/jokes/random', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
    return data.joke;
}

const displayJokesData = (joke: { text: string }) => {
    const jokeElement = document.querySelector('.some-jokes')?.getElementsByTagName('span')[0];
    if (!jokeElement) {
        return;
    }
    jokeElement.innerHTML = joke.text;
}

const nextJoke = async () => {
    const joke = await getJokesData();
    displayJokesData(joke);
}

(window as unknown as { nextJoke: typeof nextJoke }).nextJoke = nextJoke;

nextJoke();