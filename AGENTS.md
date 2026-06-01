# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

## Task-Based Work

For large or multi-step work, split the work into small task units before editing. Each task should have one clear purpose, one validation target, and one commit message.

Default task flow:

1. Define the task scope.
2. Implement only the files needed for that task.
3. Run `npm run verify`.
4. Review `git status --short` and ensure only intentional files are included.
5. Commit the completed task automatically when verification passes.

Use Conventional Commits for task commits, but write the commit message description in Korean:

- `feat(scope): 사용자 기능 추가`
- `fix(scope): 잘못된 동작 수정`
- `chore(scope): 도구 또는 설정 업데이트`
- `docs(scope): 문서 업데이트`
- `test(scope): 테스트 추가 또는 수정`
- `refactor(scope): 동작 변경 없는 구조 개선`

Do not combine unrelated tasks in one commit. If `npm run verify` fails, fix the failure before committing unless the user explicitly asks to commit a failing state.
