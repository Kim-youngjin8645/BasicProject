# 프로젝트 설계

## 1. 서비스 설명
사용자가 간단한 방명록을 작성하고 조회할 수 있는 애플리케이션
로컬 및 클라우드에서 동일하게 동작, 작성된 데이터는 mysql에 db에 저장.

## 2. 전체 흐름
1. 사용자가 웹 브라우저 방명록 작성 폼에 닉네임과 내용을 입력후 제출
2. 프론트엔드(next.js)에서 http post요청으로 백엔드 api('spring boot')에 데이터 전송
3. 백엔드는 요청을 받아 데이터 검증 후 mysql데이터베이스에 저장
4. 프론트엔드는 받은데이터를 랜더링하여 사용자에게 보여줌

## 3. 프론트엔드 역할
- 사용자 인터페이스(UI)제공: 방명록 작성 폼, 방명록 리스트
- 입력 데이터 검증: 빈 값 확인 등 간단한 클라이언트 측 유효성 검사
- 백엔드api호출: fetch를 이용한 CRUD요청수행 가능
- 시각화: 데이터json을 화면에 출력 및 스타일링(Tailwind CSS)
- 배포: Next.js서버를 EC2 혹은 로컬서버에서 실행하여 외부접근 가능

## 4. 백엔드 역할
- REST API제공: 방명록 생성(Create) 및 조회(Read)기능
- 데이터 관리: MYSQL 데이터베이스와ㅏ 연동하여 JPA(Entity,Repository)로 데이터 CRUD처리가능
- CORS처리: 로컬 및 외부 프론트엔드에서 API호출을 가능하도록 설정
- 서버 실행: EC2 상에서 spring Boot JAR 실행, 8080포트로 서비스 제공
- 로그 기록: 백엔드 로그를 파일로 저장하여 서비스 모니터링

## 5.배포 구조 요약
- 로컬 환경
    - 프론트엔드: `npm run dev`로 개발 서버 실행, 포트 3000
    - 백엔드: Intellij에서 JAR 실행 또는 `java -jar`로 실행, 포트 8080
    - MySQL: 로컬 DB 연결  
- EC2 배포 환경
    - 프론트엔드: EC2에서 Next.js 빌드 후 `npm run start` 80번 포트 서비스
    - 백엔드: EC2에서 `java -jar BasicProject-0.0.1-SNAPSHOT.jar` 실행, 포트 8080
    - MySQL: EC2 내부 MariaDB 설치 및 서비스 연결
    - 보안: EC2 보안 그룹을 통해 포트 22(SSH), 80(HTTP), 8080(Spring Boot) 허용
    - CI/CD: GitHub Actions를 활용하여 Push 시 자동 배포  