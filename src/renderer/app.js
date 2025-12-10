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
    tabManage: 'គ្រប់គ្រងឧបករណ៍',
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
    manageTitle: 'គ្រប់គ្រងឧបករណ៍អភិវឌ្ឍន៍',
    menuPhp: 'PHP',
    menuComposer: 'Composer',
    menuNode: 'Node.js',
    menuNginx: 'Nginx',
    menuPostgresql: 'PostgreSQL',
    menuMysql: 'MySQL',
    sectionPhpTitle: 'គ្រប់គ្រង PHP',
    sectionComposerTitle: 'គ្រប់គ្រង Composer',
    sectionNodeTitle: 'គ្រប់គ្រង Node.js',
    sectionNginxTitle: 'គ្រប់គ្រង Nginx',
    sectionPostgresqlTitle: 'គ្រប់គ្រង PostgreSQL',
    sectionMysqlTitle: 'គ្រប់គ្រង MySQL',
    phpInstalledTitle: 'កំណែដែលបានដំឡើង',
    phpInstallTitle: 'ដំឡើងកំណែថ្មី',
    phpInstallLabel: 'ជ្រើសរើសកំណែ PHP',
    phpExtTitle: 'ដំឡើងផ្នែកបន្ថែម',
    phpExtVersionLabel: 'កំណែ PHP',
    phpExtNameLabel: 'ឈ្មោះផ្នែកបន្ថែម',
    phpInstallBtn: 'ដំឡើង PHP',
    phpExtBtn: 'ដំឡើងផ្នែកបន្ថែម',
    composerInstalledTitle: 'ស្ថានភាពដំឡើង',
    composerInstallTitle: 'ដំឡើង Composer',
    composerInstallDesc: 'Composer គឺជាកម្មវិធីគ្រប់គ្រង dependency សម្រាប់ PHP',
    composerInstallBtn: 'ដំឡើង Composer',
    nodeInstalledTitle: 'កំណែដែលបានដំឡើង',
    nodeInstallTitle: 'ដំឡើងកំណែថ្មី',
    nodeInstallLabel: 'កំណែ Node.js',
    nodeDefaultTitle: 'កំណត់កំណែលំនាំដើម',
    nodeDefaultLabel: 'កំណែ',
    nodeInstallBtn: 'ដំឡើង Node.js',
    nodeDefaultBtn: 'កំណត់លំនាំដើម',
    nginxInstalledTitle: 'ស្ថានភាពដំឡើង',
    nginxInstallTitle: 'ដំឡើង Nginx',
    nginxInstallDesc: 'Nginx គឺជា Web Server ដែលមានល្បឿនលឿន',
    nginxInstallBtn: 'ដំឡើង Nginx',
    postgresqlInstalledTitle: 'ស្ថានភាពដំឡើង',
    postgresqlInstallTitle: 'ដំឡើង PostgreSQL',
    postgresLabel: 'កំណែ (ទុកទទេសម្រាប់ចុងក្រោយ)',
    postgresBtn: 'ដំឡើង PostgreSQL',
    mysqlInstalledTitle: 'ស្ថានភាពដំឡើង',
    mysqlInstallTitle: 'ដំឡើង MySQL',
    mysqlInstallDesc: 'MySQL គឺជាប្រព័ន្ធគ្រប់គ្រងមូលដ្ឋានទិន្នន័យ',
    mysqlBtn: 'ដំឡើង MySQL',
    manageNote: 'សម្គាល់: ការដំឡើងប្រើប្រាស់ sudo privilege។',
    checking: 'កំពុងពិនិត្យ...',
    notInstalled: 'មិនទាន់បានដំឡើង',
    installed: 'បានដំឡើងរូច',
    footer: 'កម្មវិធីគ្រប់គ្រងការអភិវឌ្ឍន៍ | Built with Electron & Tailwind CSS'
  },
  en: {
    appTitle: 'Development Project Manager',
    reqTitle: 'System Requirements Check',
    checkBtn: 'Check Again',
    tabCreate: 'Create Project',
    tabNginx: 'Configure Nginx',
    tabSsl: 'Generate SSL',
    tabManage: 'Manage Tools',
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
    manageTitle: 'Manage Development Tools',
    menuPhp: 'PHP',
    menuComposer: 'Composer',
    menuNode: 'Node.js',
    menuNginx: 'Nginx',
    menuPostgresql: 'PostgreSQL',
    menuMysql: 'MySQL',
    sectionPhpTitle: 'Manage PHP',
    sectionComposerTitle: 'Manage Composer',
    sectionNodeTitle: 'Manage Node.js',
    sectionNginxTitle: 'Manage Nginx',
    sectionPostgresqlTitle: 'Manage PostgreSQL',
    sectionMysqlTitle: 'Manage MySQL',
    phpInstalledTitle: 'Installed Versions',
    phpInstallTitle: 'Install New Version',
    phpInstallLabel: 'Select PHP Version',
    phpExtTitle: 'Install Extensions',
    phpExtVersionLabel: 'PHP Version',
    phpExtNameLabel: 'Extension Names',
    phpInstallBtn: 'Install PHP',
    phpExtBtn: 'Install Extensions',
    composerInstalledTitle: 'Installation Status',
    composerInstallTitle: 'Install Composer',
    composerInstallDesc: 'Composer is a dependency manager for PHP',
    composerInstallBtn: 'Install Composer',
    nodeInstalledTitle: 'Installed Versions',
    nodeInstallTitle: 'Install New Version',
    nodeInstallLabel: 'Node.js Version',
    nodeDefaultTitle: 'Set Default Version',
    nodeDefaultLabel: 'Version',
    nodeInstallBtn: 'Install Node.js',
    nodeDefaultBtn: 'Set Default',
    nginxInstalledTitle: 'Installation Status',
    nginxInstallTitle: 'Install Nginx',
    nginxInstallDesc: 'Nginx is a high-performance web server',
    nginxInstallBtn: 'Install Nginx',
    postgresqlInstalledTitle: 'Installation Status',
    postgresqlInstallTitle: 'Install PostgreSQL',
    postgresLabel: 'Version (leave empty for latest)',
    postgresBtn: 'Install PostgreSQL',
    mysqlInstalledTitle: 'Installation Status',
    mysqlInstallTitle: 'Install MySQL',
    mysqlInstallDesc: 'MySQL is a relational database management system',
    mysqlBtn: 'Install MySQL',
    manageNote: 'Note: Installation requires sudo privileges.',
    checking: 'Checking...',
    notInstalled: 'Not installed yet',
    installed: 'Installed',
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
  document.querySelector('.tab-text-manage').textContent = t.tabManage;
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
  document.getElementById('manage-title').textContent = t.manageTitle;
  document.getElementById('menu-php').textContent = t.menuPhp;
  document.getElementById('menu-composer').textContent = t.menuComposer;
  document.getElementById('menu-node').textContent = t.menuNode;
  document.getElementById('menu-nginx').textContent = t.menuNginx;
  document.getElementById('menu-postgresql').textContent = t.menuPostgresql;
  document.getElementById('menu-mysql').textContent = t.menuMysql;
  document.getElementById('section-php-title').textContent = t.sectionPhpTitle;
  document.getElementById('section-composer-title').textContent = t.sectionComposerTitle;
  document.getElementById('section-node-title').textContent = t.sectionNodeTitle;
  document.getElementById('section-nginx-title').textContent = t.sectionNginxTitle;
  document.getElementById('section-postgresql-title').textContent = t.sectionPostgresqlTitle;
  document.getElementById('section-mysql-title').textContent = t.sectionMysqlTitle;
  document.getElementById('php-installed-title').textContent = t.phpInstalledTitle;
  document.getElementById('php-install-title').textContent = t.phpInstallTitle;
  document.getElementById('php-install-label').textContent = t.phpInstallLabel;
  document.getElementById('php-ext-title').textContent = t.phpExtTitle;
  document.getElementById('php-ext-version-label').textContent = t.phpExtVersionLabel;
  document.getElementById('php-ext-name-label').textContent = t.phpExtNameLabel;
  document.getElementById('php-install-btn').textContent = t.phpInstallBtn;
  document.getElementById('php-ext-btn').textContent = t.phpExtBtn;
  document.getElementById('composer-installed-title').textContent = t.composerInstalledTitle;
  document.getElementById('composer-install-title').textContent = t.composerInstallTitle;
  document.getElementById('composer-install-desc').textContent = t.composerInstallDesc;
  document.getElementById('composer-install-btn').textContent = t.composerInstallBtn;
  document.getElementById('node-installed-title').textContent = t.nodeInstalledTitle;
  document.getElementById('node-install-title').textContent = t.nodeInstallTitle;
  document.getElementById('node-install-label').textContent = t.nodeInstallLabel;
  document.getElementById('node-default-title').textContent = t.nodeDefaultTitle;
  document.getElementById('node-default-label').textContent = t.nodeDefaultLabel;
  document.getElementById('node-install-btn').textContent = t.nodeInstallBtn;
  document.getElementById('node-default-btn').textContent = t.nodeDefaultBtn;
  document.getElementById('nginx-installed-title').textContent = t.nginxInstalledTitle;
  document.getElementById('nginx-install-title').textContent = t.nginxInstallTitle;
  document.getElementById('nginx-install-desc').textContent = t.nginxInstallDesc;
  document.getElementById('nginx-install-btn').textContent = t.nginxInstallBtn;
  document.getElementById('postgresql-installed-title').textContent = t.postgresqlInstalledTitle;
  document.getElementById('postgresql-install-title').textContent = t.postgresqlInstallTitle;
  document.getElementById('postgres-label').textContent = t.postgresLabel;
  document.getElementById('postgres-btn').textContent = t.postgresBtn;
  document.getElementById('mysql-installed-title').textContent = t.mysqlInstalledTitle;
  document.getElementById('mysql-install-title').textContent = t.mysqlInstallTitle;
  document.getElementById('mysql-install-desc').textContent = t.mysqlInstallDesc;
  document.getElementById('mysql-btn').textContent = t.mysqlBtn;
  document.getElementById('manage-note').textContent = t.manageNote;
  document.getElementById('footer').textContent = t.footer;
}

// Manage section switching
function showManageSection(section) {
  const sections = document.querySelectorAll('.manage-section');
  const menuBtns = document.querySelectorAll('.manage-menu-btn');

  sections.forEach(sec => sec.classList.add('hidden'));
  menuBtns.forEach(btn => {
    btn.classList.remove('bg-blue-500', 'text-white', 'hover:bg-blue-600');
    btn.classList.add('hover:bg-gray-200', 'text-gray-700');
  });

  document.getElementById(`manage-section-${section}`).classList.remove('hidden');
  const activeBtn = document.querySelector(`[data-section="${section}"]`);
  activeBtn.classList.add('bg-blue-500', 'text-white', 'hover:bg-blue-600');
  activeBtn.classList.remove('hover:bg-gray-200', 'text-gray-700');
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

  if (tabName === 'manage') {
    checkInstalledTools();
  }
}

// Check installed tools and update UI
async function checkInstalledTools() {
  try {
    const tools = await ipcRenderer.invoke('check-installed-tools');
    const t = translations[currentLang];

    // Update PHP section
    const phpList = document.getElementById('php-installed-list');
    if (tools.php.installed && tools.php.versions.length > 0) {
      phpList.innerHTML = tools.php.versions.map(version =>
        `<div class="flex items-center justify-between bg-white p-3 rounded border border-green-300">
          <span class="font-medium text-green-700">PHP ${version}</span>
          <span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">${t.installed}</span>
        </div>`
      ).join('');

      const phpSelect = document.getElementById('php-install-version');
      tools.php.versions.forEach(version => {
        const options = Array.from(phpSelect.options);
        const option = options.find(opt => opt.value === version);
        if (option) {
          option.disabled = true;
          option.textContent = `PHP ${version} (${t.installed})`;
        }
      });
    } else {
      phpList.innerHTML = `<p class="text-sm text-gray-600">${t.notInstalled}</p>`;
    }

    // Update Node.js section
    const nodeList = document.getElementById('node-installed-list');
    if (tools.node.installed && tools.node.versions.length > 0) {
      nodeList.innerHTML = tools.node.versions.map(version =>
        `<div class="flex items-center justify-between bg-white p-3 rounded border border-green-300">
          <span class="font-medium text-green-700">Node.js ${version}</span>
          <span class="text-xs px-2 py-1 ${tools.node.default === version ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'} rounded">
            ${tools.node.default === version ? 'Default' : t.installed}
          </span>
        </div>`
      ).join('');
    } else {
      nodeList.innerHTML = `<p class="text-sm text-gray-600">${t.notInstalled}</p>`;
    }

    // Update Composer section
    const composerInfo = document.getElementById('composer-installed-info');
    if (tools.composer.installed) {
      composerInfo.innerHTML = `
        <div class="flex items-center justify-between bg-white p-3 rounded border border-green-300">
          <span class="font-medium text-green-700">Composer ${tools.composer.version || ''}</span>
          <span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">${t.installed}</span>
        </div>`;
      const btn = document.getElementById('composer-install-btn-main');
      btn.disabled = true;
      btn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      composerInfo.innerHTML = `<p class="text-sm text-gray-600">${t.notInstalled}</p>`;
    }

    // Update Nginx section
    const nginxInfo = document.getElementById('nginx-installed-info');
    if (tools.nginx.installed) {
      nginxInfo.innerHTML = `
        <div class="flex items-center justify-between bg-white p-3 rounded border border-green-300">
          <span class="font-medium text-green-700">Nginx ${tools.nginx.version || ''}</span>
          <span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">${t.installed}</span>
        </div>`;
      const btn = document.getElementById('nginx-install-btn-main');
      btn.disabled = true;
      btn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      nginxInfo.innerHTML = `<p class="text-sm text-gray-600">${t.notInstalled}</p>`;
    }

    // Update PostgreSQL section
    const pgInfo = document.getElementById('postgresql-installed-info');
    if (tools.postgresql.installed) {
      pgInfo.innerHTML = `
        <div class="flex items-center justify-between bg-white p-3 rounded border border-green-300">
          <span class="font-medium text-green-700">PostgreSQL ${tools.postgresql.version || ''}</span>
          <span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">${t.installed}</span>
        </div>`;
      const btn = document.getElementById('postgresql-install-btn-main');
      btn.disabled = true;
      btn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      pgInfo.innerHTML = `<p class="text-sm text-gray-600">${t.notInstalled}</p>`;
    }

    // Update MySQL section
    const mysqlInfo = document.getElementById('mysql-installed-info');
    if (tools.mysql.installed) {
      mysqlInfo.innerHTML = `
        <div class="flex items-center justify-between bg-white p-3 rounded border border-green-300">
          <span class="font-medium text-green-700">MySQL ${tools.mysql.version || ''}</span>
          <span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">${t.installed}</span>
        </div>`;
      const btn = document.getElementById('mysql-install-btn-main');
      btn.disabled = true;
      btn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      mysqlInfo.innerHTML = `<p class="text-sm text-gray-600">${t.notInstalled}</p>`;
    }
  } catch (error) {
    console.error('Error checking installed tools:', error);
  }
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

// Manage Tools Functions

// Install PHP Version
async function installPHP() {
  const version = document.getElementById('php-install-version').value;

  if (!version) {
    showStatus('php-status', currentLang === 'km' ? 'សូមជ្រើសរើសកំណែ PHP' : 'Please select PHP version', 'error');
    return;
  }

  showStatus('php-status', currentLang === 'km' ? 'កំពុងដំឡើង PHP...' : 'Installing PHP...', 'info');

  try {
    const result = await ipcRenderer.invoke('install-php', { version });
    showStatus('php-status',
      currentLang === 'km' ? `PHP ${version} បានដំឡើងជោគជ័យ` : `PHP ${version} installed successfully`,
      'success'
    );
  } catch (error) {
    showStatus('php-status',
      currentLang === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`,
      'error'
    );
  }
}

// Install PHP Extensions
async function installPHPExtensions() {
  const version = document.getElementById('php-ext-version').value;
  const extensions = document.getElementById('php-ext-name').value;

  if (!version || !extensions) {
    showStatus('php-status', currentLang === 'km' ? 'សូមបំពេញកំណែ និងឈ្មោះផ្នែកបន្ថែម' : 'Please fill version and extension names', 'error');
    return;
  }

  showStatus('php-status', currentLang === 'km' ? 'កំពុងដំឡើងផ្នែកបន្ថែម...' : 'Installing extensions...', 'info');

  try {
    const result = await ipcRenderer.invoke('install-php-extensions', { version, extensions });
    showStatus('php-status',
      currentLang === 'km' ? 'ផ្នែកបន្ថែមបានដំឡើងជោគជ័យ' : 'Extensions installed successfully',
      'success'
    );
  } catch (error) {
    showStatus('php-status',
      currentLang === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`,
      'error'
    );
  }
}

// Install Node.js Version
async function installNode() {
  const version = document.getElementById('node-install-version').value;

  if (!version) {
    showStatus('node-status', currentLang === 'km' ? 'សូមបញ្ចូលកំណែ Node.js' : 'Please enter Node.js version', 'error');
    return;
  }

  showStatus('node-status', currentLang === 'km' ? 'កំពុងដំឡើង Node.js...' : 'Installing Node.js...', 'info');

  try {
    const result = await ipcRenderer.invoke('install-node', { version });
    showStatus('node-status',
      currentLang === 'km' ? `Node.js ${version} បានដំឡើងជោគជ័យ` : `Node.js ${version} installed successfully`,
      'success'
    );
  } catch (error) {
    showStatus('node-status',
      currentLang === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`,
      'error'
    );
  }
}

// Set Default Node.js Version
async function setDefaultNode() {
  const version = document.getElementById('node-default-version').value;

  if (!version) {
    showStatus('node-status', currentLang === 'km' ? 'សូមបញ្ចូលកំណែ Node.js' : 'Please enter Node.js version', 'error');
    return;
  }

  showStatus('node-status', currentLang === 'km' ? 'កំពុងកំណត់កំណែលំនាំដើម...' : 'Setting default version...', 'info');

  try {
    const result = await ipcRenderer.invoke('set-default-node', { version });
    showStatus('node-status',
      currentLang === 'km' ? `Node.js ${version} បានកំណត់ជាលំនាំដើម` : `Node.js ${version} set as default`,
      'success'
    );
  } catch (error) {
    showStatus('node-status',
      currentLang === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`,
      'error'
    );
  }
}

// Install Nginx
async function installNginx() {
  showStatus('nginx-status', currentLang === 'km' ? 'កំពុងដំឡើង Nginx...' : 'Installing Nginx...', 'info');

  try {
    const result = await ipcRenderer.invoke('install-nginx');
    showStatus('nginx-status',
      currentLang === 'km' ? 'Nginx បានដំឡើងជោគជ័យ' : 'Nginx installed successfully',
      'success'
    );
    checkRequirements();
  } catch (error) {
    showStatus('nginx-status',
      currentLang === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`,
      'error'
    );
  }
}

// Install Composer
async function installComposer() {
  showStatus('composer-status', currentLang === 'km' ? 'កំពុងដំឡើង Composer...' : 'Installing Composer...', 'info');

  try {
    const result = await ipcRenderer.invoke('install-composer');
    showStatus('composer-status',
      currentLang === 'km' ? 'Composer បានដំឡើងជោគជ័យ' : 'Composer installed successfully',
      'success'
    );
    checkRequirements();
  } catch (error) {
    showStatus('composer-status',
      currentLang === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`,
      'error'
    );
  }
}

// Install PostgreSQL
async function installPostgreSQL() {
  const version = document.getElementById('postgres-version').value;

  showStatus('postgresql-status', currentLang === 'km' ? 'កំពុងដំឡើង PostgreSQL...' : 'Installing PostgreSQL...', 'info');

  try {
    const result = await ipcRenderer.invoke('install-postgresql', { version: version || null });
    showStatus('postgresql-status',
      currentLang === 'km' ? 'PostgreSQL បានដំឡើងជោគជ័យ' : 'PostgreSQL installed successfully',
      'success'
    );
  } catch (error) {
    showStatus('postgresql-status',
      currentLang === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`,
      'error'
    );
  }
}

// Install MySQL
async function installMySQL() {
  showStatus('mysql-status', currentLang === 'km' ? 'កំពុងដំឡើង MySQL...' : 'Installing MySQL...', 'info');

  try {
    const result = await ipcRenderer.invoke('install-mysql');
    showStatus('mysql-status',
      currentLang === 'km' ? 'MySQL បានដំឡើងជោគជ័យ' : 'MySQL installed successfully',
      'success'
    );
  } catch (error) {
    showStatus('mysql-status',
      currentLang === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`,
      'error'
    );
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateLanguage();
  checkRequirements();
});
