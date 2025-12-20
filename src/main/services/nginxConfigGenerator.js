function generateNginxConfig({ domain, projectPath, port, projectType, phpFpmSocket, enableSSL }) {
  const configs = {
    nuxt: generateNuxtConfig,
    'static-nuxt': generateNuxtConfig,
    'static-vue': generateStaticSpaConfig,
    react: generateStaticSpaConfig,
    'static-html': generateStaticHtmlConfig,
    laravel: generatePhpConfig,
    wordpress: generateWordPressConfig,
  }

  const generator = configs[projectType] || generatePhpConfig
  return generator({ domain, projectPath, port, phpFpmSocket, enableSSL, projectType })
}

function generateNuxtConfig({ domain, projectPath, port, enableSSL }) {
  const httpBlock = `
server {
    listen ${port};
    listen [::]:${port};
    server_name ${domain};
    root ${projectPath}/.output/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.html;

    charset utf-8;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    location ~ /\\. {
        deny all;
    }
}
`

  const httpsBlock = enableSSL
    ? `
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name ${domain};
    root ${projectPath}/.output/public;

    ssl_certificate /etc/nginx/ssl/${domain}.pem;
    ssl_certificate_key /etc/nginx/ssl/${domain}-key.pem;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.html;

    charset utf-8;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    location ~ /\\. {
        deny all;
    }
}
`
    : ''

  return httpBlock + httpsBlock
}

function generateStaticSpaConfig({ domain, projectPath, port, enableSSL }) {
  const httpBlock = `
server {
    listen ${port};
    listen [::]:${port};
    server_name ${domain};
    root ${projectPath}/dist;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.html;

    charset utf-8;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    location ~ /\\. {
        deny all;
    }
}
`

  const httpsBlock = enableSSL
    ? `
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

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    location ~ /\\. {
        deny all;
    }
}
`
    : ''

  return httpBlock + httpsBlock
}

function generateStaticHtmlConfig({ domain, projectPath, port, enableSSL }) {
  const httpBlock = `
server {
    listen ${port};
    listen [::]:${port};
    server_name ${domain};
    root ${projectPath};

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.html index.htm;

    charset utf-8;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    location ~ /\\. {
        deny all;
    }
}
`

  const httpsBlock = enableSSL
    ? `
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

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    location ~ /\\. {
        deny all;
    }
}
`
    : ''

  return httpBlock + httpsBlock
}

function generatePhpConfig({ domain, projectPath, port, phpFpmSocket, enableSSL, projectType }) {
  const isLaravel = projectType === 'laravel'
  const root = isLaravel ? `${projectPath}/public` : projectPath

  const httpBlock = `
server {
    listen ${port};
    listen [::]:${port};
    server_name ${domain};
    root ${root};

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
`

  const httpsBlock = enableSSL
    ? `
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name ${domain};
    root ${root};

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
`
    : ''

  return httpBlock + httpsBlock
}

function generateWordPressConfig({ domain, projectPath, port, phpFpmSocket, enableSSL }) {
  const httpBlock = `
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
        try_files $uri $uri/ /index.php?$args;
    }

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

    location ~ /\\.ht {
        deny all;
    }

    location ~ \\.php$ {
        try_files $uri =404;
        fastcgi_pass unix:${phpFpmSocket};
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires max;
        log_not_found off;
    }

    location ~ /\\. {
        deny all;
    }
}
`

  const httpsBlock = enableSSL
    ? `
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
        try_files $uri $uri/ /index.php?$args;
    }

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

    location ~ /\\.ht {
        deny all;
    }

    location ~ \\.php$ {
        try_files $uri =404;
        fastcgi_pass unix:${phpFpmSocket};
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires max;
        log_not_found off;
    }

    location ~ /\\. {
        deny all;
    }
}
`
    : ''

  return httpBlock + httpsBlock
}

module.exports = {
  generateNginxConfig,
}
