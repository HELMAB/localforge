const { ipcRenderer } = require('electron');

// Language support
const translations = {
  km: {
    appTitle: 'កម្មវិធីគ្រប់គ្រងគម្រោង',
    reqTitle: 'ពិនិត្យតម្រូវការប្រព័ន្ធ',
    checkBtn: 'ពិនិត្យឡើងវិញ',
    tabCreate: 'បង្កើតគម្រោង',
    tabNginx: 'កំណត់រចនាសម្ព័ន្ធ Nginx',
    tabSsl: 'បង្កើត SSL',
    createTitle: 'បង្កើតគម្រោងថ្មី',
    projectTypeLabel: 'ប្រភេទគម្រោង',
    phpVersionLabel: 'កំណែ PHP',
    laravelStarterLabel: 'Laravel Starter Kit',
    wpPhpVersionLabel: 'កំណែ PHP',
    nodeVersionLabel: 'កំណែ Node.js',
    projectNameLabel: 'ឈ្មោះគម្រោង',
    projectPathLabel: 'ទីតាំងគម្រោង',
    browseBtn: 'រកមើល',
    createBtn: 'បង្កើតគម្រោង',
    laravelInfoTitle: 'គម្រោង Laravel',
    laravelInfo: 'ជ្រើសរើសកំណែ PHP និង starter kit។ Breeze ផ្តល់ការផ្ទៀងផ្ទាត់សាមញ្ញ, Jetstream រួមមានក្រុម និងលក្ខណៈពិសេស។',
    wpInfoTitle: 'គម្រោង WordPress',
    wpInfo: 'ទាញយកកំណែ WordPress ចុងក្រោយបំផុត។ អ្នកត្រូវកំណត់មូលដ្ឋានទិន្នន័យបន្ទាប់ពីបង្កើត។',
    nodeInfoTitle: 'គម្រោង Node.js',
    nodeInfo: 'ជ្រើសរើសកំណែ Node.js។ កំណែ LTS ត្រូវបានណែនាំសម្រាប់ផលិតកម្ម។ ត្រូវការ NVM ដើម្បីប្តូរកំណែ។',
    nginxTitle: 'កំណត់រចនាសម្ព័ន្ធ Nginx Virtual Host',
    domainLabel: 'ឈ្មោះដែន',
    nginxPathLabel: 'ផ្លូវគម្រោង',
    nginxPhpVersionLabel: 'កំណែ PHP-FPM',
    nginxPhpHint: 'Auto-detect នឹងស្វែងរក PHP-FPM socket ដែលមាននៅក្នុងប្រព័ន្ធ',
    portLabel: 'ច្រកទំនាក់ទំនង',
    configureBtn: 'កំណត់រចនាសម្ព័ន្ធ',
    sslTitle: 'បង្កើតវិញ្ញាបនប័ត្រ SSL',
    sslDomainLabel: 'ឈ្មោះដែន',
    sslNote: 'សម្គាល់: សូមប្រាកដថាបានតម្លើង mkcert រួចហើយ។ វិញ្ញាបនប័ត្រនឹងត្រូវបានបង្កើតក្នុងថតផ្ទះរបស់អ្នក។',
    generateBtn: 'បង្កើតវិញ្ញាបនប័ត្រ',
    footer: 'កម្មវិធីគ្រប់គ្រងការអភិវឌ្ឍន៍ | Built with Electron & Tailwind CSS'
  },
  en: {
    appTitle: 'Development Project Manager',
    reqTitle: 'System Requirements Check',
    checkBtn: 'Check Again',
    tabCreate: 'Create Project',
    tabNginx: 'Configure Nginx',
    tabSsl: 'Generate SSL',
    createTitle: 'Create New Project',
    projectTypeLabel: 'Project Type',
    phpVersionLabel: 'PHP Version',
    laravelStarterLabel: 'Laravel Starter Kit',
    wpPhpVersionLabel: 'PHP Version',
    nodeVersionLabel: 'Node.js Version',
    projectNameLabel: 'Project Name',
    projectPathLabel: 'Project Location',
    browseBtn: 'Browse',
    createBtn: 'Create Project',
    laravelInfoTitle: 'Laravel Project',
    laravelInfo: 'Select PHP version and starter kit. Breeze provides simple authentication, Jetstream includes teams and advanced features.',
    wpInfoTitle: 'WordPress Project',
    wpInfo: 'Downloads the latest WordPress version. You\'ll need to configure the database after creation.',
    nodeInfoTitle: 'Node.js Project',
    nodeInfo: 'Select Node.js version. LTS versions are recommended for production. NVM required for version switching.',
    nginxTitle: 'Configure Nginx Virtual Host',
    domainLabel: 'Domain Name',
    nginxPathLabel: 'Project Path',
    nginxPhpVersionLabel: 'PHP-FPM Version',
    nginxPhpHint: 'Auto-detect will search for available PHP-FPM socket in the system',
    portLabel: 'Port',
    configureBtn: 'Configure',
    sslTitle: 'Generate SSL Certificate',
    sslDomainLabel: 'Domain Name',
    sslNote: 'Note: Make sure mkcert is installed. The certificate will be generated in your home directory.',
    generateBtn: 'Generate Certificate',
    footer: 'Development Management Tool | Built with Electron & Tailwind CSS'
  }
};

let currentLang = 'km';

function toggleLanguage() {
  currentLang = currentLang === 'km' ? 'en' : 'km';
  updateLanguage();
  document.getElementById('lang-toggle').textContent = currentLang === 'km' ? 'EN' : 'KH';
}

function updateLanguage() {
  const t = translations[currentLang];
  
  document.getElementById('app-title').textContent = t.appTitle;
  document.getElementById('req-title').textContent = t.reqTitle;
  document.getElementById('check-btn').textContent = t.checkBtn;
  document.querySelector('.tab-text-create').textContent = t.tabCreate;
  document.querySelector('.tab-text-nginx').textContent = t.tabNginx;
  document.querySelector('.tab-text-ssl').textContent = t.tabSsl;
  document.getElementById('create-title').textContent = t.createTitle;
  document.getElementById('project-type-label').textContent = t.projectTypeLabel;
  document.getElementById('php-version-label').textContent = t.phpVersionLabel;
  document.getElementById('laravel-starter-label').textContent = t.laravelStarterLabel;
  document.getElementById('wp-php-version-label').textContent = t.wpPhpVersionLabel;
  document.getElementById('node-version-label').textContent = t.nodeVersionLabel;
  document.getElementById('laravel-info-title').textContent = t.laravelInfoTitle;
  document.getElementById('laravel-info').textContent = t.laravelInfo;
  document.getElementById('wp-info-title').textContent = t.wpInfoTitle;
  document.getElementById('wp-info').textContent = t.wpInfo;
  document.getElementById('node-info-title').textContent = t.nodeInfoTitle;
  document.getElementById('node-info').textContent = t.nodeInfo;
  document.getElementById('project-name-label').textContent = t.projectNameLabel;
  document.getElementById('project-path-label').textContent = t.projectPathLabel;
  document.getElementById('browse-btn').textContent = t.browseBtn;
  document.getElementById('browse-btn-2').textContent = t.browseBtn;
  document.getElementById('create-btn').textContent = t.createBtn;
  document.getElementById('nginx-title').textContent = t.nginxTitle;
  document.getElementById('domain-label').textContent = t.domainLabel;
  document.getElementById('nginx-path-label').textContent = t.nginxPathLabel;
  document.getElementById('nginx-php-version-label').textContent = t.nginxPhpVersionLabel;
  document.getElementById('nginx-php-hint').textContent = t.nginxPhpHint;
  document.getElementById('port-label').textContent = t.portLabel;
  document.getElementById('configure-btn').textContent = t.configureBtn;
  document.getElementById('ssl-title').textContent = t.sslTitle;
  document.getElementById('ssl-domain-label').textContent = t.sslDomainLabel;
  document.getElementById('ssl-note').textContent = t.sslNote;
  document.getElementById('generate-btn').textContent = t.generateBtn;
  document.getElementById('footer').textContent = t.footer;
}

// Tab switching
function showTab(tabName) {
  const tabs = document.querySelectorAll('.tab-content');
  const buttons = document.querySelectorAll('.tab-btn');
  
  tabs.forEach(tab => tab.classList.add('hidden'));
  buttons.forEach(btn => {
    btn.classList.remove('border-blue-500', 'text-blue-500');
    btn.classList.add('text-gray-500');
  });
  
  document.getElementById(`tab-${tabName}`).classList.remove('hidden');
  const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
  activeBtn.classList.add('border-blue-500', 'text-blue-500');
  activeBtn.classList.remove('text-gray-500');
}

// Handle project type change
function handleProjectTypeChange() {
  const projectType = document.getElementById('project-type').value;
  const laravelOptions = document.getElementById('laravel-options');
  const wordpressOptions = document.getElementById('wordpress-options');
  const nodeOptions = document.getElementById('node-options');
  
  // Hide all options first
  laravelOptions.classList.add('hidden');
  wordpressOptions.classList.add('hidden');
  nodeOptions.classList.add('hidden');
  
  // Show relevant options
  if (projectType === 'laravel') {
    laravelOptions.classList.remove('hidden');
  } else if (projectType === 'wordpress') {
    wordpressOptions.classList.remove('hidden');
  } else if (projectType === 'vue' || projectType === 'nuxt' || projectType === 'react') {
    nodeOptions.classList.remove('hidden');
  }
}

// Check system requirements
async function checkRequirements() {
  const requirements = await ipcRenderer.invoke('check-requirements');
  const container = document.getElementById('requirements');
  
  container.innerHTML = '';
  
  Object.entries(requirements).forEach(([tool, installed]) => {
    const div = document.createElement('div');
    div.className = `p-4 rounded-lg ${installed ? 'bg-green-100' : 'bg-red-100'}`;
    div.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-2xl">${installed ? '✅' : '❌'}</span>
        <div>
          <p class="font-semibold">${tool}</p>
          <p class="text-sm ${installed ? 'text-green-600' : 'text-red-600'}">
            ${installed ? (currentLang === 'km' ? 'បានតម្លើង' : 'Installed') : (currentLang === 'km' ? 'មិនបានតម្លើង' : 'Not Installed')}
          </p>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

// Select directory
async function selectDirectory(inputId) {
  const path = await ipcRenderer.invoke('select-directory');
  if (path) {
    document.getElementById(inputId).value = path;
  }
}

// Create project
async function createProject() {
  const type = document.getElementById('project-type').value;
  const name = document.getElementById('project-name').value;
  const path = document.getElementById('project-path').value;
  
  // Get version and options based on project type
  let phpVersion = null;
  let laravelStarter = null;
  let nodeVersion = null;
  
  if (type === 'laravel') {
    phpVersion = document.getElementById('php-version').value;
    laravelStarter = document.getElementById('laravel-starter').value;
  } else if (type === 'wordpress') {
    phpVersion = document.getElementById('wp-php-version').value;
  } else if (type === 'vue' || type === 'nuxt' || type === 'react') {
    nodeVersion = document.getElementById('node-version').value;
  }
  
  if (!name || !path) {
    showStatus('create-status', currentLang === 'km' ? 'សូមបំពេញព័ត៌មានទាំងអស់' : 'Please fill all fields', 'error');
    return;
  }
  
  showStatus('create-status', currentLang === 'km' ? 'កំពុងបង្កើតគម្រោង...' : 'Creating project...', 'info');
  
  try {
    const result = await ipcRenderer.invoke('create-project', { 
      type, 
      name, 
      path,
      phpVersion,
      laravelStarter,
      nodeVersion
    });
    showStatus('create-status', 
      currentLang === 'km' ? `គម្រោងបានបង្កើតជោគជ័យ: ${result.path}` : `Project created successfully: ${result.path}`, 
      'success'
    );
  } catch (error) {
    showStatus('create-status', 
      currentLang === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`, 
      'error'
    );
  }
}

// Configure Nginx
async function configureNginx() {
  const domain = document.getElementById('nginx-domain').value;
  const projectPath = document.getElementById('nginx-project-path').value;
  const port = document.getElementById('nginx-port').value;
  const phpVersion = document.getElementById('nginx-php-version').value;
  
  if (!domain || !projectPath) {
    showStatus('nginx-status', currentLang === 'km' ? 'សូមបំពេញព័ត៌មានទាំងអស់' : 'Please fill all fields', 'error');
    return;
  }
  
  showStatus('nginx-status', currentLang === 'km' ? 'កំពុងកំណត់រចនាសម្ព័ន្ធ... (អ្នកប្រហែលជាត្រូវបញ្ចូលពាក្យសម្ងាត់)' : 'Configuring... (You may need to enter your password)', 'info');
  
  try {
    const result = await ipcRenderer.invoke('configure-nginx', { 
      domain, 
      projectPath, 
      port: parseInt(port),
      phpVersion: phpVersion || null
    });
    
    const phpInfo = result.phpFpmSocket ? `\nPHP-FPM: ${result.phpFpmSocket}` : '';
    
    showStatus('nginx-status', 
      currentLang === 'km' ? `Nginx បានកំណត់រចនាសម្ព័ន្ធជោគជ័យ!${phpInfo}\n\nកុំភ្លេច៖\n1. បន្ថែម "${domain}" ទៅក្នុង /etc/hosts\n2. ដំណើរការ៖ sudo nano /etc/hosts\n3. បន្ថែម៖ 127.0.0.1 ${domain}` : `Nginx configured successfully!${phpInfo}\n\nDon't forget:\n1. Add "${domain}" to /etc/hosts\n2. Run: sudo nano /etc/hosts\n3. Add: 127.0.0.1 ${domain}`, 
      'success'
    );
  } catch (error) {
    const errorMsg = error.message || error.toString();
    showStatus('nginx-status', 
      currentLang === 'km' ? `កំហុស: ${errorMsg}\n\nប្រសិនបើអ្នកមិនបានបញ្ចូលពាក្យសម្ងាត់ សូមព្យាយាមម្តងទៀត។` : `Error: ${errorMsg}\n\nIf you didn't enter the password, please try again.`, 
      'error'
    );
  }
}

// Generate SSL
async function generateSSL() {
  const domain = document.getElementById('ssl-domain').value;
  
  if (!domain) {
    showStatus('ssl-status', currentLang === 'km' ? 'សូមបញ្ចូលឈ្មោះដែន' : 'Please enter domain name', 'error');
    return;
  }
  
  showStatus('ssl-status', currentLang === 'km' ? 'កំពុងបង្កើតវិញ្ញាបនប័ត្រ...' : 'Generating certificate...', 'info');
  
  try {
    const result = await ipcRenderer.invoke('generate-ssl', { domain });
    showStatus('ssl-status', 
      currentLang === 'km' ? `វិញ្ញាបនប័ត្របានបង្កើតជោគជ័យ` : `Certificate generated successfully`, 
      'success'
    );
  } catch (error) {
    showStatus('ssl-status', 
      currentLang === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`, 
      'error'
    );
  }
}

// Show status message
function showStatus(elementId, message, type) {
  const element = document.getElementById(elementId);
  element.classList.remove('hidden');
  
  const colors = {
    success: 'bg-green-100 text-green-800 border border-green-200',
    error: 'bg-red-100 text-red-800 border border-red-200',
    info: 'bg-blue-100 text-blue-800 border border-blue-200'
  };
  
  element.className = `mt-4 p-4 rounded-lg ${colors[type]}`;
  element.style.whiteSpace = 'pre-line';
  element.textContent = message;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateLanguage();
  checkRequirements();
});
