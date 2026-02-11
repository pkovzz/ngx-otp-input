# AGENTS.md — AI / LLM Agent Instructions for ngx-otp-input

## Purpose

This document instructs AI agents (LLMs, coding assistants, automated reviewers) on behavior, quality expectations, and best practices when generating, modifying, or reviewing code and documentation for the **ngx-otp-input** Angular library.

Agents must prioritize correctness, maintainability, accessibility, and alignment with modern Angular standards.

---

## Project Overview

**ngx-otp-input** is a lightweight Angular library that provides a customizable OTP (one-time password) input component.

Project characteristics:

- Angular library (published and consumed as a package)
- Uses **standalone components** (Angular 14+)
- Strong focus on:
  - Reusability
  - Accessibility
  - Type safety
  - Minimal API surface
- Designed to be framework-idiomatic and easy to integrate

The project also includes a **demo site** that showcases the library.
Agents must keep the demo site **pleasant, modern, and approachable**, and ensure
users can easily try out the full capabilities of the published library.

---

## Demo Site Requirements

The demo site must:

- Look modern, clean, and visually cohesive
- Be responsive and accessible
- Highlight real-world usage of the library
- Provide interactive controls to try configuration options
- Showcase keyboard behavior and focus management
- Use the published library API (not internal/private helpers)
- Include concise guidance so users can self-serve
- Use the frontend-design and web-design skills when available

Avoid:

- Visual clutter or excessive animation
- Non-essential dependencies
- Custom hacks that diverge from library usage

---

## Agent Behavior Rules

### Core Principles

Agents must:

- Generate **valid, buildable Angular code**
- Follow **Angular official best practices**
- Respect the existing project structure and conventions
- Prefer **clarity over cleverness**
- Minimize breaking changes
- Assume the library is used in production environments
- Use relevant skills when available for the task at hand
- Use GitHub CLI when available for GitHub operations
- Ask for clarification whenever any question remains

### Prohibited Behavior

Agents must NOT:

- Introduce breaking API changes without justification
- Add dependencies unless explicitly required and documented
- Modify public APIs without updating documentation
- Generate speculative or incomplete implementations
- Bypass linting, typing, or testing requirements

---

## Angular & TypeScript Best Practices

Agents must follow modern Angular guidance:

- Use **standalone components** only
- Prefer **strict typing**
- Avoid `any`
- Prefer Angular APIs over manual DOM manipulation
- Use `Renderer2` if DOM interaction is unavoidable
- Avoid unnecessary lifecycle hooks
- Prefer reactive patterns where appropriate
- Keep components small and focused

### Change Detection

- Default to `ChangeDetectionStrategy.OnPush`
- Avoid manual `markForCheck` unless justified

---

## Testing Requirements

All changes should include or update tests.

Testing guidelines:

- Use **Arrange – Act – Assert** structure
- Cover:
  - Core behavior
  - Edge cases
  - Keyboard interaction
  - Accessibility concerns
- Avoid brittle DOM queries
- Prefer behavior-driven assertions

Test naming convention:

```text
ComponentName › should <expected behavior> when <condition>
```

---

## Public API Rules

Agents must:

- Export all public symbols explicitly via `public-api.ts`
- Avoid leaking internal helpers
- Keep configuration objects strongly typed
- Provide safe default values for optional inputs
- Maintain backwards compatibility whenever possible

---

## Documentation Standards

When modifying or generating documentation:

- Keep tone concise and technical
- Document all public inputs, outputs, and configuration options
- Include usage examples where relevant
- Update `CHANGELOG.md` for:
  - Features
  - Fixes
  - Breaking changes

Documentation must always match the actual implementation.

---

## Code Style & Formatting

Agents must respect:

- Existing ESLint configuration
- Prettier formatting rules
- Angular style guide naming conventions

General rules:

- Use descriptive names
- Avoid abbreviations unless widely understood
- Keep functions short and single-purpose
- Prefer explicitness over implicit behavior

---

## Versioning & Releases

- Follow **Semantic Versioning**
  - `MAJOR` — breaking changes
  - `MINOR` — backward-compatible features
  - `PATCH` — fixes and internal improvements
- Breaking changes require:
  - Clear justification
  - Migration notes
  - Changelog entry

---

## Accessibility & UX

OTP input components must:

- Be fully keyboard accessible
- Include correct ARIA roles and labels
- Manage focus predictably
- Work with screen readers
- Avoid relying solely on visual cues

Accessibility regressions are considered critical bugs.

---

## Decision-Making Guidance for Agents

When uncertain, agents should:

1. Prefer Angular’s official recommendations
2. Match existing project patterns
3. Choose simpler, more maintainable solutions
4. Avoid introducing opinionated abstractions

---

## Summary

This file exists to ensure that AI agents:

- Produce high-quality Angular library code
- Respect the public API and user expectations
- Maintain consistency, safety, and accessibility
- Improve the project without introducing regressions

Following this document is mandatory for all automated contributions.
