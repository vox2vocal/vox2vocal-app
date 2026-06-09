# Vox2Vocal 로그인/회원가입 QA 테스트 케이스

## 범위

- 대상 화면: `src/features/auth/login-screen.tsx`, `src/features/auth/signup-screen.tsx`
- 공통 UI: `src/features/auth/auth-components.tsx`
- 인증 연동: `src/features/auth/auth-session.ts`, `src/features/auth/graphql-client.ts`, `src/features/auth/token-storage.*.ts`, `src/features/auth/access-token-memory.ts`
- 제외 범위: 백엔드 인증 정책, 이메일 인증, 소셜 OAuth 실제 공급자 연동, 네이티브 스토어 암호화 구현 상세

## 테스트 환경

- 자동화: `jest-expo`, `@testing-library/react-native`
- 수동: iOS 시뮬레이터, Android 에뮬레이터, Expo web
- GraphQL 성공 응답 기본 fixture:
  - `accessToken`: 임의 문자열
  - `expiresIn`: `900`
  - `refreshToken`: native 저장 흐름 검증 시에만 포함
  - `user`: `id`, `email`, `displayName`, `role`

## 로그인 테스트 케이스

| ID             | 구분                     | 선행 조건                                | 절차                                                                               | 기대 결과                                                                                                                                | 자동화 |
| -------------- | ------------------------ | ---------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| AUTH-LOGIN-001 | 렌더링                   | 앱 첫 진입 또는 로그아웃 상태            | 로그인 화면을 연다.                                                                | 로고, 제목 `Vox2Vocal`, 이메일/비밀번호 입력, 로그인 버튼, 비밀번호 재설정, Google/Apple 버튼, 회원가입 링크가 보인다.                   | 후보   |
| AUTH-LOGIN-002 | 접근성                   | 로그인 화면 표시                         | 스크린 리더 또는 테스트 쿼리로 이메일/비밀번호 입력과 비밀번호 표시 버튼을 찾는다. | 입력 필드는 명확한 accessibility label/hint를 갖고, 비밀번호 표시 토글은 button role과 상태별 label을 제공한다.                          | 추가됨 |
| AUTH-LOGIN-003 | 필수값 validation        | 로그인 화면 표시                         | 이메일/비밀번호를 비운 채 로그인 버튼을 누른다.                                    | `이메일 주소를 입력해 주세요.`, `비밀번호를 입력해 주세요.`가 표시되고 GraphQL 요청은 발생하지 않는다.                                   | 추가됨 |
| AUTH-LOGIN-004 | 이메일 형식 validation   | 로그인 화면 표시                         | 이메일에 `user.example.com`, 비밀번호에 `password123` 입력 후 로그인한다.          | `올바른 이메일 형식으로 입력해 주세요.`가 표시되고 GraphQL 요청은 발생하지 않는다.                                                       | 후보   |
| AUTH-LOGIN-005 | 비밀번호 길이 validation | 로그인 화면 표시                         | 이메일에 정상 형식, 비밀번호에 7자 이하 입력 후 로그인한다.                        | `비밀번호는 8자 이상이어야 합니다.`가 표시되고 GraphQL 요청은 발생하지 않는다.                                                           | 후보   |
| AUTH-LOGIN-006 | 입력 수정 시 오류 해제   | validation 오류 표시 상태                | 오류가 난 필드에 값을 다시 입력한다.                                               | 해당 필드 오류와 form status 메시지가 사라진다.                                                                                          | 후보   |
| AUTH-LOGIN-007 | 성공 submit              | GraphQL `login` 성공 응답 준비           | 이메일 앞뒤 공백과 정상 비밀번호를 입력 후 로그인한다.                             | `login` mutation이 trim된 이메일과 비밀번호로 호출되고, access token memory와 session store가 인증 상태로 갱신되며 성공 메시지가 보인다. | 추가됨 |
| AUTH-LOGIN-008 | 인증 실패                | GraphQL `UNAUTHENTICATED` 오류 응답 준비 | 정상 형식 입력 후 로그인한다.                                                      | `이메일 또는 비밀번호를 확인해 주세요.`가 표시되고 인증 상태로 전환되지 않는다.                                                          | 추가됨 |
| AUTH-LOGIN-009 | 잘못된 입력 서버 오류    | GraphQL `BAD_USER_INPUT` 오류 응답 준비  | 정상 형식 입력 후 로그인한다.                                                      | `입력한 정보를 다시 확인해 주세요.`가 표시된다.                                                                                          | 후보   |
| AUTH-LOGIN-010 | 네트워크/알 수 없는 오류 | fetch reject 또는 비표준 오류 준비       | 정상 형식 입력 후 로그인한다.                                                      | `인증 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.`가 표시된다.                                                               | 후보   |
| AUTH-LOGIN-011 | pending 상태             | 느린 GraphQL 응답 준비                   | 로그인 버튼을 누른 직후 버튼 상태를 확인한다.                                      | 버튼은 busy/disabled 상태가 되고 label은 `확인 중`으로 바뀌어 중복 제출을 막는다.                                                        | 후보   |
| AUTH-LOGIN-012 | 비밀번호 표시 토글       | 비밀번호 입력                            | 비밀번호 표시 버튼을 누른다.                                                       | `secureTextEntry`가 꺼지고 토글 label이 `비밀번호 숨기기`로 바뀐다. 다시 누르면 원복된다.                                                | 추가됨 |
| AUTH-LOGIN-013 | 보조 액션                | 로그인 화면 표시                         | `비밀번호를 잊으셨나요?`, Google, Apple 버튼을 각각 누른다.                        | 현재 단계 안내 메시지가 표시되고 validation 오류는 초기화된다.                                                                           | 후보   |
| AUTH-LOGIN-014 | 회원가입 이동            | 로그인 화면 표시                         | `회원가입` 링크를 누른다.                                                          | `/signup` 라우트로 이동한다.                                                                                                             | 후보   |

## 회원가입 테스트 케이스

| ID              | 구분                     | 선행 조건                               | 절차                                                         | 기대 결과                                                                                                                               | 자동화 |
| --------------- | ------------------------ | --------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| AUTH-SIGNUP-001 | 렌더링                   | `/signup` 진입                          | 회원가입 화면을 연다.                                        | 제목 `회원가입`, 이름/이메일/비밀번호/비밀번호 확인 입력, 약관 체크박스, 가입하기 버튼, 로그인 링크가 보인다.                           | 후보   |
| AUTH-SIGNUP-002 | 접근성                   | 회원가입 화면 표시                      | 체크박스와 입력 필드를 접근성 쿼리로 찾는다.                 | 약관은 checkbox role과 checked state를 제공하고 입력 필드는 명확한 label/hint를 갖는다.                                                 | 추가됨 |
| AUTH-SIGNUP-003 | 약관 미동의 상태         | 회원가입 화면 표시                      | 약관을 체크하지 않고 가입하기 버튼 상태를 확인한다.          | 가입하기 버튼이 disabled 상태이며 GraphQL 요청이 발생하지 않는다.                                                                       | 추가됨 |
| AUTH-SIGNUP-004 | 필수값 validation        | 약관 체크 완료                          | 모든 입력을 비운 채 가입하기를 누른다.                       | 이름, 이메일, 비밀번호, 비밀번호 확인 필수 오류가 표시되고 GraphQL 요청은 발생하지 않는다.                                              | 추가됨 |
| AUTH-SIGNUP-005 | 이메일 형식 validation   | 약관 체크 완료                          | 이메일에 `user.example.com`, 나머지는 정상 입력 후 가입한다. | `올바른 이메일 형식으로 입력해 주세요.`가 표시되고 GraphQL 요청은 발생하지 않는다.                                                      | 후보   |
| AUTH-SIGNUP-006 | 비밀번호 길이 validation | 약관 체크 완료                          | 비밀번호/확인에 7자 이하를 입력 후 가입한다.                 | `비밀번호는 8자 이상이어야 합니다.`가 표시되고 GraphQL 요청은 발생하지 않는다.                                                          | 후보   |
| AUTH-SIGNUP-007 | 비밀번호 불일치          | 약관 체크 완료                          | 비밀번호와 확인값을 다르게 입력 후 가입한다.                 | `비밀번호가 서로 일치하지 않습니다.`가 표시되고 GraphQL 요청은 발생하지 않는다.                                                         | 추가됨 |
| AUTH-SIGNUP-008 | 성공 submit              | GraphQL `signUp` 성공 응답 준비         | 이름/이메일 앞뒤 공백, 정상 비밀번호, 약관 동의 후 가입한다. | `signUp` mutation이 trim된 `displayName`, trim된 이메일, 비밀번호로 호출되고 session store가 인증 상태로 갱신되며 성공 메시지가 보인다. | 추가됨 |
| AUTH-SIGNUP-009 | 서버 입력 오류           | GraphQL `BAD_USER_INPUT` 오류 응답 준비 | 이미 가입된 이메일 등 서버 오류 조건으로 가입한다.           | `입력한 정보를 다시 확인해 주세요.`가 표시되고 인증 상태로 전환되지 않는다.                                                             | 후보   |
| AUTH-SIGNUP-010 | 네트워크/알 수 없는 오류 | fetch reject 또는 비표준 오류 준비      | 정상 입력 후 가입한다.                                       | `인증 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.`가 표시된다.                                                              | 후보   |
| AUTH-SIGNUP-011 | pending 상태             | 느린 GraphQL 응답 준비                  | 가입하기를 누른 직후 버튼 상태를 확인한다.                   | 버튼은 busy/disabled 상태가 되고 label은 `확인 중`으로 바뀌어 중복 제출을 막는다.                                                       | 후보   |
| AUTH-SIGNUP-012 | 비밀번호 표시 토글       | 비밀번호와 확인 입력                    | 각 표시 버튼을 누른다.                                       | 해당 필드의 `secureTextEntry`와 토글 label이 독립적으로 전환된다.                                                                       | 후보   |
| AUTH-SIGNUP-013 | 로그인 이동              | 회원가입 화면 표시                      | `로그인` 링크를 누른다.                                      | `/` 라우트로 이동한다.                                                                                                                  | 후보   |

## Auth Session 연동 테스트 케이스

| ID               | 구분                  | 선행 조건                           | 절차                                               | 기대 결과                                                                                                    | 자동화    |
| ---------------- | --------------------- | ----------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | --------- |
| AUTH-SESSION-001 | access token 저장     | `login` 성공 응답                   | 로그인 mutation을 호출한다.                        | `accessTokenMemory`에 access token이 저장된다.                                                               | 기존      |
| AUTH-SESSION-002 | session store 갱신    | `login` 또는 `signUp` 성공 응답     | 화면에서 submit한다.                               | `isAuthenticated=true`, `user.email`이 응답값으로 갱신된다.                                                  | 추가됨    |
| AUTH-SESSION-003 | refresh token 저장    | native 환경, refreshToken 포함 응답 | 로그인/회원가입 성공 후 storage 값을 확인한다.     | refresh token이 native secure storage abstraction에 저장된다.                                                | 후보      |
| AUTH-SESSION-004 | 인증 오류 메시지 매핑 | GraphQL error code별 응답 준비      | 화면 submit 또는 `getAuthErrorMessage`를 호출한다. | `BAD_USER_INPUT`, `UNAUTHENTICATED`, `TOKEN_REUSE_DETECTED`, unknown 오류가 정의된 한국어 메시지로 표시된다. | 일부 추가 |
| AUTH-SESSION-005 | logout 정리           | 인증 상태                           | logout을 호출한다.                                 | access token, session store, refresh token이 정리된다.                                                       | 기존      |
| AUTH-SESSION-006 | refresh 중복 방지     | concurrent `UNAUTHENTICATED` 응답   | 여러 요청을 동시에 호출한다.                       | refresh handler는 1회만 실행되고 재시도 요청은 새 access token을 사용한다.                                   | 기존      |

## 수동 QA 체크리스트

- iOS, Android, web에서 키보드가 열린 상태로 마지막 입력/버튼이 가려지지 않는지 확인한다.
- 작은 화면에서 로고, 제목, 필드, 에러 텍스트, 버튼 텍스트가 겹치거나 잘리지 않는지 확인한다.
- 스크린 리더에서 입력 필드, 비밀번호 토글, 약관 체크박스, CTA, 링크의 순서와 이름이 자연스러운지 확인한다.
- 비밀번호 입력값이 기본적으로 숨김 처리되고, 토글 전환 후 다시 숨김으로 되돌릴 수 있는지 확인한다.
- 서버 오류, 네트워크 오류, 느린 응답에서 버튼 pending/disabled 상태와 메시지가 중복 노출되지 않는지 확인한다.
- web에서 selection style 주입이 중복되거나 페이지 이탈 후 남지 않는지 확인한다.

## 현재 QA 리스크

- 회원가입의 약관 오류 문구는 validation 함수에 있으나 CTA가 약관 미동의 상태에서 disabled라 일반 사용자 흐름으로는 해당 오류가 노출되지 않는다. 현재 UX는 disabled state로 미동의를 막는 방식이며, 오류 문구 노출이 요구사항이면 CTA 활성 정책을 재검토해야 한다.
- 소셜 로그인과 비밀번호 재설정은 현재 안내 메시지만 표시되므로 실제 OAuth/재설정 플로우가 연결될 때 별도 통합 테스트가 필요하다.
- 라우트 이동은 링크 렌더링까지만 확인 대상이며, Expo Router navigation stack 검증은 별도 라우팅 테스트에서 다루는 편이 적절하다.
- refresh token native 저장은 기존 storage 단위 테스트와 auth-session 성공 흐름의 조합으로 간접 커버된다. 실제 SecureStore/MMKV 통합은 디바이스 QA가 필요하다.
