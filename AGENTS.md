# Repository Guidelines

Whatever action you can do yourself, Please do yourself, this includes starting apps and verification.

Do not use the Sites skill.

## Project Structure & Module Organization

This course workspace is currently minimal; add new work in clearly named assignment or project directories rather than at the repository root. Within each unit, keep implementation in `src/`, automated checks in `tests/`, and non-code inputs or rendered output in `assets/`. For example:

```text
project1/
  src/
  tests/
  assets/
```

Keep third-party, single-file libraries next to the component that uses them and document their source and version. Do not commit generated binaries, build directories, IDE metadata, or large render outputs unless they are required deliverables.

## Build, Test, and Development Commands

There is no repository-wide build system or test runner yet. Each project that introduces one must include a local `README.md` with exact setup and execution commands. Prefer conventional entry points so contributors can discover workflows quickly, such as:

- `make build` — compile the current project.
- `make test` — run its complete automated test suite.
- `make clean` — remove generated artifacts.

Run commands from the project directory, not from the workspace root. When adding a build script, keep dependencies explicit and avoid machine-specific absolute paths.

## Coding Style & Naming Conventions

Follow the formatter standard for the language used and commit its configuration with the project. Use 4-space indentation for C++, Java, and Python; never mix tabs and spaces. Name classes and C++ types in `PascalCase`, functions and variables in `camelCase`, and constants in `UPPER_SNAKE_CASE`. Give shaders, assets, and tests descriptive names such as `oil_paint.frag` or `ArithmeticTest.java`.

## Testing Guidelines

Place tests under the corresponding `tests/` directory and mirror the source layout. Name test files after the unit under test. Cover normal behavior, boundary cases, invalid input, and resource-loading failures. Before submitting, run the documented test command and manually verify graphical output when visual behavior changes.

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries, sometimes prefixed by the assignment (for example, `lab01: Complete Arithmetic.java`). Continue that pattern and keep each commit focused. Pull requests should explain the change, list verification performed, link the relevant task, and include before/after screenshots for visual changes. Avoid committing unrelated course work in the same pull request.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
