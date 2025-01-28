import { materialsApi } from "./axiosConfig";

export const MaterialsService = {

    async getMaterials(link) {
        link = link.replace("http://subjects-service:8000", "http://localhost:8000");
        console.log(link);
        try {
           
            const response = await materialsApi.get(link); 
            return response.data; 
        } catch (error) {
          console.error("Error fetching subject materials:", error);
          return null;
        }
    },

    async getMaterialsByCode(link) {
        link = link.replace("http://subjects-service:8000", "http://localhost:8000");
        console.log(link);
        try {
           
            const response = await materialsApi.get(link); 
            return response.data; 
        } catch (error) {
          console.error("Error fetching subject materials:", error);
          return null;
        }
    },

    async createMaterials(link, data) {
        link = link.replace("http://subjects-service:8000", "http://localhost:8000");
        console.log(link);
        try {
          const response = await materialsApi.post(link, data);
          return response.data;
        } catch (error) {
          console.error("Error creating subject:", error);
          return null;
        }
    },
    
    async updateMaterials(link, data) {
        link = link.replace("http://subjects-service:8000", "http://localhost:8000");
        console.log(link);
        try {
          const response = await materialsApi.put(link, data);
          return response.data;
        } catch (error) {
          console.error("Error updating subject:", error);
          return null;
        }
    },

    async deleteMaterials(link) {
      link = link.replace("http://subjects-service:8000", "http://localhost:8000");
      try {
        await  materialsApi.delete(link);
        return true;
      } catch (error) {
        console.error("Error deleting materials:", error);
        return false;
      }
    }
}