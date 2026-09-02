import { connectToMongoDB } from "../data/students/studentDb";

export type Student = {
  name: string;
  age: number;
  email: string;
};

const getStudentsCollection = async () => {
  const client = await connectToMongoDB();
  if (!client) {
    throw new Error("Failed to connect to MongoDB");
  }
  return client.db("schoolDB").collection<Student>("students");
};

export const getAllStudents = async () => {
  const collection = await getStudentsCollection();
  return collection.find().toArray();
};

export const insertStudents = async (students: Student[]) => {
  const collection = await getStudentsCollection();
  return collection.insertMany(students, { ordered: true });
};

export const findStudentByName = async (name: string) => {
  const collection = await getStudentsCollection();
  return collection.findOne({ name });
};
