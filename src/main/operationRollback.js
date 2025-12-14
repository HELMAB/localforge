const fs = require('fs');
const sudo = require('sudo-prompt');
const path = require('path');
const os = require('os');

/**
 * Rollback Operations Module
 * Provides utilities for creating reversible operations
 */

class OperationRollback {
  constructor() {
    this.backupDir = path.join(os.tmpdir(), 'localforge-backups');
    this.ensureBackupDir();
  }

  ensureBackupDir() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  /**
   * Backup a file before modification
   */
  backupFile(filePath) {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filePath)) {
        resolve({ backed: false, reason: 'File does not exist' });
        return;
      }

      const backupPath = path.join(
        this.backupDir,
        `${path.basename(filePath)}.${Date.now()}.bak`
      );

      fs.copyFile(filePath, backupPath, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            backed: true,
            originalPath: filePath,
            backupPath,
            rollback: () => this.restoreFile(backupPath, filePath)
          });
        }
      });
    });
  }

  /**
   * Restore a file from backup
   */
  restoreFile(backupPath, originalPath) {
    return new Promise((resolve, reject) => {
      const options = { name: 'LocalForge' };
      const command = `cp "${backupPath}" "${originalPath}"`;

      sudo.exec(command, options, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve({ restored: true, path: originalPath });
        }
      });
    });
  }

  /**
   * Create a rollback point for a command execution
   */
  createCommandRollback(command, undoCommand) {
    return {
      execute: () => this.executeCommand(command),
      rollback: () => this.executeCommand(undoCommand)
    };
  }

  executeCommand(command) {
    return new Promise((resolve, reject) => {
      const options = { name: 'LocalForge' };

      sudo.exec(command, options, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr || error.message));
        } else {
          resolve({ success: true, output: stdout });
        }
      });
    });
  }

  /**
   * Track file creation for rollback
   */
  trackFileCreation(filePath) {
    return {
      path: filePath,
      rollback: () => this.deleteFile(filePath)
    };
  }

  deleteFile(filePath) {
    return new Promise((resolve, reject) => {
      const options = { name: 'LocalForge' };
      const command = `rm -f "${filePath}"`;

      sudo.exec(command, options, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve({ deleted: true, path: filePath });
        }
      });
    });
  }

  /**
   * Validate system state before operation
   */
  async validatePreConditions(checks) {
    const results = {};

    for (const [name, check] of Object.entries(checks)) {
      try {
        results[name] = await check();
      } catch (error) {
        results[name] = { valid: false, error: error.message };
      }
    }

    const allValid = Object.values(results).every(r => r.valid !== false);

    return {
      valid: allValid,
      results
    };
  }

  /**
   * Clean up old backups (keep last 24 hours)
   */
  cleanupOldBackups() {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);

    fs.readdir(this.backupDir, (err, files) => {
      if (err) return;

      files.forEach(file => {
        const filePath = path.join(this.backupDir, file);
        fs.stat(filePath, (statErr, stats) => {
          if (statErr) return;

          if (stats.mtimeMs < oneDayAgo) {
            fs.unlink(filePath, () => {});
          }
        });
      });
    });
  }
}

module.exports = new OperationRollback();
