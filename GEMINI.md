# GEMINI LocalForge Analysis

This document provides a comprehensive overview of the LocalForge project, intended to be used as a context for future AI-assisted development.

## Project Overview

LocalForge is a desktop application built with Electron that aims to simplify local web development. It provides a graphical user interface for scaffolding various types of projects (Laravel, Vue, React, WordPress, etc.), managing Nginx virtual hosts, generating local SSL certificates with `mkcert`, and installing/managing essential development tools like PHP, Node.js (via NVM), and database servers.

The application is designed to be a one-stop-shop for developers to set up and manage their local environments without extensive command-line interaction.

### Key Technologies

-   **Desktop Framework:** Electron
-   **Frontend:** Vue.js 3 (with Composition API)
-   **Build Tool:** Vite
-   **Styling:** Tailwind CSS
-   **Backend/Main Process:** Node.js
-   **Internationalization:** vue-i18n (English and Khmer)
-   **Packaging:** electron-builder

## Building and Running

The project uses `npm` for dependency management and running scripts.

### Development

To run the application in development mode with hot-reloading:

```bash
# Install dependencies
npm install

# Run the development server and Electron app
npm run electron:dev
```

This command starts the Vite dev server for the Vue.js frontend and launches the Electron application, which loads the content from the dev server.

### Production Build

To build the application for production:

```bash
# Build for the current platform
npm run electron:build

# Or, build for a specific platform:
npm run build:linux
npm run build:win
npm run build:mac
```

The packaged application will be located in the `dist-builder/` directory.

### Linting and Formatting

The project uses ESLint for linting and Prettier for formatting.

```bash
# Run linter
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Check formatting
npm run format:check

# Format all files
npm run format
```

A pre-commit hook is set up using Husky and `lint-staged` to automatically lint and format staged files.

## Development Conventions

### Architecture

The project follows the standard Electron two-process model:

-   **Main Process (`src/main/main.js`):** This is the Node.js backend of the application. It handles all system-level operations, such as:
    -   Creating and managing the application window.
    -   Executing shell commands for project creation, tool installation, and Nginx configuration.
    -   Handling all Inter-Process Communication (IPC) calls from the renderer.
    -   Using `sudo-prompt` to execute commands that require administrator privileges.
    -   Managing auto-updates with `electron-updater`.

-   **Renderer Process (`src/renderer/`):** This is the Vue.js frontend that the user interacts with.
    -   It's a Single Page Application (SPA) built with Vite.
    -   It communicates with the main process exclusively through IPC channels.
    -   The UI is organized into views, components, and layouts.
    -   Business logic on the frontend is encapsulated within Vue Composables (`src/renderer/src/composables`). For example, `useProject.js` handles the logic for creating projects by invoking IPC channels handled by the main process.

### State Management

-   **Routing:** `vue-router` is used for navigation between the different sections (Create Project, Nginx, Manage Tools, Settings).
-   **Local State:** Most component state is managed locally within the components themselves.
-   **Settings Persistence:** Application settings (like theme and language) are persisted in `localStorage` via the `useSettings` composable.

### Styling

-   The project uses **Tailwind CSS** for utility-first styling.
-   Global styles and Tailwind's base layers are defined in `src/renderer/src/assets/styles/main.css`.
-   The application supports both light and dark modes, managed by the `useDarkMode` composable.

### Continuous Integration

The CI pipeline is defined in `.github/workflows/ci.yml` and runs on GitHub Actions. It includes two main jobs:

1.  **`lint-and-format`**: Ensures that all code pushed to `main` or `develop` branches adheres to the project's coding standards.
2.  **`build`**: Builds the application on Ubuntu, Windows, and macOS to verify that the application can be packaged successfully for all target platforms.
