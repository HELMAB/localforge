const { exec, spawn } = require('child_process')
const { detectDistro, execSudo } = require('../utils/helpers')
const fs = require('fs')

async function installPhp(version) {
  const distro = await detectDistro()
  let command = ''

  if (distro === 'debian') {
    command = `add-apt-repository -y ppa:ondrej/php && apt-get update && apt-get install -y php${version} php${version}-cli php${version}-fpm php${version}-common php${version}-mbstring php${version}-xml php${version}-curl php${version}-zip`
  } else if (distro === 'redhat') {
    command = `dnf install -y php${version} php${version}-cli php${version}-fpm php${version}-common php${version}-mbstring php${version}-xml`
  } else if (distro === 'arch') {
    command = `pacman -S --noconfirm php`
  } else {
    throw new Error('Unsupported distribution. Please install PHP manually.')
  }

  return await execSudo(command)
}

async function installPhpExtensions(version, extensions) {
  const distro = await detectDistro()
  const extList = extensions
    .split(',')
    .map((e) => e.trim())
    .filter((e) => e)

  let packages = []
  let command = ''

  if (distro === 'debian') {
    packages = extList.map((ext) => `php${version}-${ext}`)
    command = `apt-get install -y ${packages.join(' ')}`
  } else if (distro === 'redhat') {
    packages = extList.map((ext) => `php${version}-${ext}`)
    command = `dnf install -y ${packages.join(' ')}`
  } else if (distro === 'arch') {
    packages = extList.map((ext) => `php-${ext}`)
    command = `pacman -S --noconfirm ${packages.join(' ')}`
  } else {
    throw new Error('Unsupported distribution')
  }

  return await execSudo(command)
}

function getPhpIniPath(version, type = 'cli') {
  return new Promise((resolve, reject) => {
    const command =
      type === 'fpm'
        ? `php-fpm${version} -i 2>/dev/null | grep "Loaded Configuration File" | awk '{print $5}'`
        : `php${version} -i 2>/dev/null | grep "Loaded Configuration File" | awk '{print $5}'`

    exec(command, (error, stdout) => {
      if (error || !stdout.trim()) {
        const commonPaths =
          type === 'fpm'
            ? [`/etc/php/${version}/fpm/php.ini`, `/etc/php${version}/fpm/php.ini`]
            : [`/etc/php/${version}/cli/php.ini`, `/etc/php${version}/cli/php.ini`]

        for (const path of commonPaths) {
          if (fs.existsSync(path)) {
            resolve(path)
            return
          }
        }
        reject(new Error('PHP INI file not found'))
      } else {
        resolve(stdout.trim())
      }
    })
  })
}

function readPhpIni(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (error, data) => {
      if (error) {
        reject(new Error(`Cannot read file: ${error.message}`))
      } else {
        resolve(data)
      }
    })
  })
}

function writePhpIni(filePath, content) {
  const command = `echo '${content.replace(/'/g, "'\\''")}' > ${filePath}`
  return execSudo(command)
}

async function listPhpExtensions(version) {
  const distro = await detectDistro()
  let command = ''

  if (distro === 'debian') {
    command = `apt-cache search php${version}- | grep "^php${version}-" | awk '{print $1}' | sed 's/php${version}-//' | sort`
  } else if (distro === 'redhat') {
    command = `dnf search php${version}- 2>/dev/null | grep "^php${version}-" | awk '{print $1}' | sed 's/php${version}-//' | sort`
  } else if (distro === 'arch') {
    command = `pacman -Ss php- | grep "^extra/php-" | awk '{print $1}' | sed 's/extra\\/php-//' | sort`
  } else {
    throw new Error('Unsupported distribution')
  }

  return new Promise((resolve) => {
    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout) => {
      if (error) {
        resolve([])
      } else {
        const extensions = stdout
          .trim()
          .split('\n')
          .filter((e) => e)
        resolve(extensions)
      }
    })
  })
}

function getInstalledPhpExtensions(version) {
  return new Promise((resolve) => {
    const command = `php${version} -m 2>/dev/null`

    exec(command, (error, stdout) => {
      if (error) {
        resolve([])
      } else {
        const lines = stdout.trim().split('\n')
        const extensions = []
        let inModules = false

        for (const line of lines) {
          if (line.startsWith('[') && line.includes('Modules]')) {
            inModules = true
            continue
          }
          if (line.trim() && inModules && !line.startsWith('[')) {
            extensions.push(line.trim().toLowerCase())
          }
        }

        resolve(extensions)
      }
    })
  })
}

function installNode(version, event) {
  return new Promise((resolve, reject) => {
    const command = `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm install ${version}`

    const childProcess = spawn('bash', ['-c', command])
    let output = ''
    let errorOutput = ''

    childProcess.stdout.on('data', (data) => {
      const text = data.toString()
      output += text
      event.sender.send('install-node-output', { type: 'stdout', data: text })
    })

    childProcess.stderr.on('data', (data) => {
      const text = data.toString()
      errorOutput += text
      event.sender.send('install-node-output', { type: 'stderr', data: text })
    })

    childProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(errorOutput || `Installation failed with code ${code}`))
      } else {
        resolve({ success: true, output: output + errorOutput })
      }
    })

    childProcess.on('error', (err) => {
      reject(new Error(err.message))
    })
  })
}

function setDefaultNode(version) {
  return new Promise((resolve, reject) => {
    const command = `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm alias default ${version} && nvm use ${version}`

    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message))
      } else {
        resolve({ success: true, stdout })
      }
    })
  })
}

function uninstallNode(version) {
  return new Promise((resolve, reject) => {
    const versionWithPrefix = version.startsWith('v') ? version : `v${version}`
    const command = `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm uninstall ${versionWithPrefix} && nvm cache clear`

    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        if (stderr.includes('not installed') || stderr.includes('not found')) {
          resolve({ success: true, message: 'Version was not installed or already removed' })
        } else {
          reject(new Error(stderr || error.message))
        }
      } else {
        resolve({ success: true, stdout })
      }
    })
  })
}

async function installNginx() {
  const distro = await detectDistro()
  let command = ''

  if (distro === 'debian') {
    command = 'apt-get update && apt-get install -y nginx && systemctl enable nginx && systemctl start nginx'
  } else if (distro === 'redhat') {
    command = 'dnf install -y nginx && systemctl enable nginx && systemctl start nginx'
  } else if (distro === 'arch') {
    command = 'pacman -S --noconfirm nginx && systemctl enable nginx && systemctl start nginx'
  } else {
    throw new Error('Unsupported distribution')
  }

  return await execSudo(command)
}

function installComposer() {
  const command = 'curl -sS https://getcomposer.org/installer | php && mv composer.phar /usr/local/bin/composer && chmod +x /usr/local/bin/composer'
  return execSudo(command)
}

async function installPostgreSQL(version) {
  const distro = await detectDistro()
  let command = ''

  if (distro === 'debian') {
    if (version) {
      command = `apt-get update && apt-get install -y postgresql-${version} postgresql-client-${version} && systemctl enable postgresql && systemctl start postgresql`
    } else {
      command = 'apt-get update && apt-get install -y postgresql postgresql-contrib && systemctl enable postgresql && systemctl start postgresql'
    }
  } else if (distro === 'redhat') {
    if (version) {
      command = `dnf install -y postgresql${version}-server postgresql${version} && postgresql-setup --initdb && systemctl enable postgresql && systemctl start postgresql`
    } else {
      command = 'dnf install -y postgresql-server postgresql && postgresql-setup --initdb && systemctl enable postgresql && systemctl start postgresql'
    }
  } else if (distro === 'arch') {
    command = 'pacman -S --noconfirm postgresql && su - postgres -c "initdb -D /var/lib/postgres/data" && systemctl enable postgresql && systemctl start postgresql'
  } else {
    throw new Error('Unsupported distribution')
  }

  return await execSudo(command)
}

async function installMySQL() {
  const distro = await detectDistro()
  let command = ''

  if (distro === 'debian') {
    command = 'apt-get update && apt-get install -y mysql-server && systemctl enable mysql && systemctl start mysql'
  } else if (distro === 'redhat') {
    command = 'dnf install -y mysql-server && systemctl enable mysqld && systemctl start mysqld'
  } else if (distro === 'arch') {
    command = 'pacman -S --noconfirm mysql && mysqld --initialize-insecure --user=mysql --basedir=/usr --datadir=/var/lib/mysql && systemctl enable mysqld && systemctl start mysqld'
  } else {
    throw new Error('Unsupported distribution')
  }

  return await execSudo(command)
}

function checkInstalledTools() {
  return new Promise((resolve) => {
    const results = {
      php: { installed: false, versions: [] },
      node: { installed: false, versions: [], default: null, current: null },
      nginx: { installed: false, version: null },
      composer: { installed: false, version: null },
      postgresql: { installed: false, version: null },
      mysql: { installed: false, version: null },
    }

    const checks = []

    checks.push(
      new Promise((res) => {
        exec('ls /usr/bin/php* 2>/dev/null | grep -E "php[0-9]" | sed "s/.*php//" | sort -Vr', (err, out) => {
          if (!err && out) {
            const versions = out
              .trim()
              .split('\n')
              .filter((v) => v && v.match(/^\d+\.\d+$/))
            results.php.versions = [...new Set(versions)]
            results.php.installed = results.php.versions.length > 0
          }
          res()
        })
      })
    )

    checks.push(
      new Promise((res) => {
        exec('export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm ls 2>/dev/null', (error, stdout) => {
          if (!error && stdout) {
            results.node.installed = true
            const versionSet = new Set()

            const lines = stdout.split('\n')
            lines.forEach((line) => {
              if (
                line.includes('-> N/A') ||
                line.includes('lts/') ||
                line.includes('default ->') ||
                line.includes('iojs ->') ||
                line.includes('node ->') ||
                line.includes('stable ->') ||
                line.includes('unstable ->') ||
                line.trim() === 'system'
              ) {
                return
              }

              const match = line.match(/(?:^|\s+)(?:->)?\s*\*?\s*(v\d+\.\d+\.\d+)/)
              if (match && !line.includes('(')) {
                const version = match[1].substring(1)
                versionSet.add(version)
              }
            })

            if (versionSet.size > 0) {
              results.node.versions = Array.from(versionSet).sort((a, b) => {
                const [aMajor, aMinor, aPatch] = a.split('.').map(Number)
                const [bMajor, bMinor, bPatch] = b.split('.').map(Number)

                if (aMajor !== bMajor) return bMajor - aMajor
                if (aMinor !== bMinor) return bMinor - aMinor
                return bPatch - aPatch
              })
            }

            const defaultMatch = stdout.match(/default\s*->\s*(v\d+\.\d+\.\d+)/)
            if (defaultMatch) {
              results.node.default = defaultMatch[1].substring(1)
            }
          }

          exec('export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm current 2>/dev/null', (err, out) => {
            if (!err && out) {
              const currentVersion = out.trim()
              if (currentVersion && currentVersion.startsWith('v') && !currentVersion.includes('system')) {
                results.node.current = currentVersion.substring(1)
              }
            }
            res()
          })
        })
      })
    )

    checks.push(
      new Promise((res) => {
        exec('nginx -v 2>&1', (error, stdout, stderr) => {
          const output = stdout || stderr
          if (!error && output) {
            results.nginx.installed = true
            const match = output.match(/nginx\/(\d+\.\d+\.\d+)/)
            if (match) {
              results.nginx.version = match[1]
            }
          }
          res()
        })
      })
    )

    checks.push(
      new Promise((res) => {
        exec('composer --version 2>/dev/null', (error, stdout) => {
          if (!error && stdout) {
            results.composer.installed = true
            const match = stdout.match(/Composer version (\d+\.\d+\.\d+)/)
            if (match) {
              results.composer.version = match[1]
            }
          }
          res()
        })
      })
    )

    checks.push(
      new Promise((res) => {
        exec('psql --version 2>/dev/null', (error, stdout) => {
          if (!error && stdout) {
            results.postgresql.installed = true
            const match = stdout.match(/PostgreSQL\) (\d+\.\d+)/)
            if (match) {
              results.postgresql.version = match[1]
            }
          }
          res()
        })
      })
    )

    checks.push(
      new Promise((res) => {
        exec('mysql --version 2>/dev/null', (error, stdout) => {
          if (!error && stdout) {
            results.mysql.installed = true
            const match = stdout.match(/Distrib (\d+\.\d+\.\d+)/)
            if (match) {
              results.mysql.version = match[1]
            }
          }
          res()
        })
      })
    )

    Promise.all(checks).then(() => {
      resolve(results)
    })
  })
}

module.exports = {
  installPhp,
  installPhpExtensions,
  getPhpIniPath,
  readPhpIni,
  writePhpIni,
  listPhpExtensions,
  getInstalledPhpExtensions,
  installNode,
  setDefaultNode,
  uninstallNode,
  installNginx,
  installComposer,
  installPostgreSQL,
  installMySQL,
  checkInstalledTools,
}
