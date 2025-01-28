FROM maven:3.9.6-eclipse-temurin-21 AS stub

WORKDIR /app

COPY ./grpc ./grpc

WORKDIR /app/grpc

RUN mvn clean install -DskipTests

FROM maven:3.9.6-eclipse-temurin-21 AS main

WORKDIR /app

COPY . ./main

WORKDIR /app/main

COPY --from=stub /root/.m2 /root/.m2

RUN mvn clean package -DskipTests

RUN ls -l /app/main/target/

FROM maven:3.9.6-eclipse-temurin-21

WORKDIR /project

COPY --from=main /app/main/target/posproject-0.0.1-SNAPSHOT.jar project.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "project.jar"]
