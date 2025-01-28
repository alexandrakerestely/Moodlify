
import { studentsApi } from "./axiosConfig";

export const StudentService = {
  async getStudent(email) {
    try {
      const response = await studentsApi.get(``);
      return response.data[0]; 
    } catch (error) {
      console.error("Error fetching student:", error);
      return null;
    }
  },

  async getStudentSubjects(link) {
    try {
      const response = await studentsApi.get(link);
      return response.data; 
    } catch (error) {
      console.error("Error fetching subjects:", error);
      return null;
    }
  },

  async updateStudent(link, data) {
    try {
      console.log(`Updating student at: ${link}`, data);
      const response = await studentsApi.put(link, data);
      return response.data;
    } catch (error) {
      console.error("Error updating student:", error);
      return null;
    }
  },

  async createStudent(link, data) {
    try {
      console.log(`Updating student at: ${link}`, data);
      const response = await studentsApi.post(link, data);
      return response.data;
    } catch (error) {
      console.error("Error updating student:", error);
      return null;
    }
  },

  async deleteStudent(link, id) {
    try {
      console.log(`Updating student at: ${link}`, id);
      const response = await studentsApi.delete(link, id);
      return response.data;
    } catch (error) {
      console.error("Error deleting student:", error);
      return null;
    }
  },

  async getAllStudents()
  {
    try {
      const response = await studentsApi.get(``);
      return response.data; 
    } catch (error) {
      console.error("Error fetching student:", error);
      return null;
    }
  }

};
