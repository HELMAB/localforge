# Nginx Configuration Guide

## How It Works

When you configure Nginx through this app, here's what happens:

1. **App creates config**: The app generates an Nginx configuration file with your settings
2. **Writes to temp**: First writes to a temporary file (no sudo needed)
3. **Password prompt**: `sudo-prompt` shows a system password dialog
4. **Moves with sudo**: After you enter password, it moves the file to `/etc/nginx/sites-available/`
5. **Creates symlink**: Links the config to `/etc/nginx/sites-enabled/`
6. **Tests config**: Runs `nginx -t` to validate
7. **Reloads Nginx**: Reloads Nginx to apply changes

## Troubleshooting

### No Password Prompt Appears

If you don't see a password dialog:

1. **Check sudo-prompt installation**:
   ```bash
   cd /home/h-mab/learn/devtools/dev-tools-app
   npm list sudo-prompt
   ```

2. **Reinstall if needed**:
   ```bash
   npm install sudo-prompt
   ```

3. **Try pkexec instead** (for some Linux systems):
   - Edit `src/main/main.js`
   - Change the sudo command to use `pkexec`

### Permission Denied Error

```
Error: EACCES: permission denied, open '/etc/nginx/sites-available/mysite.com'
```

**This means**: The app tried to write directly to `/etc/nginx/` without sudo.

**Fixed in latest version**: The app now:
- Writes to `/tmp/` first
- Uses `sudo-prompt` to move with elevated privileges

### Manual Configuration

If the automated configuration doesn't work, you can configure manually:

```bash
# 1. Create the config file
sudo nano /etc/nginx/sites-available/myproject.local

# 2. Paste this configuration (adjust as needed):
server {
    listen 80;
    listen [::]:80;
    server_name myproject.local;
    root /path/to/your/project/public;

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

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}

# 3. Save and exit (Ctrl+X, Y, Enter)

# 4. Create symlink
sudo ln -sf /etc/nginx/sites-available/myproject.local /etc/nginx/sites-enabled/

# 5. Test configuration
sudo nginx -t

# 6. Reload Nginx
sudo systemctl reload nginx

# 7. Add to hosts file
sudo nano /etc/hosts
# Add: 127.0.0.1 myproject.local

# 8. Test in browser
# Visit: http://myproject.local
```

## Different Project Types

### For Laravel/PHP Projects
```nginx
root /path/to/project/public;

location ~ \.php$ {
    fastcgi_pass unix:/var/run/php/php-fpm.sock;
    fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
    include fastcgi_params;
}
```

### For Vue/React/Nuxt (SPA)
```nginx
root /path/to/project/dist;  # or /build

location / {
    try_files $uri $uri/ /index.html;
}
```

### For Node.js/Express (Reverse Proxy)
```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

### For WordPress
```nginx
root /path/to/wordpress;

location / {
    try_files $uri $uri/ /index.php?$args;
}

location ~ \.php$ {
    fastcgi_pass unix:/var/run/php/php-fpm.sock;
    fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
    include fastcgi_params;
}
```

## Useful Commands

```bash
# Check Nginx configuration syntax
sudo nginx -t

# Reload Nginx (apply changes without downtime)
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# Check Nginx status
sudo systemctl status nginx

# View Nginx error log
sudo tail -f /var/log/nginx/error.log

# View Nginx access log
sudo tail -f /var/log/nginx/access.log

# List all enabled sites
ls -la /etc/nginx/sites-enabled/

# Remove a site
sudo rm /etc/nginx/sites-enabled/mysite.com
sudo systemctl reload nginx

# Check which process is using port 80
sudo lsof -i :80

# Check if Nginx is running
ps aux | grep nginx
```

## Common Issues

### Port 80 Already in Use
```bash
# Check what's using port 80
sudo lsof -i :80

# If it's Apache, stop it
sudo systemctl stop apache2
sudo systemctl disable apache2

# Start Nginx
sudo systemctl start nginx
```

### PHP-FPM Not Running
```bash
# Check PHP-FPM status
sudo systemctl status php8.1-fpm  # or php8.2-fpm, php7.4-fpm, etc.

# Start it
sudo systemctl start php8.1-fpm

# Find the socket path
sudo find /var/run -name "*php*fpm*sock"
```

### 403 Forbidden Error
```bash
# Check permissions
ls -la /path/to/your/project

# Fix ownership
sudo chown -R www-data:www-data /path/to/your/project

# Or for development
sudo chown -R $USER:www-data /path/to/your/project
sudo chmod -R 755 /path/to/your/project
```

### Site Not Loading
1. Check `/etc/hosts` has the domain: `127.0.0.1 mysite.local`
2. Check Nginx config: `sudo nginx -t`
3. Check if Nginx is running: `sudo systemctl status nginx`
4. Check error logs: `sudo tail -f /var/log/nginx/error.log`
5. Clear browser cache or try incognito mode

## Security Notes

⚠️ **Important:**
- Only configure Nginx for local development
- Don't expose port 80 to the internet without proper security
- Use SSL/HTTPS for production (use the SSL tab in the app)
- Keep Nginx and PHP updated
- Review generated configurations before applying

---

For more help, check:
- Official Nginx docs: https://nginx.org/en/docs/
- PHP-FPM docs: https://www.php.net/manual/en/install.fpm.php
- This app's SETUP.md file
