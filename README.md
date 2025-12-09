# Dev Tools Manager

A desktop application for managing development projects with support for Laravel, Vue.js, Nuxt.js, React, and WordPress.

## Features

- ✨ Create projects: Laravel, Vue, Nuxt, React, WordPress
- 🔧 Automated Nginx virtual host configuration
- 🔒 Generate HTTPS certificates using mkcert
- 🌐 Bilingual support: Khmer (default) and English
- 💅 Modern UI with Tailwind CSS
- ⚡ Built with Electron

## Requirements

Before using this application, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **Composer** (for Laravel projects)
- **Nginx** (for web server configuration)
- **mkcert** (for SSL certificate generation)

### Installing mkcert

```bash
# Linux
sudo apt install libnss3-tools
curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
chmod +x mkcert-v*-linux-amd64
sudo mv mkcert-v*-linux-amd64 /usr/local/bin/mkcert
mkcert -install

# macOS
brew install mkcert
mkcert -install

# Windows
choco install mkcert
mkcert -install
```

## Installation

1. Clone or download this repository
2. Install dependencies:
```bash
npm install
```

3. Build Tailwind CSS:
```bash
npm run build:css
```

## Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Build Executable

```bash
# Build for Linux
npm run build:linux

# Build for Windows
npm run build:win

# Build for macOS
npm run build:mac
```

## Features Guide

### 1. Create Project

- Select project type (Laravel, Vue, Nuxt, React, WordPress)
- Enter project name
- Choose project location
- Click "Create Project"

### 2. Configure Nginx

- Enter domain name (e.g., myproject.local)
- Select project path
- Set port (default: 80)
- Click "Configure"

Note: You may need sudo privileges for Nginx configuration.

### 3. Generate SSL Certificate

- Enter domain name
- Click "Generate Certificate"
- Certificates will be created in your home directory

### Language Toggle

Click the language button in the top right corner to switch between Khmer and English.

## Project Structure

```
dev-tools-app/
├── src/
│   ├── main/
│   │   └── main.js          # Electron main process
│   ├── renderer/
│   │   ├── index.html       # Main UI
│   │   ├── app.js          # Application logic
│   │   └── styles.css      # Tailwind styles
│   └── utils/              # Utility functions
├── package.json
├── tailwind.config.js
└── README.md
```

## Troubleshooting

### Nginx Configuration Issues

If Nginx configuration fails, ensure:
- Nginx is installed and running
- You have sudo privileges
- The project path exists and is accessible

### SSL Certificate Issues

If SSL generation fails:
- Verify mkcert is installed: `mkcert -version`
- Run `mkcert -install` to install the local CA

### Project Creation Issues

- Ensure Composer is installed for Laravel projects
- Verify Node.js is installed for Vue/Nuxt/React projects
- Check internet connection for downloading project templates

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!
