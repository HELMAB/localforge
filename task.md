# Improve Create Project Flow (Nuxt)

## Overview

This document defines improvements to the **Create Project** flow when creating a **Nuxt** application.  
The goal is to simplify the user experience, enforce Nuxt 4 requirements by default, and generate clean, minimal, and optimized project code.

---

## Current User Flow

When the user selects:

**Create Project → Nuxt → Select Nuxt Template → Select Node Version → Enter Project Name & Location → Create Project**

---

## Proposed Improvements

### 1. Simplify Nuxt Project Creation

- Remove the **Select Nuxt Template** step entirely.
- Automatically use **`minimal`** as the default Nuxt template.
- Do not expose template selection to the user.

**Rationale:**  
Nuxt 4 minimal template is sufficient for most projects and reduces decision fatigue during project creation.

---

### 2. Default Project Location in General Settings not only Nuxt project

- Set the default project location to:
  ```
  /home/${user}/projects
  ```
- Allow users to modify the location manually if needed.

**Rationale:**  
Provides a consistent and developer-friendly default workspace while keeping flexibility.

---

### 3. Node.js Version Handling

- Nuxt 4 requires **Node.js 20 or higher**.
- Set **Node.js 20** as the default selected version.
- Hide all Node.js versions **below 20** from the version selection list.

#### Remove the following UI information boxes:

- “Creates a Nuxt 4 project with your selected template. Latest version with modern features.”
- “Nuxt 4 requires Node.js 20 or higher. Please ensure you have Node 20+ installed or selected.”
- “Select Node.js version. LTS versions are recommended for production. NVM required for version switching.”

**Rationale:**  
Reducing unnecessary informational messages improves clarity and avoids redundant explanations.

---

### 4. Post-Creation Behavior

After project creation:

- Do **not** prompt the user to run:
  - `npm run lint`
  - tests
  - build commands

**Rationale:**  
Project creation should be fast and non-intrusive. Developers can run these commands manually when needed.

---

### 5. Project File Generation Rules

- Do **not** generate unnecessary Markdown files (e.g. README templates, guides, notes).
- Generate **only** the files required for a standard **Nuxt 4 minimal** project.
- Avoid placeholder or example files unless required by Nuxt.

**Rationale:**  
Keeps the project clean and avoids noise in the repository.

---

### 6. Code Quality Standards

All generated code must:

- Be optimized for **performance**
- Be easy to **read and understand**
- Be **maintainable** and scalable
- Avoid:
  - Unused configurations
  - Redundant setup
  - Boilerplate code not required by Nuxt 4

---

## Expected Outcome

- A faster and simpler Nuxt project creation flow
- Enforced Nuxt 4 compatibility by default
- Clean, minimal, and production-ready project structure
- Reduced cognitive load for users during setup

---

## Summary

This improvement focuses on **simplicity, correctness, and developer experience** by removing unnecessary steps, enforcing best defaults, and generating high-quality Nuxt 4 projects out of the box.
