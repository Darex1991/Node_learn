import * as studentModel from "../model/studentModel";

export const getAllStudents = async () => {
  try {
    return await studentModel.getAllStudents();
  } catch (error) {
    return error;
  }
};

export const findStudentByName = async (name: string) => {
  try {
    return await studentModel.findStudentByName(name);
  } catch (error) {
    return error;
  }
};

export const seedStudents = async () => {
  try {
    await studentModel.insertStudents([
      { name: "John", age: 20, email: "john@example.com" },
      { name: "Jane", age: 21, email: "jane@example.com" },
      { name: "Jim", age: 22, email: "jim@example.com" },
      { name: "Jill", age: 23, email: "jill@example.com" },
      { name: "Jack", age: 24, email: "jack@example.com" },
    ]);
    return await studentModel.getAllStudents();
  } catch (error) {
    return error;
  }
};
