import axios from "axios";

const STUDENTS_BASE_URL = "http://localhost:8080/api/academia/students";
const TEACHERS_BASE_URL = "http://localhost:8080/api/academia/professors";
const SUBJECTS_BASE_URL = "http://localhost:8080/api/academia/subjects";
const MATERIALS_BASE_URL = "http://localhost:8000/subjects";
const AUTH_BASE_URL = "http://localhost:9090"; 


const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });


  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};

export const studentsApi = createAxiosInstance(STUDENTS_BASE_URL);
export const teachersApi = createAxiosInstance(TEACHERS_BASE_URL);
export const subjectsApi = createAxiosInstance(SUBJECTS_BASE_URL);
export const materialsApi = createAxiosInstance(MATERIALS_BASE_URL);
export const authApi = createAxiosInstance(AUTH_BASE_URL);
