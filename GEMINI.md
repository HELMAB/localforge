# Project Overview

This is an Electron-based desktop application called "Dev Tools Manager" for managing development projects. It supports creating projects for various frameworks like Laravel, Vue.js, Nuxt.js, React, and WordPress.

**Main Technologies:**

*   **Electron:** For building the cross-platform desktop application.
*   **Node.js:** As the runtime for Electron and for scripting.
*   **HTML/CSS/JavaScript:** For the user interface (renderer process).
*   **Tailwind CSS:** For styling the user interface.
*   **Nginx:** For web server configuration.
*   **mkcert:** For generating SSL certificates.

**Architecture:**

The application follows a standard Electron architecture:

*   **Main Process (`src/main/main.js`):** Handles window creation, application lifecycle, and all Node.js-related operations like file system access, executing shell commands, and interacting with the operating system. It communicates with the renderer process via IPC.
*   **Renderer Process (`src/renderer/`):** This is the user interface of the application.
    *   `index.html`: The main HTML file.
    *   `app.js`: Contains the logic for the UI, including handling user interactions and communicating with the main process.
    *   `styles.css` & `output.css`: The source and compiled Tailwind CSS files.
*   **Utilities (`src/utils/`):**  (Currently empty) Intended for helper functions.

# Building and Running

**Development:**

To run the application in development mode with DevTools open:

```bash
npm run dev
```

**Production:**

To run the application in production mode:

```bash
npm start
```

**Building Executables:**

To build executables for different platforms:

*   **Linux:** `npm run build:linux`
*   **Windows:** `npm run build:win`
*   **macOS:** `npm run build:mac`

**CSS:**

The project uses Tailwind CSS. To watch for changes in `src/renderer/styles.css` and rebuild `src/renderer/output.css`:

```bash
npm run build:css
```

# Development Conventions

*   **IPC (Inter-Process Communication):** The renderer process communicates with the main process using `ipcRenderer.invoke` to call asynchronous functions in the main process. This is used for all operations that require Node.js APIs or shell access.
*   **UI:** The UI is built with HTML and styled with Tailwind CSS. The application logic in `src/renderer/app.js` manipulates the DOM directly.
*   **Internationalization (i18n):** The application supports two languages: Khmer (km) and English (en). Translations are stored in the `translations` object in `src/renderer/app.js`. The `updateLanguage()` function is responsible for updating the UI with the selected language.
*   **System Interaction:** The application interacts heavily with the user's system by executing shell commands for:
    *   Creating projects (e.g., `composer create-project`, `npx create-react-app`).
    *   Configuring Nginx.
    *   Generating SSL certificates with `mkcert`.
    *   Installing and managing development tools like PHP, Node.js (via nvm), Composer, Nginx, PostgreSQL, and MySQL.
*   **Privilege Escalation:** For commands that require root privileges (like installing software or modifying Nginx configurations), the application uses the `sudo-prompt` library to ask the user for their password.
