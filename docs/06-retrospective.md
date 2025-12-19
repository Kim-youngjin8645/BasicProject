# 프로젝트 회고

## 1. 가장 막혔던 지점
(에러 메시지와 해결 과정 포함)
### Docker
`failed to resolve source metadata for openjdk:17-jdk-slim`
DockerHub에서 태그가 제거되었음
### 백엔드 (springboot)
- 시간 출력이 9~13시간 정도 차이가 나게 출력됨
1) 원인: EC2 기본시간 설정=UTC
2) 해결: sudo timedatectl set-timezone Asia/Seoul

- CORS에러 
1) 원인: localhost:3000만허용
2) 해결: @CrossOrigin(origins="*") ->개발 단계에서만 허용됨.

### 프론트엔드(Next.js)
- 로컬에서 npm run dev로 실행
1) 원인:EC2 서버 공간의 부족으로 build시간이 너무 오래걸림
2) 해결: 백엔드만 EC2서버에서 설치 로컬에서 프론트엔드 실행
- tailwind 스타일 미적용 문제
1) 원인: Next.js와 Tailwind의 버전 불일치, 경로가 이상함
2) 해결: tailwind버전을 Next.js에 구조 및 버전에 맞게 재설치함
```
npm uninstall tailwindcss postcss autoprefixer
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

```
이후 `npm run dev` 로 서버 재시작.

### CI/CD (Github Actions)
- 문제 발생 에러:
```Run appleboy/ssh-action@master
Downloading drone-ssh-1.8.2-linux-amd64
Process exited with status 143 from signal TERM
Error: Process completed with exit code 1. 
```
- 초기 배포 스크립트
``` -name: Deploy to EC2
  uses: appleboy/ssh-action@master
  with:
  host: ${{ secrets.EC2_HOST }}
  username: ec2-user
  key: ${{ secrets.EC2_KEY }}
  command_timeout: 30m
  script: |
  set -e
  cd /home/ec2-user/app/backend
  pkill -f "BasicProject-0.0.1-SNAPSHOT.jar" || true
  sleep 2
  nohup java -jar BasicProject-0.0.1-SNAPSHOT.jar > backend.log 2>&1 < /dev/null &
  disown
  exit 0
 ```
1) 원인: SSH종료 문제 
- nohup으로 프로세스를 유지시키고 disown으로 쉘과 완전히 분리 시키고 exit 0로 스크립트 정상 종료를 선언으로 ssh종료를 유도햇는데 ssh세션이 백그라운드 프로세스 완료를 기다림
- ssh세션이 종료되기 전 SIGTERM신호로 강제 종료됨 
- 프로세스가 SSH세션에 연결되어있어서 분리가 이루어지지 않음

2) 해결: Systemd서비스 도입(자동재시작, 로그관리, SSH세션과 완전한 독립)

- 서비스 실행시 status=203/EXEC 에러 발생
```
Description=Spring Boot Backend
After=network.target

Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/app/backend
ExecStart=/usr/lib/jvm/jdk-17.0.8+7/bin/java -jar /home/ec2-user/app/backend/BasicProject-0.0.1-SNAPSHOT.jar
Restart=on-failure
RestartSec=10
StandardOutput=append:/home/ec2-user/app/backend/backend.log
StandardError=append:/home/ec2-user/app/backend/backend.log

WantedBy=multi-user.target
```
- 서비스 활성화
```
# systemd 데몬 리로드
sudo systemctl daemon-reload

# 서비스 활성화 (부팅 시 자동 시작)
sudo systemctl enable backend.service

# 서비스 시작
sudo systemctl start backend.service

# 서비스 상태 확인
sudo systemctl status backend.service

```
1) 원인1: JAR파일이 두곳에 존재(SCP액션이 디렉토리구조를 그대로 복사하여 중복 발생) 
2) 해결: 중복 파일 정리
   `rm -rf /home/ec2-user/app/backend/build`
3) 원인2: Systemd는 환경변수를 상속 받지않아 /usr/bin/java경로를 찾지 못함
4) 해결2: Systemd 서비스 파일의 ExecStart를 Java 절대 경로로 수정-`which java`명령어로 실제 경로 확인-> `# 출력: /usr/lib/jvm/jdk-17.0.8+7/bin/java`

### Github
- Github에서 frontend폴더가 안열렸음
1) 원인: frontend폴더가 Git Submodule로 등록되어있었음
- 이는 저장소의 코드가아닌 다른 Git저장소를 가르키는 링크상태였음
2) 해결: 서브모듈 해제 후 frontend를 일반폴더로 다시 추가함
```
#서브모듈 해제
git submodule deinit -f frontend
git rm -f frontend
rm -rf .git/modules/frontend
```

## 2. 이해가 부족하다고 느낀 부분
### 공통
공개 범위 파일 기준(어디까지 허용 되는지-그냥 모든 정보 나오는 것들은 다 비공개하는게 나은지)
경로적인 부분 정리의 필요성.
### docker
- 처음 저장소 생성이 기억이 안나서 다시 생성함/ db생성 설정
- 지금은 dockerfile을 사용하지 않아서 이부분에 대한 추가적인 공부가 필요할것같다.
### Next.js
Next.js App Router 구조 이해 부족(이유는 모르겠는데 js파일로 바꿨을 때 오류가 나고 tsx는 실행이 된다)

### EC2
- 서버 운용을 어떤식으로 해야 최적이 될지, 경로를 적당히 기준을 잡고 하기.

## 3. 팀 프로젝트 전에 보완하고 싶은 기술
- 코드는 항상 짜여진걸 보면 이해가 되는듯한 느낌을 받는데 사실 그걸 직접 작성해보려고하면 막상 엄두가 잘 나지 않는다
- 전체적인 공부가 필요한것 같고 사실 배운것에 비해서 쓰인 기술을 다 사용해보진 못했으니 전체적으로 더 보완해야할 것 같다
- 특히 이번의 경우 CI/CD부분에서 에러가 많이났고 사용환경 역시 쉽지않았다.


## 4. 혼자 진행하며 느낀 점
- 모르는 게 매우 많아서 혼자 하기 쉽지 않았다 특히 에러처리하는데 반복되는 에러가 나올 때 너무 하기 싫었다.
- 에러처리를 하면서 발생하는 에러들 최대한 다 기록해 두고 그것을 어떻게 해결했는지 다 기록해두는 습관이 필요하다.
