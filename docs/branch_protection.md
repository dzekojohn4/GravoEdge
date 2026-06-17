# Branch Protection and Merge Policies

This document outlines the branch protection rules, code review requirements, status checks, and merge strategies for the repository. These rules ensure code quality, maintain a clean commit history, and prevent security-critical changes from being merged without appropriate review.

## 1. Branch Naming Convention

When creating a new branch, please adhere to the following naming conventions based on the type of work:

- **`feature/*`** - For new features or enhancements (e.g., `feature/user-authentication`)
- **`fix/*`** - For bug fixes (e.g., `fix/login-crash`)
- **`docs/*`** - For documentation updates (e.g., `docs/api-readme`)
- **`security/*`** - For security patches and vulnerability fixes (e.g., `security/update-dependencies`)

## 2. Required Reviewers

All pull requests must undergo a code review before they can be merged.

- **Standard Changes:** A minimum of **1** approved review is required.
- **Security Changes:** Any changes affecting security or originating from a `security/*` branch require a minimum of **2** approved reviews.

## 3. Required Status Checks

Before a pull request can be merged, the following status checks must pass successfully to ensure the integrity of the codebase:

- **CI:** The continuous integration build must complete successfully.
- **Pylint:** All Python backend code must pass linting checks.
- **Frontend tests:** All automated tests for the frontend must pass.

## 4. Merge Strategy and Linear History

- **Squash Merge:** We use the **Squash and Merge** strategy for all pull requests. This combines all commits from your branch into a single comprehensive commit on the target branch.
- **Linear History:** The main branch requires a strictly linear commit history. Merge commits are not allowed. Please ensure your branch is up to date with the base branch (via rebase) before merging.
