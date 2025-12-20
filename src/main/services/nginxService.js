const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const os = require('os')
const sudo = require('sudo-prompt')
const { generateNginxConfig } = require('./nginxConfigGenerator')

function detectPhpFpmSocket(phpVersion) {
  return new Promise((resolve) => {
    if (phpVersion) {
      resolve(`/var/run/php/php${phpVersion}-fpm.sock`)
      return
    }

    exec('ls -1 /var/run/php/php*-fpm.sock 2>/dev/null | head -1', (error, stdout) => {
      if (error || !stdout.trim()) {
        resolve('/var/run/php/php-fpm.sock')
      } else {
        resolve(stdout.trim())
      }
    })
  })
}

function addDomainToHosts(domain) {
  return new Promise((resolve) => {
    exec(`grep -q "127.0.0.1.*${domain}" /etc/hosts`, (grepError) => {
      if (grepError) {
        const options = { name: 'LocalForge' }
        const hostsCommand = `echo "127.0.0.1    ${domain}" >> /etc/hosts`
        sudo.exec(hostsCommand, options, (hostsError) => {
          resolve(!hostsError)
        })
      } else {
        resolve(true)
      }
    })
  })
}

function writeNginxConfig({ domain, config }) {
  return new Promise((resolve, reject) => {
    const configPath = `/etc/nginx/sites-available/${domain}`
    const symlinkPath = `/etc/nginx/sites-enabled/${domain}`
    const tempConfigPath = path.join(os.tmpdir(), `${domain}.conf`)

    fs.writeFile(tempConfigPath, config, (err) => {
      if (err) {
        reject(err)
        return
      }

      const options = { name: 'LocalForge' }
      const command = `mv "${tempConfigPath}" "${configPath}" && ln -sf "${configPath}" "${symlinkPath}" && nginx -t && systemctl reload nginx`

      sudo.exec(command, options, (error, _stdout, stderr) => {
        if (error) {
          reject(new Error(stderr || error.message))
        } else {
          resolve({ configPath })
        }
      })
    })
  })
}

function generateSSL(domain) {
  return new Promise((resolve, reject) => {
    const sslCommand = `mkdir -p /etc/nginx/ssl && cd /etc/nginx/ssl && mkcert ${domain}`
    const options = { name: 'LocalForge' }

    sudo.exec(sslCommand, options, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve({ success: true, sslPath: '/etc/nginx/ssl' })
      }
    })
  })
}

async function configureNginx({ domain, projectPath, port = 80, projectType = 'php', phpVersion = null, enableSSL = false }) {
  let phpFpmSocket = null
  const requiresPhp = ['php', 'laravel', 'wordpress'].includes(projectType)

  if (requiresPhp) {
    phpFpmSocket = await detectPhpFpmSocket(phpVersion)
  }

  const config = generateNginxConfig({
    domain,
    projectPath,
    port,
    projectType,
    phpFpmSocket,
    enableSSL,
  })

  const { configPath } = await writeNginxConfig({ domain, config })
  const hostsUpdated = await addDomainToHosts(domain)

  const result = {
    success: true,
    configPath,
    hostsUpdated,
    sslGenerated: false,
  }

  if (phpFpmSocket) {
    result.phpFpmSocket = phpFpmSocket
  }

  if (enableSSL) {
    try {
      const sslResult = await generateSSL(domain)
      result.sslGenerated = true
      result.sslPath = sslResult.sslPath
    } catch (sslError) {
      // eslint-disable-next-line no-console
      console.error('SSL generation failed:', sslError)
    }
  }

  return result
}

function listNginxConfigs() {
  return new Promise((resolve, reject) => {
    exec('ls -1 /etc/nginx/sites-available/', (error, stdout) => {
      if (error) {
        reject(error)
        return
      }

      const configs = stdout
        .trim()
        .split('\n')
        .filter((name) => name && name !== 'default')

      if (configs.length === 0) {
        resolve([])
        return
      }

      const configDetails = []
      let processed = 0

      configs.forEach((name) => {
        const availablePath = `/etc/nginx/sites-available/${name}`
        const enabledPath = `/etc/nginx/sites-enabled/${name}`

        fs.stat(availablePath, (err, stats) => {
          const isEnabled = fs.existsSync(enabledPath)

          fs.readFile(availablePath, 'utf8', (readErr, content) => {
            const hasSSL = !readErr && content && content.includes('listen 443 ssl')

            configDetails.push({
              name: name,
              path: availablePath,
              enabled: isEnabled,
              hasSSL: hasSSL,
              size: stats ? stats.size : 0,
              modified: stats ? stats.mtime : null,
            })

            processed++
            if (processed === configs.length) {
              resolve(configDetails)
            }
          })
        })
      })
    })
  })
}

function deleteNginxConfig(configName) {
  return new Promise((resolve, reject) => {
    const availablePath = `/etc/nginx/sites-available/${configName}`
    const enabledPath = `/etc/nginx/sites-enabled/${configName}`

    fs.readFile(availablePath, 'utf8', (readErr, content) => {
      let domain = null

      if (!readErr && content) {
        const domainMatch = content.match(/server_name\s+([^;]+);/)
        if (domainMatch) {
          domain = domainMatch[1].trim()
        }
      }

      const options = { name: 'LocalForge' }
      let command = `rm -f "${enabledPath}" && rm -f "${availablePath}"`

      if (domain) {
        command += ` && sed -i "/127\\.0\\.0\\.1[[:space:]]\\+${domain.replace(/\./g, '\\.')}/d" /etc/hosts`
      }

      command += ' && nginx -t && systemctl reload nginx'

      sudo.exec(command, options, (error, _stdout, stderr) => {
        if (error) {
          reject(new Error(stderr || error.message))
        } else {
          resolve({
            success: true,
            message: `Configuration ${configName} deleted successfully${domain ? ' and removed from /etc/hosts' : ''}`,
          })
        }
      })
    })
  })
}

function enableNginxConfig(configName) {
  return new Promise((resolve, reject) => {
    const availablePath = `/etc/nginx/sites-available/${configName}`
    const enabledPath = `/etc/nginx/sites-enabled/${configName}`
    const command = `ln -sf "${availablePath}" "${enabledPath}" && nginx -t && systemctl reload nginx`
    const options = { name: 'LocalForge' }

    sudo.exec(command, options, (error, _stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message))
      } else {
        resolve({ success: true, message: `Configuration ${configName} enabled successfully` })
      }
    })
  })
}

function disableNginxConfig(configName) {
  return new Promise((resolve, reject) => {
    const enabledPath = `/etc/nginx/sites-enabled/${configName}`
    const command = `rm -f "${enabledPath}" && nginx -t && systemctl reload nginx`
    const options = { name: 'LocalForge' }

    sudo.exec(command, options, (error, _stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message))
      } else {
        resolve({ success: true, message: `Configuration ${configName} disabled successfully` })
      }
    })
  })
}

function addSSLToConfig(configName) {
  return new Promise((resolve, reject) => {
    const availablePath = `/etc/nginx/sites-available/${configName}`

    fs.readFile(availablePath, 'utf8', (readErr, content) => {
      if (readErr) {
        reject(new Error(`Failed to read config: ${readErr.message}`))
        return
      }

      if (content.includes('listen 443 ssl')) {
        reject(new Error('SSL is already configured for this site'))
        return
      }

      const domainMatch = content.match(/server_name\s+([^;]+);/)
      if (!domainMatch) {
        reject(new Error('Could not find domain in configuration'))
        return
      }
      const domain = domainMatch[1].trim()

      const sslDir = '/etc/nginx/ssl'
      const sslCommand = `mkdir -p ${sslDir} && cd ${sslDir} && mkcert ${domain}`
      const options = { name: 'LocalForge' }

      sudo.exec(sslCommand, options, (sslError) => {
        if (sslError) {
          reject(new Error(`Failed to generate SSL certificate: ${sslError.message}`))
          return
        }

        const serverBlockMatch = content.match(/server\s*\{[\s\S]*?\n\}/)
        if (!serverBlockMatch) {
          reject(new Error('Could not parse server block'))
          return
        }

        let sslBlock = serverBlockMatch[0]
        sslBlock = sslBlock.replace(/listen\s+(\d+);/g, 'listen 443 ssl;')
        sslBlock = sslBlock.replace(/listen\s+\[::\]:(\d+);/g, 'listen [::]:443 ssl;')
        sslBlock = sslBlock.replace(
          /(server_name\s+[^;]+;)/,
          `$1\n\n    ssl_certificate /etc/nginx/ssl/${domain}.pem;\n    ssl_certificate_key /etc/nginx/ssl/${domain}-key.pem;`
        )

        const newContent = content + '\n' + sslBlock
        const tempConfigPath = path.join(os.tmpdir(), `${configName}.conf`)

        fs.writeFile(tempConfigPath, newContent, (writeErr) => {
          if (writeErr) {
            reject(new Error(`Failed to write config: ${writeErr.message}`))
            return
          }

          const moveCommand = `mv "${tempConfigPath}" "${availablePath}" && nginx -t && systemctl reload nginx`
          sudo.exec(moveCommand, options, (moveError, _stdout, stderr) => {
            if (moveError) {
              reject(new Error(stderr || moveError.message))
            } else {
              resolve({ success: true, message: `SSL added to ${configName} successfully` })
            }
          })
        })
      })
    })
  })
}

function removeSSLFromConfig(configName) {
  return new Promise((resolve, reject) => {
    const availablePath = `/etc/nginx/sites-available/${configName}`

    fs.readFile(availablePath, 'utf8', (readErr, content) => {
      if (readErr) {
        reject(new Error(`Failed to read config: ${readErr.message}`))
        return
      }

      if (!content.includes('listen 443 ssl')) {
        reject(new Error('No SSL configuration found for this site'))
        return
      }

      let newContent = content
      const sslBlockRegex = /server\s*\{[^}]*listen\s+443\s+ssl[^}]*\}/gs
      newContent = newContent.replace(sslBlockRegex, '')
      newContent = newContent.replace(/\n\n\n+/g, '\n\n')

      const tempConfigPath = path.join(os.tmpdir(), `${configName}.conf`)
      fs.writeFile(tempConfigPath, newContent, (writeErr) => {
        if (writeErr) {
          reject(new Error(`Failed to write config: ${writeErr.message}`))
          return
        }

        const options = { name: 'LocalForge' }
        const moveCommand = `mv "${tempConfigPath}" "${availablePath}" && nginx -t && systemctl reload nginx`
        sudo.exec(moveCommand, options, (moveError, _stdout, stderr) => {
          if (moveError) {
            reject(new Error(stderr || moveError.message))
          } else {
            resolve({ success: true, message: `SSL removed from ${configName} successfully` })
          }
        })
      })
    })
  })
}

function getNginxConfigDetails(configName) {
  return new Promise((resolve, reject) => {
    const availablePath = `/etc/nginx/sites-available/${configName}`

    fs.readFile(availablePath, 'utf8', (readErr, content) => {
      if (readErr) {
        reject(new Error(`Failed to read config: ${readErr.message}`))
        return
      }

      try {
        const details = {
          name: configName,
          domain: null,
          projectPath: null,
          port: 80,
          projectType: 'php',
          phpVersion: null,
          hasSSL: content.includes('listen 443 ssl'),
        }

        const domainMatch = content.match(/server_name\s+([^;]+);/)
        if (domainMatch) {
          details.domain = domainMatch[1].trim()
        }

        const portMatch = content.match(/listen\s+(\d+);/)
        if (portMatch) {
          details.port = parseInt(portMatch[1])
        }

        const rootMatch = content.match(/root\s+([^;]+);/)
        if (rootMatch) {
          let rootPath = rootMatch[1].trim()
          rootPath = rootPath.replace(/\/(public|dist|\.output\/public)$/, '')
          details.projectPath = rootPath
        }

        if (content.includes('index.php')) {
          if (content.includes('try_files $uri $uri/ /index.php?$query_string;')) {
            details.projectType = 'laravel'
          } else if (content.includes('wp-admin') || content.includes('wp-includes')) {
            details.projectType = 'wordpress'
          } else {
            details.projectType = 'php'
          }
        } else if (content.includes('/.output/public')) {
          details.projectType = 'nuxt'
        } else if (content.includes('/dist')) {
          if (content.includes('# Vue SPA') || content.includes('# React SPA')) {
            details.projectType = content.includes('Vue') ? 'static-vue' : 'react'
          } else {
            details.projectType = 'static-html'
          }
        } else {
          details.projectType = 'static-html'
        }

        const phpMatch = content.match(/fastcgi_pass\s+unix:\/run\/php\/php([\d.]+)-fpm\.sock;/)
        if (phpMatch) {
          details.phpVersion = phpMatch[1]
        }

        resolve(details)
      } catch (parseError) {
        reject(new Error(`Failed to parse config: ${parseError.message}`))
      }
    })
  })
}

async function deleteProjectAndConfigs(projectPath) {
  const sitesAvailableDir = '/etc/nginx/sites-available/'
  try {
    const files = await fs.promises.readdir(sitesAvailableDir)
      for (const file of files) {
        if (file === 'default') continue
        const configPath = path.join(sitesAvailableDir, file)
        const content = await fs.promises.readFile(configPath, 'utf8')

        const rootMatch = content.match(/root\s+([^;]+);/)
        if (rootMatch) {
          let rootPath = rootMatch[1].trim()
          rootPath = rootPath.replace(/\/$/, '').replace(/\/(public|dist)$/, '')
          const normalizedProjectPath = projectPath.replace(/\/$/, '')

          if (rootPath === normalizedProjectPath) {
            const configName = file
            const availablePath = `/etc/nginx/sites-available/${configName}`
            const enabledPath = `/etc/nginx/sites-enabled/${configName}`
            let domain = null
            const domainMatch = content.match(/server_name\s+([^;]+);/)
            if (domainMatch) {
              domain = domainMatch[1].trim().split(' ')[0]
            }

            let command = `rm -f "${enabledPath}" && rm -f "${availablePath}"`
            if (domain) {
              command += ` && sed -i.bak '/127\\.0\\.0\\.1[[:space:]]\\+${domain.replace(/\./g, '\\.')}/d' /etc/hosts`
              command += ` && rm -f "/etc/nginx/ssl/${domain}.pem" "/etc/nginx/ssl/${domain}-key.pem"`
            }
            command += ' && nginx -t && systemctl reload nginx'

            const options = { name: 'LocalForge' }
            await new Promise((res, rej) => {
              sudo.exec(command, options, (error, _stdout, stderr) => {
                if (error) rej(new Error(stderr || error.message))
                else res()
              })
            })
            break
          }
        }
      }
      return { success: true }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error deleting project configs:', err)
      throw err
    }
}

module.exports = {
  configureNginx,
  generateSSL,
  listNginxConfigs,
  deleteNginxConfig,
  enableNginxConfig,
  disableNginxConfig,
  addSSLToConfig,
  removeSSLFromConfig,
  getNginxConfigDetails,
  deleteProjectAndConfigs,
}
