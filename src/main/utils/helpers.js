const { exec } = require('child_process')
const sudo = require('sudo-prompt')

/**
 * Strip ANSI escape codes from string
 */
function stripAnsi(str) {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, '')
}

/**
 * Detect Linux distribution
 */
function detectDistro() {
  return new Promise((resolve) => {
    exec('cat /etc/os-release', (error, stdout) => {
      if (error) {
        resolve('unknown')
        return
      }

      const lines = stdout.toLowerCase()
      if (lines.includes('ubuntu') || lines.includes('debian')) {
        resolve('debian')
      } else if (lines.includes('fedora') || lines.includes('rhel') || lines.includes('centos')) {
        resolve('redhat')
      } else if (lines.includes('arch')) {
        resolve('arch')
      } else {
        resolve('unknown')
      }
    })
  })
}

/**
 * Execute commands with sudo
 */
function execSudo(command) {
  return new Promise((resolve, reject) => {
    const options = { name: 'LocalForge' }

    sudo.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message))
      } else {
        resolve({ success: true, stdout, stderr })
      }
    })
  })
}

module.exports = {
  stripAnsi,
  detectDistro,
  execSudo,
}
