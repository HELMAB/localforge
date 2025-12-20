const path = require('path')
const { spawn } = require('child_process')
const { exec } = require('child_process')
const fs = require('fs')
const { stripAnsi } = require('../utils/helpers')

const activeOperations = new Map()

function buildProjectCommand({ type, name, projectPath, laravelVersion, laravelStarter, nodeVersion, vueOptions, nuxtTemplate }) {
  const fullPath = path.join(projectPath, name)

  switch (type) {
    case 'laravel':
      return buildLaravelCommand(fullPath, laravelVersion, laravelStarter)
    case 'vue':
      return buildVueCommand(projectPath, name, vueOptions, nodeVersion)
    case 'nuxt':
      return buildNuxtCommand(projectPath, name, nuxtTemplate, nodeVersion)
    case 'react':
      return buildReactCommand(projectPath, name, nodeVersion)
    case 'wordpress':
      return buildWordPressCommand(projectPath, name)
    default:
      throw new Error('Unknown project type')
  }
}

function buildLaravelCommand(fullPath, version, starter) {
  const laravelVersion = version || '11'
  let command = `composer create-project laravel/laravel "${fullPath}" "${laravelVersion}.*"`

  if (starter && starter !== 'none') {
    const starterCommands = {
      'template-react': `cd "${fullPath}" && composer remove laravel/pint laravel/sail && composer require laravel/breeze --dev && php artisan breeze:install react --typescript && npm install && npm run build`,
      'template-vue': `cd "${fullPath}" && composer remove laravel/pint laravel/sail && composer require laravel/breeze --dev && php artisan breeze:install vue --typescript && npm install && npm run build`,
      'template-livewire': `cd "${fullPath}" && composer remove laravel/pint laravel/sail && composer require laravel/breeze --dev && php artisan breeze:install livewire && npm install && npm run build`,
      'breeze-manual': `cd "${fullPath}" && composer require laravel/breeze --dev && php artisan breeze:install blade && npm install && npm run build`,
      'jetstream-manual': `cd "${fullPath}" && composer require laravel/jetstream && php artisan jetstream:install livewire && npm install && npm run build`,
      breeze: `cd "${fullPath}" && composer require laravel/breeze --dev && php artisan breeze:install blade && npm install && npm run build`,
      jetstream: `cd "${fullPath}" && composer require laravel/jetstream && php artisan jetstream:install livewire && npm install && npm run build`,
      'breeze-vue': `cd "${fullPath}" && composer require laravel/breeze --dev && php artisan breeze:install vue && npm install && npm run build`,
      'breeze-react': `cd "${fullPath}" && composer require laravel/breeze --dev && php artisan breeze:install react && npm install && npm run build`,
      'ui-bootstrap': `cd "${fullPath}" && composer require laravel/ui && php artisan ui bootstrap --auth && npm install && npm run build`,
      'ui-vue': `cd "${fullPath}" && composer require laravel/ui && php artisan ui vue --auth && npm install && npm run build`,
      'ui-react': `cd "${fullPath}" && composer require laravel/ui && php artisan ui react --auth && npm install && npm run build`,
      'make-auth': `cd "${fullPath}" && php artisan make:auth`,
    }

    if (starterCommands[starter]) {
      command += ` && ${starterCommands[starter]}`
    }
  }

  return { command, fullPath }
}

function buildVueCommand(projectPath, name, options, nodeVersion) {
  const flags = []
  if (options) {
    if (options.typescript) flags.push('--typescript')
    if (options.jsx) flags.push('--jsx')
    if (options.router) flags.push('--router')
    if (options.pinia) flags.push('--pinia')
    if (options.vitest) flags.push('--vitest')
    if (options.playwright) flags.push('--playwright')
    if (options.eslint) flags.push('--eslint')
    if (options.prettier) flags.push('--prettier')
  }

  const vueFlags = flags.length > 0 ? flags.join(' ') : '--default'
  let vueCmd = `npm create vue@latest ${name} -- ${vueFlags} && cd ${name} && npm install && npm run build`

  if (nodeVersion) {
    vueCmd = `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use ${nodeVersion} && ${vueCmd}`
  }

  return { command: `cd "${projectPath}" && ${vueCmd}`, fullPath: path.join(projectPath, name) }
}

function buildNuxtCommand(projectPath, name, template, nodeVersion) {
  const nuxtTemplate = template || 'minimal'
  let nuxtCmd = `npx nuxi@latest init ${name} -t ${nuxtTemplate} --packageManager=npm --no-gitInit --no-modules && cd ${name} && npm run generate`

  if (nodeVersion) {
    nuxtCmd = `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use ${nodeVersion} && ${nuxtCmd}`
  }

  return { command: `cd "${projectPath}" && ${nuxtCmd}`, fullPath: path.join(projectPath, name) }
}

function buildReactCommand(projectPath, name, nodeVersion) {
  let reactCmd = `yes "" | npm create vite@latest ${name} -- --template react && cd ${name} && npm install`

  if (nodeVersion) {
    reactCmd = `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use ${nodeVersion} && ${reactCmd}`
  }

  return { command: `cd "${projectPath}" && ${reactCmd}`, fullPath: path.join(projectPath, name) }
}

function buildWordPressCommand(projectPath, name) {
  return {
    command: `cd "${projectPath}" && mkdir -p ${name} && cd ${name} && curl -O https://wordpress.org/latest.zip && unzip latest.zip && mv wordpress/* . && rmdir wordpress && rm latest.zip`,
    fullPath: path.join(projectPath, name),
  }
}

function executeProject({ command, fullPath, type, operationId, event }) {
  return new Promise((resolve, reject) => {
    const process = spawn('sh', ['-c', command], { maxBuffer: 1024 * 1024 * 10 })

    if (operationId) {
      activeOperations.set(operationId, process)
    }

    let output = ''

    process.stdout.on('data', (data) => {
      const rawLine = data.toString()
      const line = stripAnsi(rawLine)
      output += line
      if (operationId && line.trim()) {
        event.sender.send('operation-output', { operationId, line })
      }
    })

    process.stderr.on('data', (data) => {
      const rawLine = data.toString()
      const line = stripAnsi(rawLine)
      output += line
      if (operationId && line.trim()) {
        event.sender.send('operation-output', { operationId, line })
      }
    })

    process.on('close', (code) => {
      if (operationId) {
        activeOperations.delete(operationId)
      }

      if (code === 0) {
        handlePostInstall(type, fullPath)
          .then(() => resolve({ success: true, path: fullPath, output }))
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.error('Post-install failed:', err)
            resolve({ success: true, path: fullPath, output })
          })
      } else {
        reject(new Error(`Process exited with code ${code}\n${output}`))
      }
    })

    process.on('error', (error) => {
      if (operationId) {
        activeOperations.delete(operationId)
      }
      reject(error)
    })
  })
}

function handlePostInstall(type, fullPath) {
  if (type === 'laravel') {
    return setLaravelPermissions(fullPath)
  } else if (type === 'wordpress') {
    return setWordPressPermissions(fullPath)
  }
  return Promise.resolve()
}

function setLaravelPermissions(fullPath) {
  return new Promise((resolve) => {
    const username = require('os').userInfo().username
    const userCommands = [
      `chown -R ${username}:${username} "${fullPath}"`,
      `chmod -R 755 "${fullPath}"`,
    ].join(' && ')

    exec(userCommands, (userErr) => {
      if (userErr) {
        // eslint-disable-next-line no-console
        console.error('Laravel user permission change failed:', userErr)
      }

      const sudoCommand = `chown -R ${username}:www-data "${path.join(fullPath, 'storage')}" "${path.join(fullPath, 'bootstrap/cache')}" && chmod -R 775 "${path.join(fullPath, 'storage')}" "${path.join(fullPath, 'bootstrap/cache')}"`

      const sudo = require('sudo-prompt')
      const options = { name: 'LocalForge' }

      sudo.exec(sudoCommand, options, (sudoErr) => {
        if (sudoErr) {
          // eslint-disable-next-line no-console
          console.error('Laravel sudo permission change failed:', sudoErr)
          resolve()
          return
        }

        const envPath = path.join(fullPath, '.env')
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, 'utf8')
          if (envContent.includes('DB_CONNECTION=sqlite')) {
            const dbPath = path.join(fullPath, 'database/database.sqlite')
            if (!fs.existsSync(dbPath)) {
              fs.writeFileSync(dbPath, '')
            }
            const sqliteCommand = `chown ${username}:www-data "${dbPath}" && chmod 664 "${dbPath}" && chmod 775 "${path.join(fullPath, 'database')}"`
            sudo.exec(sqliteCommand, options, (sqliteErr) => {
              if (sqliteErr) {
                // eslint-disable-next-line no-console
                console.error('SQLite permission change failed:', sqliteErr)
              }
              resolve()
            })
            return
          }
        }
        resolve()
      })
    })
  })
}

function setWordPressPermissions(fullPath) {
  return new Promise((resolve) => {
    const username = require('os').userInfo().username
    const userCommand = `chown -R ${username}:${username} "${fullPath}" && find "${fullPath}" -type d -exec chmod 755 {} \\; && find "${fullPath}" -type f -exec chmod 644 {} \\;`

    exec(userCommand, (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error('WordPress user permission change failed:', err)
      }

      const sudoCommand = `chown -R ${username}:www-data "${path.join(fullPath, 'wp-content')}"`
      const sudo = require('sudo-prompt')
      const options = { name: 'LocalForge' }

      sudo.exec(sudoCommand, options, (sudoErr) => {
        if (sudoErr) {
          // eslint-disable-next-line no-console
          console.error('WordPress sudo permission change failed:', sudoErr)
        }
        resolve()
      })
    })
  })
}

function cancelOperation(operationId) {
  const process = activeOperations.get(operationId)
  if (process) {
    process.kill('SIGTERM')
    activeOperations.delete(operationId)
    return { success: true }
  }
  return { success: false, message: 'Operation not found' }
}

module.exports = {
  buildProjectCommand,
  executeProject,
  cancelOperation,
}
