# Abyul Platform

Expo + React Native Web + Tamagui 기반의 현대적인 크로스플랫폼 앱 프로젝트입니다. 하나의 TypeScript 코드베이스에서 iOS, Android, Web을 함께 개발하는 구성을 기본값으로 둡니다.

## 기술 스택

| 영역 | 선택 기술 | 역할 |
|---|---|---|
| 앱 프레임워크 | Expo SDK 56 | React Native 앱 개발, 실행, 빌드 기반 |
| UI 런타임 | React Native 0.85, React 19 | iOS, Android 네이티브 UI 및 React 렌더링 |
| 언어 | TypeScript 6 | 정적 타입, IDE 지원, 안정적인 리팩터링 |
| 웹 지원 | React Native Web, React DOM, Metro | 같은 RN 컴포넌트를 웹에서도 실행 |
| 라우팅 | Expo Router | 파일 기반 라우팅과 딥링크 기반 구조 |
| 내비게이션 | React Navigation | Expo Router 내부 내비게이션 기반 |
| 스타일링/디자인 시스템 | Tamagui v2 | 네이티브/웹 공통 UI, 토큰, 테마, 반응형 스타일 |
| Tamagui 최적화 | @tamagui/babel-plugin, @tamagui/metro-plugin | 컴파일 최적화와 Metro 통합 |
| 서버 상태 | TanStack Query | API 데이터 캐싱, 재시도, stale 관리 |
| 클라이언트 상태 | Zustand | 앱 내부 전역 상태 관리 |
| 폼/검증 | React Hook Form, Zod | 폼 상태와 스키마 검증 |
| 로컬 저장소 | react-native-mmkv | 네이티브 고성능 key-value 저장소 |
| 웹 저장소 | localStorage adapter | 웹 플랫폼용 Zustand persist 저장소 |
| 모니터링 | Sentry React Native | 오류 수집 및 성능 추적 준비 |
| 리스트 성능 | FlashList | 대량 리스트 렌더링 최적화 |
| 애니메이션 | Reanimated | 네이티브 스레드 기반 애니메이션 |
| 제스처 | Gesture Handler | 네이티브 제스처 처리 |
| 테스트 | Jest Expo, Testing Library | 컴포넌트 테스트 |
| 품질 도구 | Expo ESLint, Prettier | 린트와 코드 포맷팅 |

## 프로젝트 구조

```txt
.
├─ app/
│  ├─ _layout.tsx          # Tamagui, React Query, Sentry, Navigation Provider
│  └─ index.tsx            # 크로스플랫폼 홈 화면
├─ src/
│  ├─ providers/
│  │  └─ query-provider.tsx
│  └─ stores/
│     └─ session-store.ts  # Zustand + MMKV/localStorage persist
├─ __tests__/
│  └─ home.test.tsx
├─ assets/
├─ app.json                # Expo 앱 설정, New Architecture, Web Metro
├─ babel.config.js         # Expo + Tamagui + Reanimated Babel 설정
├─ metro.config.js         # Expo Metro + Tamagui Metro plugin
├─ tamagui.config.ts       # Tamagui v5 기본 토큰/테마 설정
├─ tamagui.build.ts        # Tamagui CSS/컴파일 설정
├─ tsconfig.json           # strict TypeScript 및 alias
└─ package.json
```

## 실행 방법

의존성은 이미 설치되어 있습니다.

```bash
npm run start
```

웹 실행:

```bash
npm run web
```

Android 실행:

```bash
npm run android
```

iOS 실행:

```bash
npm run ios
```

Windows 환경에서 iOS 네이티브 빌드는 직접 수행할 수 없으므로 Expo Go, EAS Build, 또는 macOS 빌드 환경을 사용해야 합니다.

## 품질 확인

```bash
npm run typecheck
npm run lint
npm run test
```

## 주요 설계 기준

- Expo-first 구성을 기본으로 하여 네이티브 빌드 복잡도를 낮춥니다.
- React Native Web을 포함하여 모바일 앱과 웹 앱을 같은 컴포넌트 모델로 개발합니다.
- Tamagui를 통해 토큰, 테마, 반응형 스타일을 한 곳에서 관리합니다.
- TanStack Query와 Zustand를 분리해 서버 상태와 클라이언트 상태를 혼합하지 않습니다.
- Expo Router를 사용해 웹 URL, 딥링크, 네이티브 화면 구조를 함께 관리합니다.
- `newArchEnabled`를 활성화해 최신 React Native New Architecture 방향에 맞춥니다.
- Sentry DSN은 `app.json`의 `extra.sentryDsn` 또는 환경별 설정으로 연결할 수 있도록 비워둡니다.

## 다음 작업 후보

1. 인증 공급자 선택: Supabase, Clerk, Auth0, 자체 OAuth/OIDC
2. API 클라이언트 추가: fetch wrapper, ky, axios 중 선택
3. 디자인 토큰 확장: 브랜드 컬러, spacing, typography
4. EAS 설정 추가: `eas.json`, development/preview/production profile
5. Maestro 또는 Detox 기반 E2E 테스트 추가
