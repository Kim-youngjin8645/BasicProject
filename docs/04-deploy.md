# AWS 배포 

## 1. EC2를 선택한 이유
- 직접 서버 접근 가능: SSH를 통해 서버환경 확인이 가능하고 필요 소프트웨어 설치와 설정이 가능함.
- 프리티어 사용: 비용이 들어가지 않아 부담없이 사용 가능.

## 2. 보안 그룹 설정 이유
- 22 - TCP프로토콜 :SSH접속을 위해 외부ip허용(관리)
- 80 - TCP프로토콜 :HTTP요청허용(웹 브라우저 접근)
- 8080 - TCP프로토콜: SpringBoot백엔드 접근용(API테스트,프론트엔드 연동)
- 3000 - TCP프로토콜: Next.js 개발 서버 접근용(로컬 프론트 테스트)

## 3. 서버에서 실행한 명령 흐름
1. 디렉토리 생성 및 이동
`mkdir -p ~/app/backend`
`cd ~/app/backend`
2. Java설치 및 환경변수 설정
   `sudo yum install java-17-amazon-corretto -y`
   `export JAVA_HOME=/usr/lib/jvm/jdk-17.0.8+7`
   `export PATH=$JAVA_HOME/bin:$PATH`
3. 백엔드 실행
`java -jar BasicProject-0.0.1-SNAPSHOT.jar`
4. MYSQL(MariaDB)설치 및 설정
   `sudo yum install mariadb-server -y`
   `sudo systemctl start mariadb`
    `sudo systemctl enable mariadb`
    `mysql_secure_installation`
5. SpringBoot application.yml에서 DB연결 정보 설정.
## 4. 배포 후 접속 방식
- 백엔드 API확인: http://EC2_PUBLIC_IP:8080/api/guestbooks 
- 프론트엔드(로컬): Next.js 개발 서버에서 EC2 백엔드 API 호출
- 브라우저 테스트: API 호출이 정상적으로 작동하면 화면에 방명록 목록과 입력 폼 표시
- CORS 설정 확인 후, 외부 도메인에서도 API 접근 가능
