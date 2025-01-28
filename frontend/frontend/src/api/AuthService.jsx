import { AuthServiceClient } from "../grpc/idm.client";
import { LoginRequest, RegisterRequest, CheckTokenRequest, DestroyTokenRequest, UpdateRequest, DeleteRequest } from "../grpc/idm";
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";

const transport = new GrpcWebFetchTransport({
  baseUrl: "http://localhost:9090", 
});

const client = new AuthServiceClient(transport);

export const authService = {

  async login(email, password) {
    const request = LoginRequest.create({ email, password });

    try {
      const response = await client.loginUser(request);
      if (response.response.success) {
        const token = response.response.token;
        localStorage.setItem("token", token);

        const userData = await authService.checkToken(token);
        if (userData) {
          localStorage.setItem("user", JSON.stringify(userData)); 
          return { success: true, user: userData };
        }

        return token;
      }
      return { success: false };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false };
    }
  },

  async checkToken() {
    
    const token = localStorage.getItem("token");

    if (!token) return null;

    const request = CheckTokenRequest.create({ token });

    try {
      const response = await client.checkToken(request);
      console.log("Token Check Response:", response);
      return response.response.valid ? { email: response.response.email, role: response.response.role } : null;
    } catch (error) {
      console.error("Token validation error:", error);
      return null;
    }
  },

  async logout() {
    const token = localStorage.getItem("token");
    if (!token) return false;

    const request = DestroyTokenRequest.create({ token });

    try {
      const response = await client.destroyToken(request);
      if (response.response.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  },

  async updateUser(oldEmail, newEmail) {

    const request = UpdateRequest.create({ oldEmail, newEmail });
     console.log(request);
    try {
      const response = await client.updateUser(request);
      console.log(response);
      if (response.response.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Update error:", error);
      return false;
    }
  },

  async deleteUser(email) {
    const request = DeleteRequest.create({ email });

    try {
      const response = await client.deleteUser(request);
      if (response.response.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Delete error:", error);
      return false;
    }
  }
};
