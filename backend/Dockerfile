# Giai đoạn 1: Build ứng dụng (Dùng Maven để tạo file .jar)
FROM maven:4.0-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Lệnh này sẽ build code thành file .jar, bỏ qua test để nhanh hơn
RUN mvn clean package -DskipTests

# Giai đoạn 2: Chạy ứng dụng (Dùng file .jar vừa build ở trên)
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
# Copy file .jar từ giai đoạn build sang giai đoạn chạy
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]