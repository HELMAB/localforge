const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const sudo = require('sudo-prompt');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  
  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.filePaths[0];
});

ipcMain.handle('create-project', async (event, { type, name, path: projectPath, phpVersion, laravelStarter, nodeVersion }) => {
  return new Promise((resolve, reject) => {
    let command = '';
    const fullPath = path.join(projectPath, name);

    switch (type) {
      case 'laravel':
        // Base Laravel command
        command = `composer create-project laravel/laravel "${fullPath}"`;
        
        // Add Laravel starter kit if selected
        if (laravelStarter && laravelStarter !== 'none') {
          const starterCommands = {
            'breeze': `cd "${fullPath}" && composer require laravel/breeze --dev && php artisan breeze:install blade && npm install && npm run build`,
            'jetstream': `cd "${fullPath}" && composer require laravel/jetstream && php artisan jetstream:install livewire`,
            'breeze-vue': `cd "${fullPath}" && composer require laravel/breeze --dev && php artisan breeze:install vue && npm install && npm run build`,
            'breeze-react': `cd "${fullPath}" && composer require laravel/breeze --dev && php artisan breeze:install react && npm install && npm run build`
          };
          
          if (starterCommands[laravelStarter]) {
            command += ` && ${starterCommands[laravelStarter]}`;
          }
        }
        break;
        
      case 'vue':
        // Use specific Node version if available with NVM
        let vueCmd = `npm create vue@latest ${name}`;
        if (nodeVersion) {
          vueCmd = `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use ${nodeVersion} && ${vueCmd}`;
        }
        command = `cd "${projectPath}" && ${vueCmd}`;
        break;
        
      case 'nuxt':
        let nuxtCmd = `npx nuxi@latest init ${name}`;
        if (nodeVersion) {
          nuxtCmd = `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use ${nodeVersion} && ${nuxtCmd}`;
        }
        command = `cd "${projectPath}" && ${nuxtCmd}`;
        break;
        
      case 'react':
        let reactCmd = `npx create-react-app ${name}`;
        if (nodeVersion) {
          reactCmd = `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use ${nodeVersion} && ${reactCmd}`;
        }
        command = `cd "${projectPath}" && ${reactCmd}`;
        break;
        
      case 'wordpress':
        command = `cd "${projectPath}" && mkdir -p ${name} && cd ${name} && curl -O https://wordpress.org/latest.zip && unzip latest.zip && mv wordpress/* . && rmdir wordpress && rm latest.zip`;
        break;
        
      default:
        reject(new Error('Unknown project type'));
        return;
    }

    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ success: true, path: fullPath });
      }
    });
  });
});

ipcMain.handle('configure-nginx', async (event, { domain, projectPath, port = 80, phpVersion = null }) => {
  return new Promise((resolve, reject) => {
    // Auto-detect PHP-FPM socket path
    const detectPhpFpmSocket = (callback) => {
      if (phpVersion) {
        // Use specific PHP version if provided
        const socketPath = `/var/run/php/php${phpVersion}-fpm.sock`;
        callback(socketPath);
      } else {
        // Auto-detect available PHP-FPM socket
        exec('ls -1 /var/run/php/php*-fpm.sock 2>/dev/null | head -1', (error, stdout) => {
          if (error || !stdout.trim()) {
            // Fallback to default
            callback('/var/run/php/php-fpm.sock');
          } else {
            callback(stdout.trim());
          }
        });
      }
    };

    detectPhpFpmSocket((phpFpmSocket) => {
      const nginxConfig = `
server {
    listen ${port};
    listen [::]:${port};
    server_name ${domain};
    root ${projectPath}/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php index.html index.htm;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \\.php$ {
        fastcgi_pass unix:${phpFpmSocket};
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\\.(?!well-known).* {
        deny all;
    }
}
`;

      const configPath = `/etc/nginx/sites-available/${domain}`;
      const symlinkPath = `/etc/nginx/sites-enabled/${domain}`;
      const tempConfigPath = path.join(os.tmpdir(), `${domain}.conf`);

      // Write config to temp file first
      fs.writeFile(tempConfigPath, nginxConfig, (err) => {
        if (err) {
          reject(err);
          return;
        }

        // Use sudo to move file and configure nginx
        const options = {
          name: 'Dev Tools Manager',
        };

        const command = `mv "${tempConfigPath}" "${configPath}" && ln -sf "${configPath}" "${symlinkPath}" && nginx -t && systemctl reload nginx`;

        sudo.exec(command, options, (error, stdout, stderr) => {
          if (error) {
            reject(new Error(stderr || error.message));
          } else {
            resolve({ success: true, configPath, phpFpmSocket });
          }
        });
      });
    });
  });
});

ipcMain.handle('generate-ssl', async (event, { domain }) => {
  return new Promise((resolve, reject) => {
    exec(`mkcert ${domain}`, { cwd: os.homedir() }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ success: true, message: `SSL certificate generated for ${domain}` });
      }
    });
  });
});

ipcMain.handle('check-requirements', async () => {
  const checks = {
    composer: false,
    node: false,
    nginx: false,
    mkcert: false,
    nvm: false,
    php: false,
  };

  return new Promise((resolve) => {
    const checkCommand = (cmd, key) => {
      return new Promise((res) => {
        exec(`which ${cmd}`, (error) => {
          checks[key] = !error;
          res();
        });
      });
    };

    Promise.all([
      checkCommand('composer', 'composer'),
      checkCommand('node', 'node'),
      checkCommand('nginx', 'nginx'),
      checkCommand('mkcert', 'mkcert'),
      checkCommand('nvm', 'nvm'),
      checkCommand('php', 'php'),
    ]).then(() => {
      resolve(checks);
    });
  });
});
