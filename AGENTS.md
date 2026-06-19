# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

## Styling Standard

The App styling standard is NativeWind + React Native Reusables style ownership.

- Use NativeWind className for new shared UI and screen publishing work.
- Use `src/shared/ui` for shadcn-like open-code primitives.
- Use `class-variance-authority` for variants and `src/shared/lib/cn.ts` for class merging.
- Keep Web/Admin shadcn/ui components separate from App components. Do not import `vox2vocal-admin` or `vox2vocal-design-kit` UI code into the App.
- React Native Reusables is a registry/CLI pattern, not a runtime package. When adopting a registry component, copy it into `src/shared/ui` and adapt it to Vox2Vocal tokens.
- Platform-specific behavior belongs in `*.native.tsx` and `*.web.tsx` files.
- Do not add Tamagui components or Tamagui config back into the App.
- Legacy `StyleSheet` code may remain only while being migrated. New or meaningfully changed UI should use NativeWind primitives.

## App Source Structure

- `src/shared/ui`: NativeWind 기반 공통 UI primitive를 둔다.
- `src/shared/lib`: `cn` 같은 UI/플랫폼 공통 유틸을 둔다.
- `src/shared/tokens`: App 런타임에서 필요한 Vox2Vocal 토큰의 source of truth를 둔다.
- `src/features/<feature>/ui`: 화면 또는 기능 전용 조합 컴포넌트를 둔다.
- `src/design-system/**`: 과거 import 호환을 위한 deprecated bridge만 허용한다. 새 코드는 이 경로를 import하지 않는다.

## Native Dependency Policy

- `react-native-mmkv`는 세션 메타데이터 저장소에서 사용한다.
- `react-native-mmkv@4.x`는 `react-native-nitro-modules`를 peer dependency로 요구하므로 `react-native-nitro-modules`는 삭제하지 않는다.
- unused dependency를 제거하기 전에는 `rg`, `npm ls`, `npm run verify`로 import 여부와 네이티브 peer dependency 여부를 모두 확인한다.

## Task-Based Work

For large or multi-step work, split the work into small task units before editing. Each task should have one clear purpose, one validation target, and one commit message.

Default task flow:

1. Define the task scope.
2. Implement only the files needed for that task.
3. Run `npm run verify`.
4. Review `git status --short` and ensure only intentional files are included.
5. Commit the completed task automatically when verification passes.

Use the Vox2Vocal Git policy for task commits. Work on a ticket branch, open a PR, and include the ticket in every commit message:

- `feat(scope): [V2V-123] 사용자 기능 추가`
- `fix(scope): [V2V-123] 잘못된 동작 수정`
- `chore(scope): [V2V-123] 도구 또는 설정 업데이트`
- `docs(scope): [V2V-123] 문서 업데이트`
- `test(scope): [V2V-123] 테스트 추가 또는 수정`
- `refactor(scope): [V2V-123] 동작 변경 없는 구조 개선`

Do not combine unrelated tasks in one commit. If `npm run verify` fails, fix the failure before committing unless the user explicitly asks to commit a failing state.
