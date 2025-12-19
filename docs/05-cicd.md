# CI/CD

## 1. Github Actions를 사용하는 이유
- Github저장소와 바로 연동되어 코드 푸쉬시 자동으로 빌드 테스트 배포가 가능.
- 서버에 직접 접속하지 않고 자동으로 최신 코드를 배포 할 수 있음
- 개발효율이 좋고 일관성이 높아짐.

## 2. 워크플로우 실행조건
- main브랜치에 코드 push할 때 자동실행
- 조건 충족시 CI(빌드 및 테스트)와 CD(배포) 단계 연속적 수행

## 3.자동화된 단계별 흐름
### 3-1. 코드 체크
- Github Actions가 저장소의 최신코드를 가져옴

### 3-2 프론트엔드 빌드
- Node.js 환경설정
- 프론트엔드 의존성설치(npm install)
- 빌드 수행(npm run build)
- 빌드 결과물은 EC2서버에 배포

### 3-3. 백엔드 배포
- Gradle Wrapper에 실행 권한 부여
- Gradle을 통한 백엔드 빌드 수행 (테스트 제외)
    - 빌드 결과물: `build/libs/BasicProject-0.0.1-SNAPSHOT.jar`
- SCP를 통해 JAR 파일을 EC2 서버로 전송
- SSH로 EC2 서버 접속 후 Systemd 서비스 재시작
    - `systemctl restart backend.service` 명령 실행
    - Systemd가 자동으로 기존 프로세스 종료 및 새 JAR 실행 관리

### 3-4. 프론트엔드 배포 (서버 실행 방식 /현재 로컬 실행 방식 사용)
- 프론트엔드 빌드 결과물을 EC2 서버로 전송
- SSH로 EC2 서버 접속
- 기존 프론트엔드 프로세스 종료 (`pkill -f 'npm'`)
- 빌드 파일 및 소스 복사
- 의존성 설치 (`npm install`)
- 백그라운드로 서버 실행 (`nohup npm run start &`)


### 3-5. 결과
- 코드가 GitHub에 push되면 **자동으로 최신 상태의 서비스**가 EC2 서버에서 실행됨
- Systemd 서비스로 일원화 된 관리

## 4. 주요 기술 스택
- **CI/CD 도구:** GitHub Actions
- **빌드 도구:** Gradle (백엔드), npm (프론트엔드)
- **배포 도구:** appleboy/scp-action, appleboy/ssh-action
- **프로세스 관리:** Systemd (백엔드)
- **서버 환경:** AWS EC2 (Amazon Linux 2 / Ubuntu)

## 5. 보안
- EC2 접속 정보는 GitHub Secrets로 안전하게 관리
    - `EC2_HOST`: 서버 주소
    - `EC2_KEY`: SSH 프라이빗 키