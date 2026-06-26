# Family Hub Cloud MVP

이 버전은 컴퓨터를 계속 켜두지 않아도 엄마/아빠가 핸드폰에서 사용할 수 있는 클라우드 MVP입니다.

구조:

- 화면: React + Vite
- 배포: Vercel
- 데이터 저장: Supabase Postgres JSONB
- AI 다듬기/번역: Vercel API 함수가 Claude API 호출
- 가족 보호: FAMILY_ID + FAMILY_PIN

## 1. Supabase 만들기

1. supabase.com 가입
2. New project 클릭
3. 프로젝트 이름 예: familyhub
4. 비밀번호 저장
5. 프로젝트 생성 완료까지 기다리기

## 2. Supabase 테이블 만들기

Supabase 왼쪽 메뉴에서 SQL Editor 클릭 후 아래 SQL 실행:

```sql
create table if not exists public.family_states (
  family_id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
```

주의: 이 MVP는 Vercel 서버 함수가 service role key로 접근하므로, 브라우저에 service role key가 노출되지 않습니다.

## 3. Supabase 키 복사

Supabase에서 Project Settings -> API로 이동해서 아래 2개를 복사합니다.

- Project URL = SUPABASE_URL
- service_role secret key = SUPABASE_SERVICE_ROLE_KEY

service_role key는 절대 브라우저 코드에 넣지 말고 Vercel Environment Variables에만 넣으세요.

## 4. GitHub에 코드 올리기

이 폴더를 GitHub 새 저장소에 올립니다.

가장 쉬운 방법:

1. github.com 접속
2. New repository 클릭
3. 이름 예: familyhub-cloud-mvp
4. Create repository
5. Add file -> Upload files
6. 이 폴더 안의 파일 전체 업로드
7. Commit changes

## 5. Vercel에 배포

1. vercel.com 가입 또는 로그인
2. Add New Project 클릭
3. GitHub 연결
4. 방금 만든 familyhub-cloud-mvp 선택
5. Framework Preset은 Vite로 자동 인식됨
6. Environment Variables에 아래 값 입력

필수:

- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- FAMILY_ID
- FAMILY_PIN

AI까지 쓰려면 추가:

- ANTHROPIC_API_KEY
- CLAUDE_MODEL

예시:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ....
FAMILY_ID=woori-family
FAMILY_PIN=123456
ANTHROPIC_API_KEY=sk-ant-xxxx
CLAUDE_MODEL=claude-3-5-sonnet-latest
VITE_FAMILY_ID=woori-family
```

7. Deploy 클릭

## 6. 핸드폰에서 사용

배포가 끝나면 Vercel 주소가 생깁니다.

예:

```text
https://familyhub-cloud-mvp.vercel.app
```

엄마 핸드폰과 아빠 핸드폰에서 같은 주소로 접속합니다.

처음 접속하면 입력:

- 가족 ID: Vercel에 넣은 FAMILY_ID
- 가족 PIN: Vercel에 넣은 FAMILY_PIN

엄마 폰은 엄마 선택, 아빠 폰은 아빠 선택.

이제 같은 데이터를 봅니다.

## 7. 홈 화면에 앱처럼 추가

### iPhone

Safari로 접속 -> 공유 버튼 -> 홈 화면에 추가

### Android

Chrome으로 접속 -> 점 세 개 메뉴 -> 홈 화면에 추가 또는 앱 설치

## 8. 데이터 저장 확인

마음한마디를 하나 작성하고 새로고침하세요.

남아 있으면 Supabase에 저장 성공입니다.

엄마 폰에서 작성한 뒤 아빠 폰에서 2~3초 기다리거나 새로고침하면 보입니다.

## 9. 중요한 주의사항

이 버전은 MVP입니다.

가능:

- 컴퓨터 꺼도 사용 가능
- 핸드폰 접속 가능
- 엄마/아빠 데이터 공유 가능
- 데이터 저장 가능
- AI 키 넣으면 다듬기/번역 가능

아직 아님:

- 완전한 회원가입/로그인
- 내니 권한 제한
- 앱스토어 출시
- 의료/법적 문서 보안 수준

가족끼리 시험 사용하는 MVP로 먼저 쓰고, 다음 단계에서 Supabase Auth 로그인과 권한 관리를 붙이면 됩니다.
