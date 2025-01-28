# Moodlify
A distributed system application implementing the management of a learning platform.

This project was developed as an uni assignment and transferred here. To see the full commit history, please check here: https://github.com/TUIasi-AC-licenta-POS/activitatea-de-laborator-2024-2025-Alexandra-Kerestely/tree/proiect (branch proiect)

## Functionalities

- Role-based authentication using gRPC
- Role-based management of teachers, students, subjects and materials
- Web interface

## Technology Stack

- Spring Boot and MariaDB for teachers, students, subjects microservice (developed in conformity with RFC 9110)
- Python and MongoDB for materials microservice
- Python and MariaDB for gRPC microservice
- Docker Compose for microservice containerization
- React for frontend
- Envoy as a gRPC proxy for the frontend
