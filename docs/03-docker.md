# 03. Docker
## 1. Docker목적
- 백엔드(springboot)와 프론트엔드(Next.js)를 컨테이너로 분리하여 실행 할 수 있도록 Dockerfile과 docker-compose파일을 준비
- 도커 환경을 이용한다면 로컬환경과 EC2배포 환경에서 동일한 서비스를 실행 가능
- MYSQL데이터베이스도 컨테이너로 구성 할 수 있음
## 2. 현재 환경
- 현재 테스트 및 배포는 EC2에서 직접실행
- 백엔드:`java -jar BasicProject-0.0.1-SNAPSHOT.jar`
- 프론트엔드: `npm run dev`
- 도커를 사용하지 않고 서비스 동작 확인 가능

## 3. Dockerfile(프론트엔드)
- Next.js 애플리케이션을 빌드하고 컨테이너에서 실행 가능하도록 구성
1. `node:20-alpine` 기반 빌드 환경 생성
2. `package*.json` 복사 후 `npm install`
3. 프로젝트 전체 복사 후 `npm run build`
4. 런타임 환경에서 빌드 결과 복사
5. `server.js`로 애플리케이션 실행

### 3-1 Dockerfile(백엔드)
1. `eclipse-temurin:17-jdk`를 사용
   (Docker Hub에 openjdk:17-jdk-slim 태그가 더 이상 존재하지 않음)
2. 작업 디렉토리 `/app` 설정
3. gradle 결과물 복사 
4. 8080포트 오픈
5. `java-jar app.jar`실행

### 3-2 docker-compose.yml(백엔드)
- **서비스 구성**
- `mysql`: MySQL 8.0, 환경 변수로 사용자/비밀번호/DB 설정, 3306 포트 매핑
- `backend`: Dockerfile 빌드, 8080 포트 매핑, MySQL 컨테이너에 의존
- `frontend`: Dockerfile 빌드, 3000 포트 매핑, 백엔드 컨테이너에 의존

## 4 Docker사용방법
- 도커 설치후 루트 디렉토리에서 실행
- docker-compose build 
- docker-compose up -d

## 5. docker-compose 역할
- 현재 사용하고 있는 Mysql데이터베이스, springboot백엔드, Next.js프론트엔드 컨테이너들을 파일 하나로 묶어
여러개의 설정을 정의하고 모든 컨테이너를 실행/중지/재시작이 명령 한번에 가능하게 해줌
- 각 컨테이너들을 개별로 실행시키려면 매번 터미널을 열어 각 컨테이너들을 실행시켜주고 네트워크를 연결해야하는데 
너무 불편하고 오류가 날 확률이 높기 때문에 사용.
- 실행 순서, 의존성 관리 ,네트워크 연결 자동 처리, 일괄 관리

## 6. 참고
- 현재 EC2에서 직접 도커를 설치해서 사용하려 했으나 내부 서비스 공간이 적어 직접 도커를 설치하기 보다는 백엔드를Ec2에서 실행, 프론트엔드를 로컬에서 실행하여 외부 서버에서 백엔드를 이용하는 구조로 사용했음.
- 