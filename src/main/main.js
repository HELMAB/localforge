/* eslint-disable no-console */
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
    icon: path.join(__dirname, '../renderer/src/assets/icons/icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built files
    mainWindow.loadFile(path.join(__dirname, '../renderer/dist/index.html'));
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

ipcMain.handle('create-project', async (event, { type, name, path: projectPath, laravelVersion, laravelStarter, nodeVersion, vueOptions, nuxtVersion, nuxtTemplate }) => {
  return new Promise((resolve, reject) => {
    let command = '';
    const fullPath = path.join(projectPath, name);

    switch (type) {
      case 'laravel': {
        // Base Laravel command with version
        const version = laravelVersion || '11';
        command = `composer create-project laravel/laravel "${fullPath}" "${version}.*"`;
        
        // Add Laravel starter kit if selected
        if (laravelStarter && laravelStarter !== 'none') {
          const starterCommands = {
            // Laravel 12 - Template-based stacks (shadcn/ui)
            'template-react': `cd "${fullPath}" && composer remove laravel/pint laravel/sail && composer require laravel/breeze --dev && php artisan breeze:install react --typescript && npm install && npm run build`,
            'template-vue': `cd "${fullPath}" && composer remove laravel/pint laravel/sail && composer require laravel/breeze --dev && php artisan breeze:install vue --typescript && npm install && npm run build`,
            'template-livewire': `cd "${fullPath}" && composer remove laravel/pint laravel/sail && composer require laravel/breeze --dev && php artisan breeze:install livewire && npm install && npm run build`,
            
            // Laravel 12 - Manual Breeze & Jetstream installation
            'breeze-manual': `cd "${fullPath}" && composer require laravel/breeze --dev && php artisan breeze:install blade && npm install && npm run build`,
            'jetstream-manual': `cd "${fullPath}" && composer require laravel/jetstream && php artisan jetstream:install livewire && npm install && npm run build`,
            
            // Laravel 8-11 - Breeze & Jetstream
            'breeze': `cd "${fullPath}" && composer require laravel/breeze --dev && php artisan breeze:install blade && npm install && npm run build`,
            'jetstream': `cd "${fullPath}" && composer require laravel/jetstream && php artisan jetstream:install livewire && npm install && npm run build`,
            'breeze-vue': `cd "${fullPath}" && composer require laravel/breeze --dev && php artisan breeze:install vue && npm install && npm run build`,
            'breeze-react': `cd "${fullPath}" && composer require laravel/breeze --dev && php artisan breeze:install react && npm install && npm run build`,
            
            // Laravel 6-7 - Laravel UI
            'ui-bootstrap': `cd "${fullPath}" && composer require laravel/ui && php artisan ui bootstrap --auth && npm install && npm run build`,
            'ui-vue': `cd "${fullPath}" && composer require laravel/ui && php artisan ui vue --auth && npm install && npm run build`,
            'ui-react': `cd "${fullPath}" && composer require laravel/ui && php artisan ui react --auth && npm install && npm run build`,
            
            // Laravel 5.1-5.8 - Make Auth
            'make-auth': `cd "${fullPath}" && php artisan make:auth`
          };
          
          if (starterCommands[laravelStarter]) {
            command += ` && ${starterCommands[laravelStarter]}`;
          }
        }
        break;
      }
        
      case 'vue': {
        // Build Vue CLI flags based on selected options
        const flags = [];

        if (vueOptions) {
          // If any option is selected, use specific flags
          if (vueOptions.typescript) flags.push('--typescript');
          if (vueOptions.jsx) flags.push('--jsx');
          if (vueOptions.router) flags.push('--router');
          if (vueOptions.pinia) flags.push('--pinia');
          if (vueOptions.vitest) flags.push('--vitest');
          if (vueOptions.playwright) flags.push('--playwright');
          if (vueOptions.eslint) flags.push('--eslint');
          if (vueOptions.prettier) flags.push('--prettier');
        }

        // If no flags, use default; otherwise use selected flags
        const vueFlags = flags.length > 0 ? flags.join(' ') : '--default';
        let vueCmd = `npm create vue@latest ${name} -- ${vueFlags}`;

        if (nodeVersion) {
          vueCmd = `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use ${nodeVersion} && ${vueCmd}`;
        }
        command = `cd "${projectPath}" && ${vueCmd}`;
        break;
      }
        
      case 'nuxt': {
        // Handle different Nuxt versions
        const version = nuxtVersion || '4';
        let nuxtCmd = '';
        
        if (version === '2') {
          // Nuxt 2.x - uses npm init nuxt-app (interactive, auto-accepts with yes)
          nuxtCmd = `yes "" | npm init nuxt-app ${name}`;
        } else if (version === '3') {
          // Nuxt 3.x - uses npm create nuxt with v3 template flag (auto-accepts with yes)
          nuxtCmd = `yes "" | npm create nuxt@latest ${name} -- -t v3`;
        } else {
          // Nuxt 4.x (default) - uses npm create nuxt with template selection
          const template = nuxtTemplate || 'minimal';
          nuxtCmd = `yes "" | npm create nuxt@latest ${name} -- -t ${template}`;
        }
        
        if (nodeVersion) {
          nuxtCmd = `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use ${nodeVersion} && ${nuxtCmd}`;
        }
        command = `cd "${projectPath}" && ${nuxtCmd}`;
        break;
      }
        
      case 'react': {
        // Use Vite for React (create-react-app is deprecated)
        // Auto-accept prompts with yes and install dependencies
        let reactCmd = `yes "" | npm create vite@latest ${name} -- --template react && cd ${name} && npm install`;
        if (nodeVersion) {
          reactCmd = `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use ${nodeVersion} && ${reactCmd}`;
        }
        command = `cd "${projectPath}" && ${reactCmd}`;
        break;
      }
        
      case 'wordpress':
        command = `cd "${projectPath}" && mkdir -p ${name} && cd ${name} && curl -O https://wordpress.org/latest.zip && unzip latest.zip && mv wordpress/* . && rmdir wordpress && rm latest.zip && chown -R $USER:$USER . && find . -type d -exec chmod 755 {} \\; && find . -type f -exec chmod 644 {} \\;`;
        break;
        
      default:
        reject(new Error('Unknown project type'));
        return;
    }

    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve({ success: true, path: fullPath });
      }
    });
  });
});

ipcMain.handle('configure-nginx', async (event, { domain, projectPath, port = 80, projectType = 'php', phpVersion = null, enableSSL = false }) => {
  return new Promise((resolve, reject) => {
    let nginxConfig = '';
    let sslGenerated = false;
    let hostsUpdated = false;

    // Helper function to add domain to /etc/hosts
    const addToHosts = (callback) => {
      // Check if domain already exists in /etc/hosts
      exec(`grep -q "127.0.0.1.*${domain}" /etc/hosts`, (grepError) => {
        if (grepError) {
          // Domain not found, add it
          const options = { name: 'LocalForge' };
          const hostsCommand = `echo "127.0.0.1    ${domain}" >> /etc/hosts`;
          sudo.exec(hostsCommand, options, (hostsError) => {
            if (hostsError) {
              console.error('Failed to update /etc/hosts:', hostsError);
              callback(false);
            } else {
              callback(true);
            }
          });
        } else {
          // Domain already exists
          callback(true);
        }
      });
    };

    // Generate configuration based on project type
    if (projectType === 'static-vue' || projectType === 'react') {
      // Static Vue/React SPA configuration - serves from /dist with SPA routing
      nginxConfig = `
server {
    listen ${port};
    listen [::]:${port};
    server_name ${domain};
    root ${projectPath}/dist;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.html;

    charset utf-8;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    location / {
        # SPA fallback - always serve index.html for Vue Router history mode
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    # Deny access to hidden files
    location ~ /\\. {
        deny all;
    }
}
${enableSSL ? `
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name ${domain};
    root ${projectPath}/dist;

    ssl_certificate /etc/nginx/ssl/${domain}.pem;
    ssl_certificate_key /etc/nginx/ssl/${domain}-key.pem;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.html;

    charset utf-8;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    location / {
        # SPA fallback - always serve index.html for Vue Router history mode
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    # Deny access to hidden files
    location ~ /\\. {
        deny all;
    }
}
` : ''}
`;
    } else if (projectType === 'static-html') {
      // Static HTML configuration - serves from root directory
      nginxConfig = `
server {
    listen ${port};
    listen [::]:${port};
    server_name ${domain};
    root ${projectPath};

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.html index.htm;

    charset utf-8;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    location / {
        try_files $uri $uri/ =404;
    }

    # Cache static assets
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    # Deny access to hidden files
    location ~ /\\. {
        deny all;
    }
}
${enableSSL ? `
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name ${domain};
    root ${projectPath};

    ssl_certificate /etc/nginx/ssl/${domain}.pem;
    ssl_certificate_key /etc/nginx/ssl/${domain}-key.pem;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.html index.htm;

    charset utf-8;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    location / {
        try_files $uri $uri/ =404;
    }

    # Cache static assets
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    # Deny access to hidden files
    location ~ /\\. {
        deny all;
    }
}
` : ''}
`;
    } else if (projectType === 'laravel') {
      // Laravel configuration - serves from /public directory
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
        nginxConfig = `
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
${enableSSL ? `
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name ${domain};
    root ${projectPath}/public;

    ssl_certificate /etc/nginx/ssl/${domain}.pem;
    ssl_certificate_key /etc/nginx/ssl/${domain}-key.pem;

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
` : ''}
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
            name: 'LocalForge',
          };

          const command = `mv "${tempConfigPath}" "${configPath}" && ln -sf "${configPath}" "${symlinkPath}" && nginx -t && systemctl reload nginx`;

          sudo.exec(command, options, (error, stdout, stderr) => {
            if (error) {
              reject(new Error(stderr || error.message));
            } else {
              // Add domain to /etc/hosts
              addToHosts((hostsResult) => {
                hostsUpdated = hostsResult;

                // Generate SSL if enabled
                if (enableSSL) {
                  const sslCommand = `mkdir -p /etc/nginx/ssl && cd /etc/nginx/ssl && mkcert ${domain}`;
                  sudo.exec(sslCommand, options, (sslError) => {
                    if (sslError) {
                      console.error('SSL generation failed:', sslError);
                    } else {
                      sslGenerated = true;
                    }
                    resolve({ success: true, configPath, phpFpmSocket, sslGenerated, sslPath: '/etc/nginx/ssl', hostsUpdated });
                  });
                } else {
                  resolve({ success: true, configPath, phpFpmSocket, sslGenerated, hostsUpdated });
                }
              });
            }
          });
        });
      });
      return; // End Laravel configuration flow
    } else if (projectType === 'wordpress') {
      // WordPress configuration - serves from root directory with WP-specific rules
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
        nginxConfig = `
server {
    listen ${port};
    listen [::]:${port};
    server_name ${domain};
    root ${projectPath};

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php index.html index.htm;

    charset utf-8;

    # WordPress permalink structure
    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    # Deny access to sensitive files
    location ~* /(?:uploads|files)/.*\\.php$ {
        deny all;
    }

    location = /favicon.ico {
        access_log off;
        log_not_found off;
    }

    location = /robots.txt {
        access_log off;
        log_not_found off;
        allow all;
    }

    # Deny access to .htaccess files
    location ~ /\\.ht {
        deny all;
    }

    # Process PHP files
    location ~ \\.php$ {
        try_files $uri =404;
        fastcgi_pass unix:${phpFpmSocket};
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Cache static assets
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires max;
        log_not_found off;
    }

    # Deny access to hidden files
    location ~ /\\. {
        deny all;
    }
}
${enableSSL ? `
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name ${domain};
    root ${projectPath};

    ssl_certificate /etc/nginx/ssl/${domain}.pem;
    ssl_certificate_key /etc/nginx/ssl/${domain}-key.pem;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php index.html index.htm;

    charset utf-8;

    # WordPress permalink structure
    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    # Deny access to sensitive files
    location ~* /(?:uploads|files)/.*\\.php$ {
        deny all;
    }

    location = /favicon.ico {
        access_log off;
        log_not_found off;
    }

    location = /robots.txt {
        access_log off;
        log_not_found off;
        allow all;
    }

    # Deny access to .htaccess files
    location ~ /\\.ht {
        deny all;
    }

    # Process PHP files
    location ~ \\.php$ {
        try_files $uri =404;
        fastcgi_pass unix:${phpFpmSocket};
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Cache static assets
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires max;
        log_not_found off;
    }

    # Deny access to hidden files
    location ~ /\\. {
        deny all;
    }
}
` : ''}
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
            name: 'LocalForge',
          };

          const command = `mv "${tempConfigPath}" "${configPath}" && ln -sf "${configPath}" "${symlinkPath}" && nginx -t && systemctl reload nginx`;

          sudo.exec(command, options, (error, stdout, stderr) => {
            if (error) {
              reject(new Error(stderr || error.message));
            } else {
              // Add domain to /etc/hosts
              addToHosts((hostsResult) => {
                hostsUpdated = hostsResult;

                // Generate SSL if enabled
                if (enableSSL) {
                  const sslCommand = `mkdir -p /etc/nginx/ssl && cd /etc/nginx/ssl && mkcert ${domain}`;
                  sudo.exec(sslCommand, options, (sslError) => {
                    if (sslError) {
                      console.error('SSL generation failed:', sslError);
                    } else {
                      sslGenerated = true;
                    }
                    resolve({ success: true, configPath, phpFpmSocket, sslGenerated, sslPath: '/etc/nginx/ssl', hostsUpdated });
                  });
                } else {
                  resolve({ success: true, configPath, phpFpmSocket, sslGenerated, hostsUpdated });
                }
              });
            }
          });
        });
      });
      return; // End WordPress configuration flow
    } else {
      // Generic PHP configuration - serves from root directory
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
        nginxConfig = `
server {
    listen ${port};
    listen [::]:${port};
    server_name ${domain};
    root ${projectPath};

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
${enableSSL ? `
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name ${domain};
    root ${projectPath};

    ssl_certificate /etc/nginx/ssl/${domain}.pem;
    ssl_certificate_key /etc/nginx/ssl/${domain}-key.pem;

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
` : ''}
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
            name: 'LocalForge',
          };

          const command = `mv "${tempConfigPath}" "${configPath}" && ln -sf "${configPath}" "${symlinkPath}" && nginx -t && systemctl reload nginx`;

          sudo.exec(command, options, (error, stdout, stderr) => {
            if (error) {
              reject(new Error(stderr || error.message));
            } else {
              // Add domain to /etc/hosts
              addToHosts((hostsResult) => {
                hostsUpdated = hostsResult;

                // Generate SSL if enabled
                if (enableSSL) {
                  const sslCommand = `mkdir -p /etc/nginx/ssl && cd /etc/nginx/ssl && mkcert ${domain}`;
                  sudo.exec(sslCommand, options, (sslError) => {
                    if (sslError) {
                      console.error('SSL generation failed:', sslError);
                    } else {
                      sslGenerated = true;
                    }
                    resolve({ success: true, configPath, phpFpmSocket, sslGenerated, sslPath: '/etc/nginx/ssl', hostsUpdated });
                  });
                } else {
                  resolve({ success: true, configPath, phpFpmSocket, sslGenerated, hostsUpdated });
                }
              });
            }
          });
        });
      });
      return; // End PHP configuration flow
    }

    // For Vue/Static, write config directly (no PHP-FPM detection needed)
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
        name: 'LocalForge',
      };

      const command = `mv "${tempConfigPath}" "${configPath}" && ln -sf "${configPath}" "${symlinkPath}" && nginx -t && systemctl reload nginx`;

      sudo.exec(command, options, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr || error.message));
        } else {
          // Add domain to /etc/hosts
          addToHosts((hostsResult) => {
            hostsUpdated = hostsResult;

            // Generate SSL if enabled
            if (enableSSL) {
              const sslCommand = `mkdir -p /etc/nginx/ssl && cd /etc/nginx/ssl && mkcert ${domain}`;
              const sslOptions = { name: 'LocalForge' };
              sudo.exec(sslCommand, sslOptions, (sslError) => {
                if (sslError) {
                  console.error('SSL generation failed:', sslError);
                } else {
                  sslGenerated = true;
                }
                resolve({ success: true, configPath, sslGenerated, sslPath: '/etc/nginx/ssl', hostsUpdated });
              });
            } else {
              resolve({ success: true, configPath, sslGenerated, hostsUpdated });
            }
          });
        }
      });
    });
  });
});

ipcMain.handle('generate-ssl', async (event, { domain }) => {
  return new Promise((resolve, reject) => {
    const sslDir = '/etc/nginx/ssl';
    const sslCommand = `mkdir -p ${sslDir} && cd ${sslDir} && mkcert ${domain}`;
    const options = { name: 'LocalForge' };

    sudo.exec(sslCommand, options, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve({ 
          success: true, 
          message: `SSL certificate generated for ${domain}`,
          path: `${sslDir}/${domain}.pem`
        });
      }
    });
  });
});

// List all Nginx configuration files
ipcMain.handle('list-nginx-configs', async () => {
  return new Promise((resolve, reject) => {
    exec('ls -1 /etc/nginx/sites-available/', (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }

      const configs = stdout.trim().split('\n').filter(name => name && name !== 'default');
      
      // Get details for each config
      const configDetails = [];
      let processed = 0;

      if (configs.length === 0) {
        resolve([]);
        return;
      }

      configs.forEach(name => {
        const availablePath = `/etc/nginx/sites-available/${name}`;
        const enabledPath = `/etc/nginx/sites-enabled/${name}`;

        fs.stat(availablePath, (err, stats) => {
          const isEnabled = fs.existsSync(enabledPath);

          // Check if SSL is configured by reading the config file
          fs.readFile(availablePath, 'utf8', (readErr, content) => {
            const hasSSL = !readErr && content && content.includes('listen 443 ssl');

            configDetails.push({
              name: name,
              path: availablePath,
              enabled: isEnabled,
              hasSSL: hasSSL,
              size: stats ? stats.size : 0,
              modified: stats ? stats.mtime : null
            });

            processed++;
            if (processed === configs.length) {
              resolve(configDetails);
            }
          });
        });
      });
    });
  });
});

// Delete Nginx configuration
ipcMain.handle('delete-nginx-config', async (event, { configName }) => {
  return new Promise((resolve, reject) => {
    const options = {
      name: 'LocalForge',
    };

    const availablePath = `/etc/nginx/sites-available/${configName}`;
    const enabledPath = `/etc/nginx/sites-enabled/${configName}`;

    const command = `rm -f "${enabledPath}" && rm -f "${availablePath}" && nginx -t && systemctl reload nginx`;

    sudo.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
      } else {
        resolve({ success: true, message: `Configuration ${configName} deleted successfully` });
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

// Helper function to detect Linux distribution
function detectDistro() {
  return new Promise((resolve) => {
    exec('cat /etc/os-release', (error, stdout) => {
      if (error) {
        resolve('unknown');
        return;
      }

      const lines = stdout.toLowerCase();
      if (lines.includes('ubuntu') || lines.includes('debian')) {
        resolve('debian');
      } else if (lines.includes('fedora') || lines.includes('rhel') || lines.includes('centos')) {
        resolve('redhat');
      } else if (lines.includes('arch')) {
        resolve('arch');
      } else {
        resolve('unknown');
      }
    });
  });
}

// Helper function to execute commands with sudo
function execSudo(command) {
  return new Promise((resolve, reject) => {
    const options = {
      name: 'LocalForge',
    };

    sudo.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
      } else {
        resolve({ success: true, stdout, stderr });
      }
    });
  });
}

// Install PHP Version
ipcMain.handle('install-php', async (event, { version }) => {
  const distro = await detectDistro();

  let command = '';

  if (distro === 'debian') {
    command = `add-apt-repository -y ppa:ondrej/php && apt-get update && apt-get install -y php${version} php${version}-cli php${version}-fpm php${version}-common php${version}-mbstring php${version}-xml php${version}-curl php${version}-zip`;
  } else if (distro === 'redhat') {
    command = `dnf install -y php${version} php${version}-cli php${version}-fpm php${version}-common php${version}-mbstring php${version}-xml`;
  } else if (distro === 'arch') {
    command = `pacman -S --noconfirm php`;
  } else {
    throw new Error('Unsupported distribution. Please install PHP manually.');
  }

  return execSudo(command);
});

// Install PHP Extensions
ipcMain.handle('install-php-extensions', async (event, { version, extensions }) => {
  const distro = await detectDistro();
  const extList = extensions.split(',').map(e => e.trim()).filter(e => e);

  let packages = [];

  if (distro === 'debian') {
    packages = extList.map(ext => `php${version}-${ext}`);
    const command = `apt-get install -y ${packages.join(' ')}`;
    return execSudo(command);
  } else if (distro === 'redhat') {
    packages = extList.map(ext => `php${version}-${ext}`);
    const command = `dnf install -y ${packages.join(' ')}`;
    return execSudo(command);
  } else if (distro === 'arch') {
    packages = extList.map(ext => `php-${ext}`);
    const command = `pacman -S --noconfirm ${packages.join(' ')}`;
    return execSudo(command);
  } else {
    throw new Error('Unsupported distribution');
  }
});

// Install Node.js Version
ipcMain.handle('install-node', async (event, { version }) => {
  return new Promise((resolve, reject) => {
    const command = `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm install ${version}`;

    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
      } else {
        resolve({ success: true, stdout });
      }
    });
  });
});

// Set Default Node.js Version
ipcMain.handle('set-default-node', async (event, { version }) => {
  return new Promise((resolve, reject) => {
    const command = `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm alias default ${version} && nvm use ${version}`;

    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
      } else {
        resolve({ success: true, stdout });
      }
    });
  });
});

// Install Nginx
ipcMain.handle('install-nginx', async () => {
  const distro = await detectDistro();

  let command = '';

  if (distro === 'debian') {
    command = 'apt-get update && apt-get install -y nginx && systemctl enable nginx && systemctl start nginx';
  } else if (distro === 'redhat') {
    command = 'dnf install -y nginx && systemctl enable nginx && systemctl start nginx';
  } else if (distro === 'arch') {
    command = 'pacman -S --noconfirm nginx && systemctl enable nginx && systemctl start nginx';
  } else {
    throw new Error('Unsupported distribution');
  }

  return execSudo(command);
});

// Install Composer
ipcMain.handle('install-composer', async () => {
  return new Promise((resolve, reject) => {
    const command = 'curl -sS https://getcomposer.org/installer | php && mv composer.phar /usr/local/bin/composer && chmod +x /usr/local/bin/composer';

    const options = {
      name: 'LocalForge',
    };

    sudo.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
      } else {
        resolve({ success: true });
      }
    });
  });
});

// Install PostgreSQL
ipcMain.handle('install-postgresql', async (event, { version }) => {
  const distro = await detectDistro();

  let command = '';

  if (distro === 'debian') {
    if (version) {
      command = `apt-get update && apt-get install -y postgresql-${version} postgresql-client-${version} && systemctl enable postgresql && systemctl start postgresql`;
    } else {
      command = 'apt-get update && apt-get install -y postgresql postgresql-contrib && systemctl enable postgresql && systemctl start postgresql';
    }
  } else if (distro === 'redhat') {
    if (version) {
      command = `dnf install -y postgresql${version}-server postgresql${version} && postgresql-setup --initdb && systemctl enable postgresql && systemctl start postgresql`;
    } else {
      command = 'dnf install -y postgresql-server postgresql && postgresql-setup --initdb && systemctl enable postgresql && systemctl start postgresql';
    }
  } else if (distro === 'arch') {
    command = 'pacman -S --noconfirm postgresql && su - postgres -c "initdb -D /var/lib/postgres/data" && systemctl enable postgresql && systemctl start postgresql';
  } else {
    throw new Error('Unsupported distribution');
  }

  return execSudo(command);
});

// Install MySQL
ipcMain.handle('install-mysql', async () => {
  const distro = await detectDistro();

  let command = '';

  if (distro === 'debian') {
    command = 'apt-get update && apt-get install -y mysql-server && systemctl enable mysql && systemctl start mysql';
  } else if (distro === 'redhat') {
    command = 'dnf install -y mysql-server && systemctl enable mysqld && systemctl start mysqld';
  } else if (distro === 'arch') {
    command = 'pacman -S --noconfirm mysql && mysqld --initialize-insecure --user=mysql --basedir=/usr --datadir=/var/lib/mysql && systemctl enable mysqld && systemctl start mysqld';
  } else {
    throw new Error('Unsupported distribution');
  }

  return execSudo(command);
});

// Check installed tools and versions
ipcMain.handle('check-installed-tools', async () => {
  const results = {
    php: { installed: false, versions: [] },
    node: { installed: false, versions: [], default: null },
    nginx: { installed: false, version: null },
    composer: { installed: false, version: null },
    postgresql: { installed: false, version: null },
    mysql: { installed: false, version: null }
  };

  return new Promise((resolve) => {
    const checks = [];

    // Check PHP versions
    checks.push(
      new Promise((res) => {
        exec('php -v 2>/dev/null', (error, stdout) => {
          if (!error && stdout) {
            results.php.installed = true;
            const match = stdout.match(/PHP (\d+\.\d+\.\d+)/);
            if (match) {
              results.php.versions.push(match[1]);
            }
          }

          exec('ls /usr/bin/php* 2>/dev/null | grep -E "php[0-9]" | sed "s/.*php//" | sort -u', (err, out) => {
            if (!err && out) {
              const versions = out.trim().split('\n').filter(v => v);
              results.php.versions = [...new Set([...results.php.versions, ...versions])];
              results.php.installed = results.php.versions.length > 0;
            }
            res();
          });
        });
      })
    );

    // Check Node.js versions
    checks.push(
      new Promise((res) => {
        exec('export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm list 2>/dev/null', (error, stdout) => {
          if (!error && stdout) {
            results.node.installed = true;
            const versions = stdout.match(/v\d+\.\d+\.\d+/g);
            if (versions) {
              // Remove duplicates
              const uniqueVersions = [...new Set(versions.map(v => v.substring(1)))];

              // Group by major version and keep only the latest version
              const versionMap = new Map();
              uniqueVersions.forEach(version => {
                const [major, minor, patch] = version.split('.').map(Number);
                const existing = versionMap.get(major);

                // Keep the version with highest minor.patch
                if (!existing ||
                    minor > existing.minor ||
                    (minor === existing.minor && patch > existing.patch)) {
                  versionMap.set(major, { major, minor, patch, version });
                }
              });

              // Convert to array and sort in descending order (newest first)
              results.node.versions = Array.from(versionMap.values())
                .sort((a, b) => {
                  if (a.major !== b.major) return b.major - a.major;
                  if (a.minor !== b.minor) return b.minor - a.minor;
                  return b.patch - a.patch;
                })
                .map(v => v.version);
            }

            const defaultMatch = stdout.match(/default -> (v\d+\.\d+\.\d+)/);
            if (defaultMatch) {
              results.node.default = defaultMatch[1].substring(1);
            }
          }
          res();
        });
      })
    );

    // Check Nginx
    checks.push(
      new Promise((res) => {
        exec('nginx -v 2>&1', (error, stdout, stderr) => {
          const output = stdout || stderr;
          if (!error && output) {
            results.nginx.installed = true;
            const match = output.match(/nginx\/(\d+\.\d+\.\d+)/);
            if (match) {
              results.nginx.version = match[1];
            }
          }
          res();
        });
      })
    );

    // Check Composer
    checks.push(
      new Promise((res) => {
        exec('composer --version 2>/dev/null', (error, stdout) => {
          if (!error && stdout) {
            results.composer.installed = true;
            const match = stdout.match(/Composer version (\d+\.\d+\.\d+)/);
            if (match) {
              results.composer.version = match[1];
            }
          }
          res();
        });
      })
    );

    // Check PostgreSQL
    checks.push(
      new Promise((res) => {
        exec('psql --version 2>/dev/null', (error, stdout) => {
          if (!error && stdout) {
            results.postgresql.installed = true;
            const match = stdout.match(/PostgreSQL\) (\d+\.\d+)/);
            if (match) {
              results.postgresql.version = match[1];
            }
          }
          res();
        });
      })
    );

    // Check MySQL
    checks.push(
      new Promise((res) => {
        exec('mysql --version 2>/dev/null', (error, stdout) => {
          if (!error && stdout) {
            results.mysql.installed = true;
            const match = stdout.match(/Distrib (\d+\.\d+\.\d+)/);
            if (match) {
              results.mysql.version = match[1];
            }
          }
          res();
        });
      })
    );

    Promise.all(checks).then(() => {
      resolve(results);
    });
  });
});
