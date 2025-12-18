# API 명세서

## 1. Guestbook 목록 조회

* **URL:** `/guestbooks`
* **Method:** `GET`
* * **Response Code:** 200 
* **Response:** JSON 배열


```json
[
  {
    "id": 1,
    "nickname": "홍길동",
    "content": "첫 글입니다",
    "createdAt": "2025-12-16T10:00:00"
  }
]
```

---


## 2. Guestbook 등록

* **URL:** `/guestbooks`
* **Method:** `POST`
* **Request:** JSON 객체

```json
{
  "nickname": "홍길동",
  "content": "방명록 작성 테스트"
}
```

* **Response:** 생성된 객체 반환

```json
{
  "id": 2,
  "nickname": "홍길동",
  "content": "방명록 작성 테스트",
  "createdAt": "2025-12-16T11:00:00"
}
```

