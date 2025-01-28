import { teachersApi } from "./axiosConfig";

export const TeacherService = {
    async getTeacher() {
      try {
        const response = await teachersApi.get(``);
        return response.data[0]; 
      } catch (error) {
        console.error("Error fetching teacher data:", error);
        return null;
      }
    },

    async getAllTeachers() {
      try {
        const response = await teachersApi.get(``);
        return response.data; 
      } catch (error) {
        console.error("Error fetching teacher data:", error);
        return null;
      }
    },
  
    async getTeacherSubjects(link) {
      try {
        const response = await teachersApi.get(link);
        return response.data;
      } catch (error) {
        console.error("Error fetching teacher subjects:", error);
        return [];
      }
    },
  
    async updateTeacher(link, data) {
      try {
        console.log(`Updating teacher at: ${link}`, data);
        const response = await teachersApi.put(link, data);
        return response.data;
      } catch (error) {
        console.error("Error updating teacher:", error);
        return null;
      }
    },

    async createTeacher(link, data) {
      try {
        console.log(`Creating teacher at: ${link}`, data);
        const response = await teachersApi.post(link, data);
        return response.data;
      } catch (error) {
        console.error("Error creating teacher:", error);
        return null;
      }
    },

    async deleteTeacher(link, id) {
      try {
        console.log(`Deleting teacher at: ${link}`, id);
        const response = await teachersApi.delete(link, id);
        return response.data;
      } catch (error) {
        console.error("Error deleting teacher:", error);
        return null;
      }
    },
  };