import type { InsertManyResult, WithId } from "mongodb";
import * as studentModel from "../model/studentModel";
import type { Student } from "../types/students";

export const getAllStudents = async (): Promise<WithId<Student>[] | Error> => {
  try {
    const students = await studentModel.getAllStudents();
    if (!students) {
      return new Error("No students found");
    }
    return students;
  } catch (error) {
    return new Error("Failed to get all students", { cause: error });
  }
};

export const findStudentByName = async (
  name: string,
): Promise<WithId<Student> | Error> => {
  try {
    const student = await studentModel.findStudentByName(name);
    if (!student) {
      return new Error("Student not found");
    }
    return student;
  } catch (error) {
    return new Error("Failed to find student by name", { cause: error });
  }
};

export const seedStudents = async (): Promise<
  InsertManyResult<Student> | Error
> => {
  try {
    const students = await studentModel.insertStudents([
      { name: "John", age: 20, email: "john@example.com" },
      { name: "Jane", age: 21, email: "jane@example.com" },
      { name: "Jim", age: 22, email: "jim@example.com" },
    ]);

    if (!students) {
      return new Error("Failed to seed students");
    }

    return students;
  } catch (error) {
    return new Error("Failed to seed students", { cause: error });
  }
};
