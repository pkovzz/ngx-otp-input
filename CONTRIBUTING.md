# Contributing

Thanks for your interest in contributing to `ngx-otp-input`.
This guide explains how to set up the project, run checks, and submit a pull request.

## Before you start

- Be respectful and follow the project's [Code of Conduct](./CODE_OF_CONDUCT.md).
- Search existing issues and pull requests to avoid duplicate work.
- Open an issue before large changes so maintainers can align on direction.

## Development setup

1. [Fork the repository](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) and clone your fork.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the library in watch mode:

   ```bash
   npm run build-lib-watch
   ```

4. In a second terminal, start the demo app:

   ```bash
   npm run start
   ```

The demo app is the fastest way to manually validate OTP behavior and UI changes.

## Quality checks

Run these before opening a pull request:

```bash
npm run lint-lib
npm run test-lib
```

For CI-like test execution:

```bash
npm run test-lib:ci
```

## Pull request process

1. Create a branch from the current target branch (for example, `v2.0.0`).
2. Keep your change focused and include tests when behavior changes.
3. Update documentation for any public API changes.
4. Update `CHANGELOG.md` when your change affects users.
5. Commit with a clear message and push to your fork.
6. Open a pull request with:
   - what changed
   - why it changed
   - how it was tested
   - screenshots or recordings for UI changes (if applicable)

## Release checklist

Before creating a GitHub Release, make sure the demo and package are both release-ready:

1. Update `CHANGELOG.md` and move release notes out of `Unreleased`.
2. Ensure `projects/ngx-otp-input/package.json` has the target version.
3. Run the full release build:

   ```bash
   npm run build:release
   ```

4. Run library checks:

   ```bash
   npm run lint-lib
   npm run test-lib:ci
   ```

5. Create a release tag that matches the library version (`vX.Y.Z`).

The publish workflow validates this tag/version match before publishing to npm.

## Commit guidance

- Use concise, descriptive commit messages.
- Prefer one logical change per commit.
- Avoid unrelated formatting-only changes unless they are part of the same scope.

## Reporting issues

When opening an issue, include:

- Angular version
- `ngx-otp-input` version
- browser/OS
- reproduction steps
- expected vs actual behavior

## Need help?

Open an issue and provide as much context as possible. We are happy to help.
