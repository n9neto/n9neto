# NINETO

NINETO는 소셜링 목록 조회부터 시간 선택, 상세 소개 확인, 참가 신청서 제출까지 이어지는 **정적 프론트엔드 신청 페이지**입니다.  
HTML, CSS, Vanilla JavaScript로 구성되어 있으며, 데이터 조회 및 신청 제출은 **Google Apps Script Web App API**와 연동됩니다.

## 주요 기능

- 소셜링 목록 조회
- 소셜링별 신청 가능 시간 조회 및 선택
- 상세 소개 이미지 노출
- 다단계 신청 폼 진행
- 공지사항 / 개인정보 동의 확인
- 신청 데이터 API 전송

## 프로젝트 구조

```bash
.
├── index.html
├── README.md
├── js/
│   ├── index.js
│   ├── step1.js
│   └── subscription_main.js
├── pages/
│   ├── step1.html
│   └── subscription_main.html
├── style/
│   ├── index.css
│   ├── step1.css
│   └── subscription_main.css
└── img/
    ├── main/
    └── step1/
```

## 페이지 흐름

### 1. 메인 페이지 (`index.html`)
- Google Apps Script API에서 설정 데이터를 조회합니다.
- 소셜링 목록과 메인 이미지를 렌더링합니다.
- 소셜링 클릭 시 시간 선택 모달이 열립니다.

### 2. 상세 소개 페이지 (`pages/step1.html`)
- 선택한 소셜링의 상세 이미지를 표시합니다.
- `신청하기` 버튼 클릭 시 신청 폼 페이지로 이동합니다.

### 3. 신청 페이지 (`pages/subscription_main.html`)
- 7단계 폼으로 참가 정보를 입력받습니다.
- 입력값 검증 후 API로 신청 데이터를 전송합니다.

## 사용 기술

- HTML5
- CSS3
- Vanilla JavaScript
- Google Apps Script Web App API
- GitHub Pages

## API 연동

현재 프론트엔드에서 아래 Google Apps Script 엔드포인트를 직접 사용합니다.

```js
const API_URL = "https://script.google.com/macros/s/AKfycbwifS62IlXBVe-5-OS5HhcvioW2Dwfjyo-fBTjylrWZOeKFOxZ5lTIpY7KMXdOrBtQOtA/exec";
```

### GET 요청
메인 페이지 진입 시 아래 요청으로 설정 데이터를 불러옵니다.

```bash
GET ${API_URL}?type=config
```

예상 응답 예시:

```json
{
  "ok": true,
  "socialrings": [],
  "schedule": []
}
```

### POST 요청
신청 완료 시 아래 형태의 데이터를 전송합니다.

```json
{
  "socialring_id": "",
  "socialring_name": "",
  "schedule_id": "",
  "schedule_label": "",
  "nickname": "",
  "gender": "",
  "age": "",
  "job": "",
  "charm": "",
  "phone": "",
  "instagram": "",
  "deposit_confirm": "",
  "refund_bank": "",
  "refund_account": "",
  "refund_holder": "",
  "notice_confirm": "",
  "privacy_agree": ""
}
```

## 로컬 실행 방법

이 프로젝트는 빌드 과정이 없는 정적 웹 프로젝트입니다.  
아래처럼 간단한 로컬 서버로 실행할 수 있습니다.

### VS Code Live Server 사용
1. 프로젝트 폴더를 VS Code로 엽니다.
2. `index.html`에서 **Open with Live Server**를 실행합니다.

### Python 서버 사용

```bash
# 프로젝트 루트에서 실행
python3 -m http.server 5500
```

브라우저에서 아래 주소로 접속합니다.

```bash
http://localhost:5500
```

## GitHub Pages 배포

이 프로젝트는 **빌드 없이 배포 가능한 정적 사이트**이기 때문에 GitHub Pages에 바로 올릴 수 있습니다.

### 배포 방식
- `main` 브랜치 기준 정적 파일 배포
- 루트의 `index.html`을 시작 페이지로 사용
- `pages/`, `js/`, `style/`, `img/` 폴더를 그대로 함께 배포

### 배포 절차
1. 이 프로젝트를 GitHub 저장소에 push 합니다.
2. 저장소에서 **Settings → Pages**로 이동합니다.
3. **Build and deployment**에서 다음처럼 설정합니다.
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / `/ (root)`
4. 저장 후 배포가 완료되면 Pages URL이 발급됩니다.

예시:

```bash
https://{username}.github.io/{repository-name}/
```

### GitHub Pages 기준으로 잘 동작하는 이유
이 프로젝트는 HTML에서 CSS/JS를 **상대 경로**로 불러오고 있습니다.

예시:

```html
<link rel="stylesheet" href="./style/index.css" />
<script src="./js/index.js"></script>
```

하위 페이지도 상대 경로로 연결되어 있어 GitHub Pages 하위 경로 배포에 적합합니다.

```html
<link rel="stylesheet" href="../style/step1.css" />
<script src="../js/step1.js"></script>
```

즉, 별도의 번들러 설정이나 base path 설정 없이도 다음과 같은 구조에서 동작합니다.

```bash
/{repository-name}/
/{repository-name}/pages/step1.html
/{repository-name}/pages/subscription_main.html
```

### 배포 후 확인할 항목
- 메인 페이지 접속이 정상인지
- `pages/step1.html`, `pages/subscription_main.html` 이동이 정상인지
- 이미지 / CSS / JS가 404 없이 로드되는지
- Google Apps Script API 호출이 정상인지

### 주의사항
- GitHub Pages는 **정적 파일만 호스팅**하므로, 실제 데이터 처리는 현재처럼 외부 API(Google Apps Script)에서 담당해야 합니다.
- Google Apps Script 배포 권한 또는 CORS 설정이 맞지 않으면, Pages 배포 후 `fetch` 요청이 실패할 수 있습니다.
- 저장소명을 바꾸면 Pages 배포 URL도 함께 바뀌므로, 운영 문서에 반영이 필요합니다.
- 커스텀 도메인을 붙일 경우에도 프론트 구조는 그대로 유지할 수 있습니다.

## 주요 스크립트 설명

### `js/index.js`
- 설정 데이터 조회
- 메인 이미지 렌더링
- 소셜링 목록 렌더링
- 시간 선택 모달 제어
- 선택값을 쿼리스트링으로 다음 페이지에 전달

### `js/step1.js`
- 상세 이미지 로딩 처리
- 신청 페이지 이동 처리

### `js/subscription_main.js`
- 다단계 폼 상태 관리
- 입력값 검증
- 전화번호 포맷팅
- 공지사항 / 개인정보 동의 모달 처리
- 신청 데이터 제출

## 전달 데이터 방식

페이지 간 상태는 별도 상태관리 도구 없이 **URL 쿼리 파라미터**로 전달합니다.

예시:

```bash
pages/step1.html?socialring_id=...&schedule_id=...
```

## 개발 시 유의사항

- API URL이 프론트 코드에 하드코딩되어 있습니다.
- 백엔드 응답 필드명이 바뀌면 프론트 렌더링 로직도 함께 수정해야 합니다.
- 상세 이미지 키는 일부 예외 케이스를 고려해 여러 이름으로 탐색합니다.
  - `step1_img1`
  - `step1_image1`
  - `상세이미지1`
  - `소개이미지1`
- 현재 신청 페이지의 참가 시간 선택 영역은 정적 텍스트로 구성되어 있어, 실제 운영 데이터와 동기화가 필요한 경우 개선이 필요합니다.
- GitHub Pages는 서버 리다이렉트나 백엔드 라우팅이 없으므로, 현재처럼 **파일 기반 페이지 구조**를 유지하는 것이 안정적입니다.

## 개선 아이디어

- API URL 환경 분리
- 입력값 검증 강화
- 에러 메시지 및 사용자 피드백 개선
- 신청 완료 페이지 분리
- 시간 선택 / 금액 정보의 동적 렌더링
- 접근성 및 모바일 UX 개선
- GitHub Actions를 이용한 자동 배포 구성

## 배포

정적 파일만으로 구성되어 있어 다음과 같은 환경에 배포할 수 있습니다.

- GitHub Pages
- Netlify
- Vercel
- 사내 정적 호스팅 서버

단, Google Apps Script API의 CORS 및 배포 권한 설정이 올바르게 되어 있어야 정상 동작합니다.

## 라이선스

별도 라이선스가 정해지지 않았다면, 배포 전 프로젝트 목적에 맞는 라이선스를 추가해주세요.
