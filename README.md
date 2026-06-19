# Vox2Vocal

Expo + React Native Web + NativeWind 기반의 크로스플랫폼 앱 프로젝트입니다. 하나의 TypeScript 코드베이스에서 iOS, Android, Web을 함께 개발하는 구성을 기본값으로 둡니다.

## 기술 스택

| 영역                   | 선택 기술                                   | 역할                                         |
| ---------------------- | ------------------------------------------- | -------------------------------------------- |
| 앱 프레임워크          | Expo SDK 56                                 | React Native 앱 개발, 실행, 빌드 기반        |
| UI 런타임              | React Native 0.85, React 19                 | iOS, Android 네이티브 UI 및 React 렌더링     |
| 언어                   | TypeScript 6                                | 정적 타입, IDE 지원, 안정적인 리팩터링       |
| 웹 지원                | React Native Web, React DOM, Metro          | 같은 RN 컴포넌트를 웹에서도 실행             |
| 라우팅                 | Expo Router                                 | 파일 기반 라우팅과 네이티브 기반 구조        |
| 내비게이션             | React Navigation                            | Expo Router 내부 내비게이션 기반             |
| 스타일링/디자인 시스템 | NativeWind, Tailwind CSS v3                 | RN/Web 공통 className 스타일, 토큰, variant  |
| App UI primitive       | React Native Reusables 방식의 소유 컴포넌트 | `src/shared/ui` 기반 shadcn-like RN 컴포넌트 |
| 서버 상태              | TanStack Query                              | API 데이터 캐싱, 재시도, stale 관리          |
| 클라이언트 상태        | Zustand                                     | 앱 내부 전역 상태 관리                       |
| 폼 검증                | React Hook Form, Zod                        | 폼 상태와 스키마 검증                        |
| 로컬 저장소            | react-native-mmkv                           | 네이티브 고성능 key-value 저장소             |
| 모니터링               | Sentry React Native                         | 오류 수집 및 성능 추적 준비                  |
| 리스트 성능            | FlashList                                   | 대형 리스트 렌더링 최적화                    |
| 애니메이션             | Reanimated, react-native-worklets           | 네이티브 스레드 기반 애니메이션              |
| 제스처                 | Gesture Handler                             | 네이티브 제스처 처리                         |
| 테스트                 | Jest 29, Jest Expo, Testing Library         | 단위/컴포넌트 테스트                         |
| 코드 품질              | Expo ESLint, Prettier                       | 린트와 코드 포맷                             |
| RN 린트 규칙           | eslint-plugin-react-native                  | React Native 전용 안티패턴 검사              |
| 접근성 린트            | eslint-plugin-react-native-a11y             | RN 컴포넌트 접근성 규칙                      |
| Import 정리            | simple-import-sort, unused-imports          | import 정렬과 미사용 import 제거             |
| Prettier 충돌 방지     | eslint-config-prettier                      | ESLint와 Prettier 규칙 충돌 제거             |

## 프로젝트 구조

```txt
.
├─ app/
│  ├─ _layout.tsx          # NativeWind CSS, React Query, Sentry, Navigation Provider
│  ├─ index.tsx            # 로그인 화면 route
│  └─ signup.tsx           # 회원가입 화면 route
├─ src/
│  ├─ design-system/
│  │  ├─ components/       # App 공통 UI primitive
│  │  ├─ tokens/           # colors, typography, effects, layout, spacing, radius
│  │  └─ tokens.ts         # 기존 import 호환용 token barrel
│  ├─ features/
│  │  └─ auth/
│  │     ├─ auth-components.tsx  # 디자인 시스템 auth primitive facade
│  │     ├─ login-screen.tsx
│  │     └─ signup-screen.tsx
│  ├─ providers/
│  │  └─ query-provider.tsx
│  ├─ shared/
│  │  ├─ lib/
│  │  │  └─ cn.ts          # NativeWind class 병합
│  │  └─ ui/               # React Native Reusables 스타일 open-code primitive
│  └─ stores/
│     └─ session-store.ts  # Zustand + MMKV/localStorage persist
├─ __mocks__/
│  └─ react-native-mmkv.ts
├─ __tests__/
│  └─ session-store.test.ts
├─ assets/
│  ├─ logo.png             # 원본 브랜드 이미지
│  ├─ brand-icon.png       # 정사각 아이콘 파생 자산
│  └─ brand-mark.png       # 인증 UI용 투명 배경 브랜드 마크
├─ app.json
├─ babel.config.js
├─ eslint.config.js
├─ jest.config.js
├─ metro.config.js
├─ tailwind.config.js
├─ global.css
├─ nativewind-env.d.ts
└─ package.json
```

## 실행 방법

```bash
npm run start
npm run web
npm run android
npm run ios
```

Windows 환경에서 iOS 네이티브 빌드는 직접 수행할 수 없으므로 Expo Go, EAS Build, 또는 macOS 빌드 환경을 사용해야 합니다.

## 로컬 인증 연동

로컬 App에서 로그인/회원가입을 테스트하려면 BFF를 Mac의 `localhost:4000`으로 먼저 열어야 합니다.

```bash
kubectl port-forward -n vox2vocal svc/bff-server 4000:4000
```

그 다음 App을 실행합니다.

```bash
npm run web
npm run ios
npm run android
```

기본 BFF endpoint는 Web/iOS에서 `http://localhost:4000/graphql`, Android emulator에서 `http://10.0.2.2:4000/graphql`입니다. 별도 주소를 사용할 때는 `EXPO_PUBLIC_BFF_GRAPHQL_URL`로 명시합니다.

Android emulator에서 기존 JS bundle이 `localhost:4000`을 바라보는 경우에는 다음 설정도 필요합니다.

```bash
adb reverse tcp:4000 tcp:4000
adb reverse --list
```

Web에서 `Origin not allowed`가 발생하면 브라우저 주소가 `localhost`인지 `127.0.0.1`인지, 포트가 `8081`, `8090`, `19006` 중 어떤 값인지 확인합니다. 자세한 점검 절차는 `../vox2vocal-docs/infra/local-run-guide.md`의 macOS App 인증 연동 섹션을 따릅니다.

## 품질 확인

```bash
npm run typecheck
npm run lint
npm run format:check
npm run test
```

자동 수정:

```bash
npm run lint:fix
npm run format
```

ESLint는 `eslint-config-expo/flat`을 기반으로 하며 React Native 전용 규칙, 접근성 규칙, import 정렬, 미사용 import 제거 규칙을 추가로 적용합니다. Prettier는 ESLint와 분리해 실행하고, `eslint-config-prettier`로 포맷 규칙 충돌을 제거합니다.

## 주요 설계 기준

- Expo-first 구성을 기본으로 하여 네이티브 빌드 복잡도를 낮춥니다.
- React Native Web을 포함하여 모바일 앱과 웹앱을 같은 컴포넌트 모델로 개발합니다.
- 프론트엔드 아키텍처 기준은 `../vox2vocal-docs/frontend/architecture.md`를 따릅니다.
- 디자인 기준은 `../vox2vocal-docs/frontend/design-system-guide.md`, `../vox2vocal-design-kit/docs/app-integration-guide.md`, `src/design-system`을 따릅니다.
- 브랜드 컬러는 블랙/레드 네온 톤을 기본으로 하며, 인증 화면은 `src/design-system/components/auth-primitives.tsx` 공통 컴포넌트를 재사용합니다.
- App 화면에 새 UI 상태나 컴포넌트 변형이 추가되면 `../vox2vocal-design-kit`의 갤러리와 토큰 문서도 함께 업데이트합니다.
- 새 App UI는 NativeWind className과 `src/shared/ui` primitive를 우선 사용합니다.
- React Native Reusables는 런타임 패키지가 아니라 registry/CLI 기반 open-code 패턴으로 취급하며, 가져온 컴포넌트는 `src/shared/ui`에 소유 코드로 관리합니다.
- 관리자/디자인 키트의 shadcn/ui 코드를 App으로 직접 import하지 않습니다.
- TanStack Query와 Zustand를 분리해 서버 상태와 클라이언트 상태를 결합하지 않습니다.
- Expo Router를 사용해 URL, 네이티브 화면 구조를 함께 관리합니다.
- `newArchEnabled`를 활성화해 최신 React Native New Architecture 방향에 맞춥니다.

## 다음 작업 후보

1. 인증 공급자 선택: Supabase, Clerk, Auth0, 자체 OAuth/OIDC
2. API 클라이언트 추가: fetch wrapper, ky, axios 중 선택
3. 디자인 토큰 수렴: 현재 `src/design-system/tokens` 기준을 NativeWind config와 design-kit token으로 동기화
4. EAS 설정 추가: `eas.json`, development/preview/production profile
5. Maestro 또는 Detox 기반 E2E 테스트 추가
