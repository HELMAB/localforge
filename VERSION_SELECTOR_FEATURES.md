# Version Selector Features

## New Features Added ✨

### 1. Laravel Project Options

#### PHP Version Selection
- PHP 8.3
- PHP 8.2 (Default)
- PHP 8.1
- PHP 8.0

#### Laravel Starter Kit Options
- **គ្មាន (None)**: Plain Laravel installation
- **Laravel Breeze (Blade)**: Simple authentication with Blade templates
- **Laravel Jetstream (Livewire)**: Advanced features with Livewire
- **Breeze + Vue.js**: Authentication with Vue.js frontend
- **Breeze + React**: Authentication with React frontend

**What happens:**
1. Creates Laravel project with Composer
2. If a starter kit is selected:
   - Installs the starter package
   - Runs setup commands
   - Installs and builds frontend assets (for Vue/React)

### 2. WordPress Project Options

#### PHP Version Selection
- PHP 8.3
- PHP 8.2 (Default)
- PHP 8.1
- PHP 8.0
- PHP 7.4

**What happens:**
- Downloads latest WordPress
- Extracts to project directory
- Ready for database configuration

### 3. Node.js Project Options (Vue/Nuxt/React)

#### Node.js Version Selection
- **Node.js 20 LTS** (Recommended)
- **Node.js 18 LTS** (Default)
- **Node.js 16**
- **Current Node Version**: Uses whatever version is currently active

**What happens:**
- If NVM is installed, switches to selected Node version
- Creates project with the selected/current Node version
- Falls back to system Node if NVM not available

### 4. Smart UI

#### Dynamic Form Display
- Shows only relevant options for selected project type
- Laravel: PHP version + Starter kit
- WordPress: PHP version
- Vue/Nuxt/React: Node version

#### Helpful Info Boxes
Each project type shows an info box explaining:
- What the project includes
- What to expect
- Additional setup needed

#### Bilingual Support
All new features are translated in:
- ភាសាខ្មែរ (Khmer)
- English

## Usage Examples

### Example 1: Laravel with Breeze + Vue

```
Project Type: Laravel
PHP Version: 8.2
Starter Kit: Breeze + Vue.js
Name: my-laravel-app
```

**Result:**
- Creates Laravel project
- Installs Laravel Breeze
- Sets up Vue.js integration
- Installs NPM dependencies
- Builds assets
- Ready to run!

### Example 2: WordPress Site

```
Project Type: WordPress
PHP Version: 8.2
Name: my-wordpress-site
```

**Result:**
- Downloads WordPress
- Extracts to project folder
- Ready for database setup

### Example 3: Nuxt with Node 20

```
Project Type: Nuxt.js
Node Version: Node.js 20 LTS
Name: my-nuxt-app
```

**Result:**
- Switches to Node 20 (if NVM installed)
- Creates Nuxt project
- Ready to run `npm install && npm run dev`

## System Requirements

### For Laravel Projects
- ✅ Composer
- ✅ PHP (version matching selection)
- ✅ Node.js & NPM (for Breeze Vue/React)

### For WordPress
- ✅ PHP (version matching selection)
- ✅ curl
- ✅ unzip

### For Node.js Projects
- ✅ Node.js
- ⭐ NVM (recommended for version switching)

## NVM (Node Version Manager)

### Installing NVM

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc  # or ~/.zshrc

# Install Node versions
nvm install 20
nvm install 18
nvm install 16

# Set default
nvm alias default 20
```

### Using NVM

```bash
# List installed versions
nvm list

# Install a version
nvm install 20

# Use a version
nvm use 20

# Check current version
node --version
```

## Technical Details

### How Version Switching Works

#### For Laravel:
- The app doesn't switch PHP versions directly
- You need to have the selected PHP version installed
- The app uses the system's default `composer` command
- To switch PHP versions manually:
  ```bash
  sudo update-alternatives --config php
  ```

#### For Node.js:
- The app detects if NVM is installed
- If NVM exists, it runs: `nvm use [version]` before creating project
- If NVM doesn't exist, uses system Node
- Commands are wrapped like:
  ```bash
  export NVM_DIR="$HOME/.nvm" && \
  [ -s "$NVM_DIR/nvm.sh" ] && \
  . "$NVM_DIR/nvm.sh" && \
  nvm use 20 && \
  npm create vue@latest my-app
  ```

### Laravel Starter Kit Commands

The app runs these commands behind the scenes:

```bash
# Breeze (Blade)
composer require laravel/breeze --dev
php artisan breeze:install blade
npm install && npm run build

# Jetstream (Livewire)
composer require laravel/jetstream
php artisan jetstream:install livewire

# Breeze + Vue
composer require laravel/breeze --dev
php artisan breeze:install vue
npm install && npm run build

# Breeze + React
composer require laravel/breeze --dev
php artisan breeze:install react
npm install && npm run build
```

## Updated Files

1. **src/renderer/index.html**
   - Added version selectors
   - Added starter kit options
   - Added info boxes
   - Dynamic form sections

2. **src/renderer/app.js**
   - Added `handleProjectTypeChange()` function
   - Updated `createProject()` to send version options
   - Added translations for new features
   - Updated `updateLanguage()` function

3. **src/main/main.js**
   - Updated `create-project` handler
   - Added NVM integration for Node projects
   - Added Laravel starter kit installation
   - Enhanced system requirements check

## Tips

### For Best Results:

1. **Install NVM**: For seamless Node version switching
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```

2. **Have Multiple PHP Versions**: Use tools like:
   - `phpbrew` (macOS/Linux)
   - `update-alternatives` (Ubuntu/Debian)
   - XAMPP/MAMP (All platforms)

3. **Check Requirements**: Use the app's requirements checker before creating projects

4. **Internet Connection**: Required for:
   - Downloading packages
   - Installing dependencies
   - WordPress download

## Troubleshooting

### "Node version not found"
- Install NVM and the required Node version
- Or select "Current Node Version" to use system Node

### "Composer not found" (Laravel)
- Install Composer: https://getcomposer.org/

### "PHP version mismatch"
- The app shows the version, but doesn't enforce it
- Make sure the selected PHP version is installed
- Switch PHP version manually if needed

### Starter Kit Installation Fails
- Check internet connection
- Ensure NPM is installed (for Vue/React starters)
- Check Laravel compatibility with your PHP version

---

🎉 **Enjoy creating projects with your preferred versions!**
