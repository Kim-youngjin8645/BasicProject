FROM eclipse-temurin:17-jdk
#Docker Hub에 openjdk:17-jdk-slim 태그가 더 이상 존재하지 않음
#FROM openjdk:17-jdk-slim를 위의 코드로 고침
WORKDIR /app

# Gradle build 결과물 복사
COPY build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
