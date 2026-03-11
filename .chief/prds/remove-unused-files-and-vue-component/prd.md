# PRD: Remove Unused Files Detection

## Introduction

Add functionality to detect and report unused/unreferenced files in development projects managed by LocalForge. Users can manually trigger a scan to identify files that are not imported or referenced anywhere in the project codebase. This helps developers clean up their project directories and reduce clutter.

## Goals

- Scan project directories for files that are not referenced in any import statement
- Display a list of potentially unused files to the user
- Support all project types created by LocalForge (Laravel, Vue, Nuxt, React, WordPress)
- Provide file path and size information for each detected file
- Allow users to select and delete files from the detected list

## User Stories

### US-001: Add UI for unused files detection

**Priority:** 1
**Description:** As a user, I want a dedicated UI to trigger unused file scanning so I can see what files are not being used in my project.

**Acceptance Criteria:**

- [ ] New tab/route added to LocalForge for "Clean Files" functionality
- [ ] User can select a project directory to scan
- [ ] Scan button triggers the detection process
- [ ] Loading indicator shown during scan
- [ ] Typecheck passes

### US-002: Implement file reference detection logic

**Priority:** 2
**Description:** As a developer, I need backend logic to scan files and detect which ones are not imported or referenced anywhere.

**Acceptance Criteria:**

- [ ] Parse all source files (js, ts, vue, php, jsx, tsx) for import statements
- [ ] Build a set of referenced file paths
- [ ] Compare against all files in the project directory
- [ ] Return list of unreferenced files with their paths
- [ ] Typecheck passes

### US-003: Display detected unused files in UI

**Priority:** 3
**Description:** As a user, I want to see a list of unused files with their details so I can decide what to clean up.

**Acceptance Criteria:**

- [ ] Display list of unused files in a table/list format
- [ ] Show file path relative to project root
- [ ] Show file size for each item
- [ ] Show file type/extension
- [ ] Typecheck passes

### US-004: Add file deletion functionality

**Priority:** 4
**Description:** As a user, I want to select and delete unused files directly from the UI so I can clean up my project.

**Acceptance Criteria:**

- [ ] Checkbox/selection mechanism for each file
- [ ] "Select All" option
- [ ] Delete button to remove selected files
- [ ] Confirmation dialog before deletion
- [ ] Success message after deletion
- [ ] Typecheck passes

## Functional Requirements

- FR-1: Add new "Clean Files" tab to LocalForge navigation
- FR-2: Project directory selector using existing directory picker
- FR-3: Scan button triggers backend analysis of selected directory
- FR-4: Backend parses all source code files for import/require statements
- FR-5: Backend compares imported files against all files in directory
- FR-6: Return list of unreferenced files with: path, size, extension
- FR-7: Display results in scrollable list with file information
- FR-8: Allow multi-select of files to delete
- FR-9: Delete selected files via IPC to main process
- FR-10: Show confirmation dialog before any file deletion

## Non-Goals

- Automatic deletion without user confirmation
- Scanning node_modules or vendor directories
- Detecting dynamically loaded files (require(variable))
- Detecting files referenced in configuration files
- Cleaning Vue components in LocalForge's own source code

## Design Considerations

- Reuse existing DirectorySelector component
- Reuse existing StatusMessage component for feedback
- Follow existing UI patterns from other LocalForge tabs
- Consider pagination if results exceed 100 files

## Technical Considerations

- Use glob pattern to find all source files: \*_/_.{js,ts,vue,jsx,tsx,php}
- Parse imports using regex or simple AST (avoid heavy dependencies)
- Exclude common directories: node_modules, vendor, .git, dist, build
- File size obtained via fs.stat
- IPC channel: `scan-unused-files` and `delete-files`

## Success Metrics

- Users can scan a project and see results within 10 seconds for projects under 1000 files
- Users can identify at least 90% of truly unused files
- No false positives for actively used files
- Delete operation removes files successfully from filesystem

## Open Questions

- Should we add option to exclude certain file patterns from scan?
- Should we add option to exclude specific directories?
- Should we cache scan results or re-scan each time?
