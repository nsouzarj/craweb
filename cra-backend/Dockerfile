# Multi-stage build: Build stage
FROM openjdk:23-jdk-slim AS builder

# Install Maven
RUN apt-get update && \
    apt-get install -y maven && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:23-jdk-slim

# Set working directory
WORKDIR /app

# Copy the JAR file from the builder stage
COPY --from=builder /app/target/cra-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8081

# Create a non-root user
RUN addgroup --system spring && \
    adduser --system spring --ingroup spring
USER spring:spring

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]