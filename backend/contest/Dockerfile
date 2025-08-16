# ========= STAGE 1: BUILD (Maven 3.9 + JDK 21) =========
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml first for better layer caching
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

# Copy source code and build
COPY src ./src
RUN mvn -q -DskipTests clean package

# ========= STAGE 2: RUNTIME (JRE 21) =========
FROM eclipse-temurin:21-jre-alpine

# Install necessary packages
RUN apk add --no-cache curl

WORKDIR /app

# Timezone for Vietnam
ENV TZ=Asia/Bangkok

# Spring Boot default configuration
ENV SPRING_PROFILES_ACTIVE=dev
ENV SERVER_PORT=8081

# JVM optimization for containers
ENV JAVA_TOOL_OPTIONS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

# Copy fat-jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Health check using API endpoint instead of actuator
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8081/api/parents/list || exit 1

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
