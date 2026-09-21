---
name: efficient-coding
description: Minimize context and token usage when working on code.
disable-model-invocation: false
---

# Efficient Coding

## Purpose

Work on coding tasks efficiently, precisely, and with minimal unnecessary
context, tool usage, file inspection, and code changes.

The primary goals are:

1. Solve the user's actual problem.
2. Minimize unnecessary token and context consumption.
3. Minimize unnecessary file reads and project exploration.
4. Make the smallest safe change that solves the problem.
5. Preserve existing architecture, UI, behavior, and conventions.
6. Avoid unnecessary refactoring, dependencies, and configuration changes.
7. Verify changes proportionally to the scope of the task.
8. Avoid speculative changes and unnecessary trial-and-error.

---

# 1. General Operating Principles

Always prioritize:

- Correctness
- Minimal scop
- Minimal context
- Minimal changes
- Existing project conventions
- User requirements
- Simplicity

Do not optimize for the amount of code changed.

Optimize for solving the problem with the smallest reasonable change.

Never change code simply because it could be written differently.

If the existing implementation works outside the reported problem,
leave it unchanged.

---

# 2. Scope Control

Before starting a task:

1. Identify exactly what the user is asking to change.
2. Identify the files explicitly mentioned by the user.
3. Identify the smallest set of additional files that are genuinely
   necessary.

Prefer this order:

1. Explicitly referenced file
2. Directly imported dependency
3. Relevant configuration
4. Other files only when required

Do NOT scan the entire repository by default.

Do NOT inspect unrelated components.

Do NOT inspect every file to "understand the project" unless the task
genuinely requires repository-wide understanding.

If the user provides a specific file, start there.

Example:

User:
"Fix the GSAP animation bug in Problem.tsx."

Preferred behavior:

- Inspect Problem.tsx first.
- Understand the relevant GSAP implementation.
- Inspect only directly relevant imports if necessary.
- Fix the issue in Problem.tsx when possible.
- Do not scan unrelated components.

---

# 3. Explicit File Restrictions

When the user explicitly specifies a file:

- Treat that file as the primary scope.
- Prefer modifying only that file.
- Do not modify unrelated files.
- Do not refactor surrounding architecture.
- Do not reorganize the project.
- Do not rename unrelated variables, components, or files.
- Do not change configuration unless required for the requested fix.

If another file must be changed, first determine whether the change is
actually necessary.

Do not modify additional files merely because doing so would produce a
"cleaner" implementation.

---

# 4. Context Management

Use context selectively.

Only read information that is useful for completing the current task.

Avoid repeatedly reading the same file when its relevant content is
already available in the current context.

Do not request or load large amounts of unrelated source code.

When possible:

- Use the specific file provided by the user.
- Use specific symbols or relevant sections.
- Inspect only the relevant imports.
- Avoid reading generated files.
- Avoid reading dependency internals unless necessary.
- Avoid reading lockfiles unless dependency resolution is relevant.

Do not inspect:

- node_modules
- build output
- generated files
- caches
- unrelated assets

unless the user explicitly asks for them or they are directly relevant
to diagnosing the problem.

---

# 5. Task Classification

Classify the task before acting.

## Small Task

Examples:

- Fix a typo
- Fix a CSS class
- Fix a simple TypeScript error
- Adjust spacing
- Change a label
- Fix a small animation issue

For small tasks:

- Inspect the minimum required context.
- Make the smallest change.
- Avoid broad analysis.
- Avoid unnecessary refactoring.
- Avoid full-project verification.

## Medium Task

Examples:

- Fix a component bug
- Refactor one component
- Improve a form
- Fix state management
- Fix an API interaction

For medium tasks:

- Inspect the relevant component and direct dependencies.
- Determine the root cause.
- Make focused changes.
- Perform targeted verification.

## Large Task

Examples:

- Major architecture changes
- Authentication systems
- Database migrations
- Large feature implementation
- Repository-wide refactoring

For large tasks:

- Broader inspection is allowed when necessary.
- Establish the architecture before making changes.
- Avoid unnecessary exploration outside the feature scope.
- Break the work into logical steps.
- Verify each significant stage.

---

# 6. Minimal-Change Principle

Always prefer the smallest change that correctly solves the problem.

Before modifying code, ask:

- What is the actual root cause?
- What is the smallest change that fixes it?
- Can the existing architecture remain unchanged?
- Can the existing dependency be reused?
- Can this be solved without adding a dependency?
- Can the change be isolated to the requested file?

Prefer:

Small targeted fix

over:

Large refactor

Do not rewrite working code unnecessarily.

Do not replace an existing implementation with a different library
unless the user requests it or the current implementation cannot
reasonably solve the problem.

---

# 7. Root Cause First

When debugging:

1. Read the relevant code.
2. Identify the likely root cause.
3. Verify the hypothesis using available evidence.
4. Apply the smallest appropriate fix.
5. Verify the result.

Do not immediately rewrite the implementation.

Do not make multiple speculative changes at once.

Do not repeatedly try random solutions.

If an error message is available, use it as the primary diagnostic
evidence.

Prefer:

Find root cause → Apply focused fix → Verify

instead of:

Try solution A → Try solution B → Try solution C

---

# 8. Error Handling

When the user provides an error message:

- Focus on that specific error first.
- Inspect only the code relevant to the error.
- Do not fix unrelated errors.
- Do not perform a repository-wide cleanup.
- Do not change working code unnecessarily.

If the error is ambiguous:

- Inspect the smallest amount of additional context required.
- Use the error location and stack trace when available.
- Avoid broad repository searches unless necessary.

If a solution is uncertain, explain the uncertainty rather than making
many speculative modifications.

---

# 9. Dependencies

Do not install new dependencies unless absolutely necessary.

Before adding a dependency:

1. Check whether the project already has a suitable dependency.
2. Check whether the functionality can be implemented using existing
   libraries.
3. Prefer native APIs when they are sufficient.
4. Prefer existing project utilities and components.

Never install a package simply because it is convenient.

Do not change package versions unless required.

Do not modify package.json for a task that can be solved without doing so.

---

# 10. Refactoring Rules

Do not perform unrelated refactoring.

Do NOT:

- Rename unrelated variables.
- Reorganize unrelated components.
- Change formatting throughout the file.
- Rewrite working functions.
- Replace libraries unnecessarily.
- Change architecture without a requirement.
- Convert JavaScript to TypeScript unless requested.
- Change state management libraries unless requested.
- Change styling systems unless requested.

If a refactor is useful but unrelated to the current task:

- Do not perform it.
- Mention it only if it is important to the correctness of the current
  task.

---

# 11. UI Preservation

When fixing functionality:

Preserve:

- Existing UI
- Existing layout
- Existing responsive behavior
- Existing animations
- Existing interactions
- Existing typography
- Existing colors
- Existing component API

unless the user explicitly asks for UI changes.

Do not redesign a component while fixing a bug.

Do not change visual behavior unnecessarily.

For animation bugs, preserve the intended animation design and modify
only the implementation required to remove the bug.

---

# 12. Animation and GSAP Rules

When working with GSAP:

- Inspect the existing animation lifecycle first.
- Check whether animations are created repeatedly.
- Check React effect dependencies.
- Check cleanup behavior.
- Check GSAP context usage when appropriate.
- Check whether DOM elements are available before animation.
- Check whether timelines/tweens are duplicated.
- Check whether event listeners are cleaned up.
- Check whether animations survive component unmounting.
- Avoid rewriting the entire animation system.

Prefer a targeted fix over replacing GSAP with another animation library.

Do not introduce additional animation libraries unless explicitly
requested or absolutely necessary.

---

# 13. React / Next.js Rules

When working with React or Next.js:

- Preserve the existing component architecture.
- Respect Server Components and Client Components.
- Do not add `"use client"` unless required.
- Do not remove `"use client"` unless it is safe and necessary.
- Avoid unnecessary state.
- Avoid unnecessary effects.
- Avoid unnecessary re-renders.
- Preserve existing data flow.
- Do not change routing unless requested.
- Do not change server/client boundaries unnecessarily.

When fixing hydration issues:

- Identify the actual server/client mismatch.
- Avoid disabling SSR as a quick workaround.
- Avoid adding random client-only conditions without understanding
  the cause.
- Prefer deterministic rendering.

---

# 14. TypeScript Rules

Preserve strong typing.

Prefer:

- Existing types
- Existing interfaces
- Existing utility types
- Type inference where appropriate

Avoid:

- `any`
- unnecessary type assertions
- disabling TypeScript checks
- `@ts-ignore`
- `@ts-expect-error`

Do not weaken type safety merely to make an error disappear.

If a type error can be fixed correctly, fix the underlying type issue.

---

# 15. Verification

Verification should be proportional to the task.

## Small changes

Use targeted verification.

Examples:

- Inspect the modified code.
- Check the relevant TypeScript syntax.
- Check the affected component.

Do not automatically run the entire project.

## Medium changes

Use targeted commands or checks related to the changed code.

## Large changes

Run broader verification when appropriate.

Do not automatically run:

- Full production builds
- Full test suites
- Full linting
- Full type checking

unless:

- The user requested it.
- The task requires it.
- The changed area makes it necessary.
- A targeted check cannot provide sufficient confidence.

---

# 16. Command Execution

Do not execute unnecessary commands.

Before running a command, determine whether it is useful for the
current task.

Prefer targeted commands over broad commands.

For example:

Prefer:

pnpm tsc --noEmit

when TypeScript verification is required.

Prefer targeted testing or linting when available.

Do not run multiple equivalent commands.

Do not repeatedly run the same command unless the previous result
indicates that another run is necessary.

---

# 17. Git Safety

Do not perform destructive Git operations unless explicitly requested.

Never automatically run:

git reset --hard
git clean -fd
git checkout -- .

Do not discard the user's existing changes.

Do not overwrite unrelated modifications.

When modifying a file that already contains user changes:

- Preserve those changes.
- Modify only the relevant section.
- Do not reset or recreate the entire file.

---

# 18. Existing Code Preservation

Assume existing code may be intentional.

Do not change code simply because:

- You prefer a different style.
- Another pattern is more modern.
- Another library is more popular.
- The code could theoretically be shorter.
- The architecture could theoretically be cleaner.

Only change it when it is relevant to the user's request.

---

# 19. Avoid Over-Engineering

Choose the simplest solution that satisfies the requirements.

Do not introduce:

- New abstractions without need.
- New hooks without need.
- New utilities without need.
- New components without need.
- New dependencies without need.
- Complex state management without need.
- Excessive error handling for impossible cases.
- Premature optimization.

Simple code is preferred when it is correct and maintainable.

---

# 20. User Requirements Have Priority

Always follow explicit user requirements.

If the user says:

"Only modify Problem.tsx."

Respect that restriction.

If the user says:

"Do not refactor."

Do not refactor.

If the user says:

"Keep the UI exactly the same."

Do not redesign the UI.

If the user explicitly requests a broader change, the broader request
overrides the default minimal-scope behavior.

---

# 21. When Additional Files Are Necessary

Sometimes the requested change cannot safely be completed using only the
specified file.

If another file is genuinely required:

1. Inspect only the necessary file.
2. Determine why it is required.
3. Make the smallest necessary change.
4. Avoid unrelated modifications.

Do not expand the scope simply because additional files are available.

---

# 22. Do Not Guess

Do not invent:

- APIs
- library behavior
- configuration options
- file contents
- component behavior
- environment variables
- project architecture

If the required information is not available:

- Inspect the relevant source.
- Use existing project evidence.
- Ask the user only when necessary.

Do not compensate for missing information by scanning the entire project.

---

# 23. Avoid Repeated Context Expansion

If the current context already contains enough information to solve the
problem, do not continue exploring.

Stop investigating when:

- The root cause is clear.
- The relevant code is understood.
- The fix is well-defined.

Do not keep searching for additional context simply to increase confidence
when the existing evidence is sufficient.

---

# 24. Conversation Efficiency

Keep responses concise.

After completing a coding task, summarize:

1. What was wrong.
2. What was changed.
3. Which files were modified.
4. Whether verification was performed.

Do not provide long explanations unless requested.

Do not repeat the user's requirements unnecessarily.

---

# 25. Completion Criteria

Consider a task complete when:

- The requested problem has been addressed.
- The implementation satisfies the user's requirements.
- No unnecessary files were changed.
- No unnecessary dependencies were added.
- Existing UI and behavior were preserved unless changes were requested.
- Relevant verification has been performed when appropriate.

Do not continue modifying code after the task is already correctly solved.

---

# 26. Priority Order

When deciding what to do, use this priority order:

1. User's explicit requirements
2. Correctness
3. Root-cause resolution
4. Minimal scope
5. Existing project conventions
6. Maintainability
7. Verification appropriate to the task
8. Performance optimization when relevant
9. Refactoring and cleanup

Never sacrifice correctness merely to save context.

Never sacrifice an explicit user requirement for efficiency.

---

# 27. Default Behavior

Unless the user explicitly requests otherwise:

- Inspect narrowly.
- Think before editing.
- Fix the root cause.
- Make minimal changes.
- Preserve existing code.
- Avoid unnecessary dependencies.
- Avoid unrelated refactoring.
- Avoid broad project scans.
- Avoid unnecessary commands.
- Verify proportionally.
- Keep the final response concise.

The ideal behavior is:

Understand only what is necessary
        ↓
Identify the root cause
        ↓
Make the smallest safe change
        ↓
Verify proportionally
        ↓
Stop
