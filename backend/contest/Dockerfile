# ========= STAGE 1: BUILD (Maven 3.8.7 + JDK 21) =========
FROM maven:3.8.7-eclipse-temurin-21 AS build
WORKDIR /app

# Chỉ copy pom.xml trước để cache dependency (build nhanh cho các lần sau)
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

# Copy toàn bộ source và build
COPY src ./src
# Tạo fat-jar (Spring Boot) - không chạy test trong image build
RUN mvn -q -DskipTests clean package


# ========= STAGE 2: RUNTIME (JRE 21) =========
FROM eclipse-temurin:21-jre
WORKDIR /app

# Timezone (tuỳ bạn, để phù hợp VN mình dùng Asia/Bangkok)
ENV TZ=Asia/Bangkok

# Thiết lập mặc định cho Spring Boot (có thể override qua docker-compose/env)
ENV SPRING_PROFILES_ACTIVE=dev
ENV SERVER_PORT=8081

# Tối ưu GC/heap cho container
ENV JAVA_TOOL_OPTIONS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Copy fat-jar từ stage build
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java","-jar","/app/app.jar"]
