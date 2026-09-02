import type { Collection, InsertManyResult, WithId } from "mongodb";
import { connectToMongoDB } from "../data/students/studentDb";
import type { Student } from "../types/students";

const getStudentsCollection = async (): Promise<Collection<Student> | null> => {
  const client = await connectToMongoDB();
  if (!client) {
    return null;
  }
  return client.db("schoolDB").collection<Student>("students");
};

export const getAllStudents = async (): Promise<WithId<Student>[] | null> => {
  const collection = await getStudentsCollection();
  if (!collection) {
    return null;
  }
  return collection.find().toArray();
};

export const insertStudents = async (
  students: Student[],
): Promise<InsertManyResult<Student> | null> => {
  const collection = await getStudentsCollection();
  if (!collection) {
    return null;
  }
  return collection.insertMany(students, { ordered: true });
};

export const findStudentByName = async (
  name: string,
): Promise<WithId<Student> | null> => {
  const collection = await getStudentsCollection();
  if (!collection) {
    return null;
  }
  return collection.findOne({ name });
};
