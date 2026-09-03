const fetchStudents = async () => {
  showLoading();
  hideStudents();
  const response = await fetch("/api/students");
  const data = await response.json();
  console.log(data, "data");
  return data;
};

const displayStudents = (
  students: { name: string; age: number; email: string }[],
) => {
  hideLoading();
  const studentsElement = document.getElementById("students");
  if (studentsElement) {
    studentsElement.innerHTML = students
      .map(
        (student: { name: string; age: number; email: string }) =>
          `<li>name: ${student.name}, age: ${student.age}, email: ${student.email}</li>`,
      )
      .join("");
  }
  showStudents();
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

const showStudents = () => {
  const studentsElement = document.querySelector(".students");
  if (!studentsElement) {
    console.log("studentsElement not found");
    return;
  }
  studentsElement.classList.remove("hidden");
};

const hideStudents = () => {
  const studentsElement = document.querySelector(".students");
  if (!studentsElement) {
    console.log("studentsElement not found");
    return;
  }
  studentsElement.classList.add("hidden");
};

fetchStudents().then(displayStudents).catch(console.error);
