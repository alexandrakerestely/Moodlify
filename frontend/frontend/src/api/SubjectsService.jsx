import { subjectsApi } from "./axiosConfig";

export const SubjectService = {
    async getSubjects(link) {
      try {
        const response = await subjectsApi.get(link);
        return response.data;
      } catch (error) {
        console.error("Error fetching subjects:", error);
        return [];
      }
    },

    async getPaginatedSubjects(link) {
      try {
        const response = await subjectsApi.get(link);
        return response.data;
      } catch (error) {
        console.error("Error fetching subjects:", error);
        return [];
      }
    },

    async getTeacherSubjects(link) {
      try {
        const response = await subjectsApi.get(link);
        return response.data;
      } catch (error) {
        console.error("Error fetching teacher subjects:", error);
        return [];
      }
    },
  
    async getSubjectStudents(link) {
      try {
        const response = await subjectsApi.get(link);
        return response.data;
      } catch (error) {
        console.error("Error fetching subject students:", error);
        return [];
      }
    },
  
    async updateSubject(link, data) {
      try {
        console.log(`Updating subject at: ${link}`, data);
        const response = await subjectsApi.put(link, data);
        return response.data;
      } catch (error) {
        console.error("Error updating subject:", error);
        return null;
      }
    },
  
    async deleteSubject(link) {
      try {
        await  subjectsApi.delete(link);
        return true;
      } catch (error) {
        console.error("Error deleting subject:", error);
        return false;
      }
    },
  
    async createSubject(link, data) {
      try {
        const response = await subjectsApi.put(link, data);
        return response.data;
      } catch (error) {
        console.error("Error creating subject:", error);
        return null;
      }
    }
  };