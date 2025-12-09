# Dev Tools Manager - Setup Guide

## Overview
This is a desktop application built with Electron that helps you manage development projects. It supports creating Laravel, Vue.js, Nuxt.js, React, and WordPress projects, configuring Nginx virtual hosts, and generating SSL certificates.

## Features
✅ Create multiple types of projects (Laravel, Vue, Nuxt, React, WordPress)
✅ Automatic Nginx virtual host configuration
✅ SSL certificate generation with mkcert
✅ Bilingual interface (Khmer & English)
✅ Modern UI with Tailwind CSS
✅ Cross-platform support (Linux, Windows, macOS)

## Prerequisites

### Required Software

1. **Node.js** (v16 or higher)
   ```bash
   # Check if installed
   node --version
   npm --version
   ```

2. **Composer** (for Laravel projects)
   ```bash
   # Linux/macOS
   php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
   php composer-setup.php
   sudo mv composer.phar /usr/local/bin/composer
   
   # Verify installation
   composer --version
   ```

3. **Nginx** (optional, for virtual host configuration)
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install nginx
   
   # Verify installation
   nginx -v
   ```

4. **mkcert** (for SSL certificates)
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
   
   # Windows (with Chocolatey)
   choco install mkcert
   mkcert -install
   ```

## Installation

1. Navigate to the project directory:
   ```bash
   cd /home/h-mab/learn/devtools/dev-tools-app
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. The application is now ready to run!

## Running the Application

### Option 1: Using the run script
```bash
./run.sh
```

### Option 2: Using npm
```bash
# Development mode (with DevTools)
npm run dev

# Production mode
npm start
```

## Building Executable

To create a standalone executable for distribution:

```bash
# Build for Linux
npm run build:linux

# Build for Windows
npm run build:win

# Build for macOS
npm run build:mac
```

The executable will be created in the `dist/` directory.

## Using the Application

### 1. Create a New Project

1. Click on the "បង្កើតគម្រោង" (Create Project) tab
2. Select project type from dropdown:
   - Laravel
   - Vue.js
   - Nuxt.js
   - React
   - WordPress
3. Enter project name (e.g., "my-app")
4. Click "រកមើល" (Browse) to select project location
5. Click "បង្កើតគម្រោង" (Create Project)

The application will automatically run the appropriate commands to create your project.

### 2. Configure Nginx Virtual Host

1. Click on the "កំណត់រចនាសម្ព័ន្ធ Nginx" (Configure Nginx) tab
2. Enter domain name (e.g., "myproject.local")
3. Select project path
4. Set port (default: 80)
5. Click "កំណត់រចនាសម្ព័ន្ធ" (Configure)

**Important:** 
- A password prompt will appear asking for your system password (sudo privileges required)
- Enter your password to allow the app to configure Nginx
- The configuration will be written to `/etc/nginx/sites-available/`

After configuration:
- Add the domain to `/etc/hosts`:
  ```bash
  sudo nano /etc/hosts
  # Add: 127.0.0.1 myproject.local
  ```
- Or the app will show you a reminder message

### 3. Generate SSL Certificate

1. Click on the "បង្កើត SSL" (Generate SSL) tab
2. Enter domain name (e.g., "myproject.local")
3. Click "បង្កើតវិញ្ញាបនប័ត្រ" (Generate Certificate)

The certificate files will be created in your home directory.

### 4. Language Toggle

Click the "EN" / "KH" button in the top-right corner to switch between English and Khmer.

### 5. Check System Requirements

The app automatically checks if required tools are installed:
- Composer
- Node.js
- Nginx
- mkcert

Click "ពិនិត្យឡើងវិញ" (Check Again) to re-check.

## Project Commands

### Laravel Projects
```bash
cd /path/to/project
php artisan serve
```

### Vue.js Projects
```bash
cd /path/to/project
npm install
npm run dev
```

### Nuxt.js Projects
```bash
cd /path/to/project
npm install
npm run dev
```

### React Projects
```bash
cd /path/to/project
npm install
npm start
```

### WordPress Projects
- Configure your database settings in `wp-config.php`
- Access through your configured domain

## Troubleshooting

### Issue: Electron won't start
**Solution:** 
```bash
npm install electron --save-dev
npm start
```

### Issue: Tailwind CSS not working
**Solution:**
The CSS is already compiled in `src/renderer/output.css`. If you need to rebuild:
```bash
npm install -g tailwindcss
tailwindcss -i ./src/renderer/styles.css -o ./src/renderer/output.css
```

### Issue: Can't create Laravel project
**Solution:**
- Ensure Composer is installed: `composer --version`
- Check PHP version: `php -v` (Laravel requires PHP 8.1+)
- Run manually: `composer create-project laravel/laravel project-name`

### Issue: Nginx configuration fails with "permission denied"
**Solution:**
- Make sure you have sudo privileges
- When prompted, enter your password
- If the password dialog doesn't appear, the `sudo-prompt` package may not be working
- Manual workaround:
  ```bash
  # Create the config manually
  sudo nano /etc/nginx/sites-available/myproject.local
  # Paste the nginx configuration
  # Then:
  sudo ln -sf /etc/nginx/sites-available/myproject.local /etc/nginx/sites-enabled/
  sudo nginx -t
  sudo systemctl reload nginx
  ```

### Issue: "User did not grant permission" error
**Solution:**
- You cancelled the password prompt
- Try again and enter your password when prompted
- The app needs sudo access to write to `/etc/nginx/`

### Issue: SSL certificate generation fails
**Solution:**
- Install mkcert: See prerequisites section
- Run `mkcert -install` to install the local CA
- Generate manually: `mkcert domain.local`

### Issue: Permission denied errors
**Solution:**
```bash
chmod +x run.sh
sudo chown -R $USER:$USER /path/to/project
```

## File Structure

```
dev-tools-app/
├── src/
│   ├── main/
│   │   └── main.js              # Electron main process
│   ├── renderer/
│   │   ├── index.html           # Main UI
│   │   ├── app.js              # Application logic & translations
│   │   ├── styles.css          # Custom styles
│   │   └── output.css          # Compiled Tailwind CSS
│   └── utils/                   # Utility functions (future use)
├── package.json                 # Dependencies & scripts
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── run.sh                      # Quick start script
├── .gitignore                  # Git ignore file
└── README.md                   # Documentation
```

## Development Tips

### Adding a New Project Type

1. Edit `src/main/main.js`:
   - Add case in `create-project` handler
   - Define the command to create the project

2. Edit `src/renderer/index.html`:
   - Add option to project type dropdown

### Customizing the UI

1. Edit `src/renderer/index.html` for structure
2. Edit `src/renderer/app.js` for functionality
3. Edit `src/renderer/styles.css` for custom styles
4. Rebuild CSS if needed

### Adding Translations

Edit the `translations` object in `src/renderer/app.js`:
```javascript
const translations = {
  km: { /* Khmer translations */ },
  en: { /* English translations */ }
};
```

## Security Notes

⚠️ **Important:**
- The app uses `sudo-prompt` for Nginx configuration (requires root access)
- Always review generated Nginx configurations
- Keep mkcert certificates secure
- Don't commit certificates to version control

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the README.md
3. Check system requirements are met

## License

MIT License - Feel free to use and modify as needed.

---

**Built with:**
- Electron
- Tailwind CSS
- Node.js
- Love for development automation! 💙
