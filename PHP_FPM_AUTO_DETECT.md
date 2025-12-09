# PHP-FPM Auto-Detection Feature

## Overview

The Nginx configuration now **automatically detects and uses the correct PHP-FPM version** based on your selection or system availability.

## How It Works

### 1. Auto-Detection (Default)

When you select **"Auto-detect (ស្វ័យប្រវត្តិ)"**:

```bash
# The app scans for available PHP-FPM sockets
ls -1 /var/run/php/php*-fpm.sock

# Example output:
/var/run/php/php8.2-fpm.sock
/var/run/php/php8.1-fpm.sock
/var/run/php/php7.4-fpm.sock

# Uses the first one found
```

**Result:** 
- Nginx config uses: `fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;`

### 2. Manual Selection

When you select a specific version (e.g., **PHP 8.2-FPM**):

```bash
# The app uses the specific socket path
/var/run/php/php8.2-fpm.sock
```

**Result:**
- Nginx config uses: `fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;`

### 3. Fallback

If no PHP-FPM socket is found:

```bash
# Falls back to default
/var/run/php/php-fpm.sock
```

## Usage

### Step 1: Configure Nginx with PHP Version

1. Go to **Configure Nginx** tab
2. Enter domain name
3. Select project path
4. **Select PHP-FPM Version:**
   - **Auto-detect**: Automatically finds available PHP-FPM
   - **PHP 8.3-FPM**: Use PHP 8.3
   - **PHP 8.2-FPM**: Use PHP 8.2
   - **PHP 8.1-FPM**: Use PHP 8.1
   - **PHP 8.0-FPM**: Use PHP 8.0
   - **PHP 7.4-FPM**: Use PHP 7.4
5. Set port (default: 80)
6. Click **Configure**

### Step 2: Verification

After successful configuration, you'll see:

```
Nginx configured successfully!
PHP-FPM: /var/run/php/php8.2-fpm.sock

Don't forget:
1. Add "example.local" to /etc/hosts
2. Run: sudo nano /etc/hosts
3. Add: 127.0.0.1 example.local
```

The **PHP-FPM socket path** is displayed so you know which version is being used!

## Example Nginx Configuration

### With PHP 8.2

```nginx
server {
    listen 80;
    server_name example.local;
    root /home/user/projects/my-app/public;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### With Auto-Detect (Found PHP 8.1)

```nginx
server {
    listen 80;
    server_name example.local;
    root /home/user/projects/my-app/public;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

## Installing Multiple PHP-FPM Versions

### Ubuntu/Debian

```bash
# Add PHP repository
sudo add-apt-repository ppa:ondrej/php
sudo apt update

# Install multiple PHP-FPM versions
sudo apt install php8.3-fpm php8.2-fpm php8.1-fpm php8.0-fpm php7.4-fpm

# Check installed versions
ls -la /var/run/php/

# Output:
# php7.4-fpm.sock
# php8.0-fpm.sock
# php8.1-fpm.sock
# php8.2-fpm.sock
# php8.3-fpm.sock
```

### Starting/Stopping PHP-FPM

```bash
# Check status
sudo systemctl status php8.2-fpm

# Start
sudo systemctl start php8.2-fpm

# Stop
sudo systemctl stop php8.2-fpm

# Restart
sudo systemctl restart php8.2-fpm

# Enable on boot
sudo systemctl enable php8.2-fpm
```

## Troubleshooting

### Issue: PHP-FPM socket not found

**Error:**
```
nginx: [emerg] connect() to unix:/var/run/php/php8.2-fpm.sock failed
```

**Solution:**

1. **Check if PHP-FPM is installed:**
   ```bash
   php8.2 -v
   ```

2. **Check if service is running:**
   ```bash
   sudo systemctl status php8.2-fpm
   ```

3. **Start the service:**
   ```bash
   sudo systemctl start php8.2-fpm
   ```

4. **Verify socket exists:**
   ```bash
   ls -la /var/run/php/php8.2-fpm.sock
   ```

### Issue: Wrong PHP version being used

**Check which PHP-FPM is running:**

```bash
ps aux | grep php-fpm
```

**Output:**
```
root      1234  php-fpm: master process (/etc/php/8.2/fpm/php-fpm.conf)
www-data  1235  php-fpm: pool www
www-data  1236  php-fpm: pool www
```

**Switch PHP-FPM version:**

```bash
# Stop current version
sudo systemctl stop php8.1-fpm

# Start desired version
sudo systemctl start php8.2-fpm

# Restart Nginx
sudo systemctl restart nginx
```

### Issue: Multiple PHP-FPM versions running

**List all running PHP-FPM:**

```bash
sudo systemctl list-units | grep php
```

**Stop unwanted versions:**

```bash
sudo systemctl stop php7.4-fpm
sudo systemctl stop php8.0-fpm
sudo systemctl disable php7.4-fpm  # Disable on boot
```

## Advanced Configuration

### Using Different PHP Versions for Different Sites

**Site 1 (Laravel 10 - PHP 8.2):**
```nginx
server {
    server_name laravel10.local;
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
    }
}
```

**Site 2 (Legacy App - PHP 7.4):**
```nginx
server {
    server_name legacy.local;
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
    }
}
```

### Using TCP Instead of Unix Socket

Some systems use TCP ports instead of sockets:

```nginx
location ~ \.php$ {
    fastcgi_pass 127.0.0.1:9000;  # Default PHP-FPM port
    # OR
    fastcgi_pass 127.0.0.1:9082;  # PHP 8.2 custom port
}
```

**Configure PHP-FPM to listen on TCP:**

Edit `/etc/php/8.2/fpm/pool.d/www.conf`:

```ini
; Listen on TCP instead of socket
listen = 127.0.0.1:9082

; OR keep socket (default)
listen = /var/run/php/php8.2-fpm.sock
```

## Benefits

✅ **Automatic:** No manual socket path editing
✅ **Flexible:** Choose specific version or auto-detect
✅ **Safe:** Falls back to default if socket not found
✅ **Clear:** Shows which socket is being used
✅ **Multi-version:** Supports multiple PHP-FPM installations
✅ **Smart:** Detects what's available on your system

## Socket Path Patterns

Different systems use different paths:

### Ubuntu/Debian
```
/var/run/php/php8.2-fpm.sock
/var/run/php/php-fpm.sock
```

### CentOS/RHEL
```
/var/run/php-fpm/php8.2-fpm.sock
/var/run/php-fpm/www.sock
```

### macOS (Homebrew)
```
/usr/local/var/run/php/php8.2-fpm.sock
```

The app will automatically find the correct path!

---

**�� Your Nginx configurations now automatically match your PHP-FPM version!**
