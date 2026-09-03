const fetchCars = async () => {
  showLoading();
  hideCars();
  const response = await fetch("/api/cars");
  const data = await response.json();
  console.log(data, "data");
  return data;
};

const displayCars = (
  cars: { name: string; brand: string; color: string }[],
) => {
  hideLoading();
  const carsElement = document.getElementById("cars");
  if (carsElement) {
    carsElement.innerHTML = cars
      .map(
        (car: { name: string; brand: string; color: string }) =>
          `<li>name: ${car.name}, brand: ${car.brand}, color: ${car.color}</li>`,
      )
      .join("");
  }
  showCars();
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

const showCars = () => {
  const carsElement = document.querySelector(".cars");
  if (!carsElement) {
    console.log("carsElement not found");
    return;
  }
  carsElement.classList.remove("hidden");
};

const hideCars = () => {
  const carsElement = document.querySelector(".cars");
  if (!carsElement) {
    console.log("carsElement not found");
    return;
  }
  carsElement.classList.add("hidden");
};

fetchCars().then(displayCars).catch(console.error);
