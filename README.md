<div align="center">

# 🚀 LocalForge

**A powerful desktop tool for managing local development environments**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-28.0-47848F?logo=electron)](https://www.electronjs.org/)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/HELMAB/localforge/releases)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

![LocalForge](art.png)

**Streamline your development workflow with one-click project scaffolding, virtual host configuration, SSL certificate generation, and development tools management.**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Contributing](#-contributing) • [License](#-license)

</div>

---

## ✨ Features

### 🎯 Project Creation
Create Laravel, Vue, Nuxt, React, and WordPress projects with framework-specific options and starter kits. Includes recent projects tracking, favorites, and post-creation actions.

### 🌐 Virtual Host Management
Configure Nginx virtual hosts with automatic PHP-FPM detection, SSL certificate support, and sidebar navigation. Manage existing sites with enable/disable controls and detailed configuration viewer.

### 🛠️ Development Services
Install and manage PHP (8.0-8.4), Composer, Node.js, Nginx, PostgreSQL, and MySQL with one-click installation and multi-version support.

### 🎨 Modern Interface
Bilingual UI (English/Khmer), dark/light mode, keyboard shortcuts, command palette, operation monitor, onboarding tour, and auto-updates.

## 📋 Requirements

- **Node.js** ≥ 16.x
- **npm** ≥ 7.x
- **OS**: Linux, macOS, or Windows (tested on Ubuntu 20.04+)
- **Permissions**: sudo access (for tool installation)

> **Optional**: Development tools (PHP, Nginx, MySQL, etc.) can be installed via the app's **Manage Services** tab.

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/HELMAB/localforge.git
cd localforge

# Install dependencies
npm install

# Run in development mode
npm run electron:dev
```

## 💻 Usage

### Development Commands

| Command                  | Description                               |
| ------------------------ | ----------------------------------------- |
| `npm run electron:dev`   | Start development server with hot reload  |
| `npm run build`          | Build Vue app for production              |
| `npm run electron:build` | Build and package for distribution        |
| `npm run build:linux`    | Build for Linux (.deb, AppImage)          |
| `npm run build:win`      | Build for Windows (NSIS installer)        |
| `npm run build:mac`      | Build for macOS (DMG)                     |
| `npm run lint`           | Check code quality with ESLint            |
| `npm run format`         | Format code with Prettier                 |

### Keyboard Shortcuts

| Shortcut     | Action                  |
| ------------ | ----------------------- |
| `Ctrl+K`     | Command Palette         |
| `Ctrl+1`     | Create Project          |
| `Ctrl+2`     | Virtual Host Config     |
| `Ctrl+4`     | Manage Services         |
| `Ctrl+,`     | Settings                |
| `Ctrl+D`     | Toggle Dark Mode        |
| `Ctrl+L`     | Switch Language         |

## 🏗️ Tech Stack

- **Frontend**: Vue 3, Vue Router, Vue I18n, Tailwind CSS
- **Desktop**: Electron 28, IPC communication, electron-updater
- **Build**: Vite 5, ESLint, Prettier, electron-builder

## 📁 Project Structure

```
localforge/
├── src/
│   ├── main/                  # Electron main process
│   └── renderer/              # Vue 3 application
│       └── src/
│           ├── components/    # UI components
│           ├── composables/   # Business logic
│           ├── views/         # Route views
│           ├── router/        # Vue Router
│           └── i18n/          # Translations (km/en)
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "feat: add amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

**Guidelines:**
- Follow existing code style (ESLint + Prettier)
- Test with `npm run electron:dev`
- Use [Conventional Commits](https://www.conventionalcommits.org/)
- Update documentation if needed

Pre-commit hooks automatically lint and format code.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with [Electron](https://electronjs.org/), [Vue 3](https://vuejs.org/), [Vite](https://vitejs.dev/), and [Tailwind CSS](https://tailwindcss.com/).

## 📞 Contact

- **Issues**: [GitHub Issues](https://github.com/HELMAB/localforge/issues)
- **Email**: mabhelitc@gmail.com
- **Website**: [helmab.netlify.app](https://helmab.netlify.app)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Mab Hel](https://helmab.netlify.app)

[⬆ Back to Top](#-localforge)

</div>
