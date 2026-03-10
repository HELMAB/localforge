<template>
  <div class="p-6">
    <div
      class="flex bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <!-- Sidebar Menu -->
      <VirtualHostSidebar
        :active-menu="activeMenu"
        :configs="configs"
        @update:active-menu="(menu) => (activeMenu = menu)"
      />

      <!-- Main Content Area -->
      <div class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <!-- New Site Form -->
        <div v-if="activeMenu === 'new-site'" class="p-6 overflow-y-auto h-full">
          <div
            class="space-y-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div class="mb-6">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {{
                      editMode
                        ? locale === 'km'
                          ? 'កែសម្រួល Virtual Host'
                          : 'Edit Virtual Host'
                        : t('nginxCreateNew')
                    }}
                  </h2>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{
                      editMode
                        ? locale === 'km'
                          ? 'កែសម្រួលការកំណត់រចនាសម្ព័ន្ធ Nginx របស់អ្នក'
                          : 'Edit your Nginx configuration'
                        : t('nginxCreateNewDesc')
                    }}
                  </p>
                </div>
                <button
                  v-if="editMode"
                  class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  @click="cancelEdit"
                >
                  {{ locale === 'km' ? 'បោះបង់' : 'Cancel' }}
                </button>
              </div>
            </div>

            <!-- Project Type Selector -->
            <div>
              <label class="block text-sm font-medium mb-2 dark:text-gray-300">
                {{ t('nginxProjectTypeLabel') }} <span class="text-red-500">*</span>
              </label>
              <CustomSelect v-model="projectType" :options="projectTypeOptions" />
            </div>

            <!-- Domain Name -->
            <div>
              <label class="block text-sm font-medium mb-2 dark:text-gray-300">
                {{ t('domainLabel') }} <span class="text-red-500">*</span>
              </label>
              <input
                v-model="domain"
                type="text"
                :placeholder="locale === 'km' ? 'myapp.local' : 'myapp.local'"
                :class="[
                  'w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors',
                  validationErrors.domain
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500',
                ]"
                @blur="validateDomain"
              />
              <div
                v-if="validationErrors.domain"
                class="flex items-start gap-1.5 mt-1.5 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
              >
                <AlertCircle class="h-4 w-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p class="text-red-700 dark:text-red-300 text-xs leading-tight">
                  {{ validationErrors.domain }}
                </p>
              </div>
            </div>

            <!-- Project Path -->
            <div>
              <label class="block text-sm font-medium mb-2 dark:text-gray-300">
                {{ t('nginxPathLabel') }} <span class="text-red-500">*</span>
              </label>
              <DirectorySelector v-model="nginxProjectPath" @update:model-value="validatePath" />
              <div
                v-if="validationErrors.path"
                class="flex items-start gap-1.5 mt-1.5 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
              >
                <AlertCircle class="h-4 w-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p class="text-red-700 dark:text-red-300 text-xs leading-tight">
                  {{ validationErrors.path }}
                </p>
              </div>
            </div>

            <!-- PHP Version (only for PHP, Laravel, and WordPress projects) -->
            <div v-if="['php', 'laravel', 'wordpress'].includes(projectType)">
              <label class="block text-sm font-medium mb-2 dark:text-gray-300">{{
                t('nginxPhpVersionLabel')
              }}</label>
              <CustomSelect
                v-model="phpVersion"
                :options="phpVersionOptions"
                placeholder="Auto-detect (ស្វ័យប្រវត្តិ)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {{
                  locale === 'km'
                    ? 'ប្រព័ន្ធនឹងស្វែងរក PHP-FPM socket ដែលមាននៅក្នុងថត /run/php/ ដោយស្វ័យប្រវត្តិ។'
                    : 'The system will automatically search for available PHP-FPM sockets in /run/php/.'
                }}
              </p>
            </div>

            <!-- Port -->
            <div>
              <label class="block text-sm font-medium mb-2 dark:text-gray-300">{{
                t('portLabel')
              }}</label>
              <input
                v-model.number="port"
                type="number"
                placeholder="3000"
                class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Enable SSL Toggle -->
            <div>
              <div
                class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 transition-all hover:border-blue-300 dark:hover:border-blue-600"
              >
                <div class="flex-1">
                  <label
                    class="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
                  >
                    <Lock class="h-5 w-5 text-green-600 dark:text-green-400" />
                    {{ t('enableSSL') }}
                  </label>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-7">
                    {{ t('enableSSLDesc') }}
                  </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input v-model="enableSSL" type="checkbox" class="sr-only peer" />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                  />
                </label>
              </div>
              <p v-if="enableSSL" class="text-xs text-orange-600 dark:text-orange-400 mt-2">
                {{
                  locale === 'km'
                    ? 'ត្រូវការ mkcert។ ប្រសិនបើមិនទាន់បានដំឡើង៖ sudo apt install mkcert'
                    : 'Requires mkcert. If not installed: sudo apt install mkcert'
                }}
              </p>
            </div>

            <button
              :disabled="isConfiguring"
              class="w-full px-6 py-3 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              @click="handleConfigureNginx"
            >
              <span v-if="isConfiguring">{{ t('checking') }}</span>
              <span v-else-if="editMode">{{
                locale === 'km' ? 'ធ្វើបច្ចុប្បន្នភាព' : 'Update Configuration'
              }}</span>
              <span v-else>{{ t('configureBtn') }}</span>
            </button>

            <AlertNotification
              :message="status.message.value"
              :type="status.type.value"
              :visible="status.visible.value"
              @close="status.hideStatus"
            />
          </div>
        </div>

        <!-- Sites List -->
        <div v-else-if="activeMenu === 'sites'" class="p-6 overflow-y-auto h-full">
          <div
            class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <!-- Header -->
            <div class="mb-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {{ t('nginxManageVirtualHosts') }}
                  </h2>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ t('nginxManageVirtualHostsDesc') }}
                  </p>
                </div>
                <button
                  :disabled="isLoading"
                  class="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 font-medium"
                  @click="loadConfigs"
                >
                  <RefreshCw class="h-5 w-5" />
                  {{ t('refresh') }}
                </button>
              </div>

              <!-- Search and Filters -->
              <div class="space-y-3">
                <!-- Search Box -->
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search class="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    v-model="searchQuery"
                    type="text"
                    class="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    :placeholder="locale === 'km' ? 'ស្វែងរកគេហទំព័រ...' : 'Search sites...'"
                  />
                </div>

                <!-- Filter Buttons -->
                <div class="flex flex-wrap gap-2">
                  <!-- Status Filters -->
                  <div class="flex gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    <button
                      :class="[
                        'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                        statusFilter === 'all'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
                      ]"
                      @click="statusFilter = 'all'"
                    >
                      {{ locale === 'km' ? 'ទាំងអស់' : 'All' }}
                    </button>
                    <button
                      :class="[
                        'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                        statusFilter === 'active'
                          ? 'bg-white dark:bg-gray-800 text-green-700 dark:text-green-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
                      ]"
                      @click="statusFilter = 'active'"
                    >
                      {{ t('active') }}
                    </button>
                    <button
                      :class="[
                        'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                        statusFilter === 'inactive'
                          ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
                      ]"
                      @click="statusFilter = 'inactive'"
                    >
                      {{ t('inactive') }}
                    </button>
                  </div>

                  <!-- SSL Filters -->
                  <div class="flex gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    <button
                      :class="[
                        'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                        sslFilter === 'all'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
                      ]"
                      @click="sslFilter = 'all'"
                    >
                      {{ locale === 'km' ? 'ទាំងអស់' : 'All' }}
                    </button>
                    <button
                      :class="[
                        'px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1',
                        sslFilter === 'https'
                          ? 'bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
                      ]"
                      @click="sslFilter = 'https'"
                    >
                      <Lock class="h-3.5 w-3.5" />
                      HTTPS
                    </button>
                    <button
                      :class="[
                        'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                        sslFilter === 'no-https'
                          ? 'bg-white dark:bg-gray-800 text-yellow-700 dark:text-yellow-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
                      ]"
                      @click="sslFilter = 'no-https'"
                    >
                      {{ locale === 'km' ? 'គ្មាន HTTPS' : 'No HTTPS' }}
                    </button>
                  </div>

                  <!-- Results count -->
                  <div
                    v-if="filteredConfigs.length !== configs.length"
                    class="flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  >
                    {{ locale === 'km' ? 'បង្ហាញ' : 'Showing' }} {{ filteredConfigs.length }}
                    {{ locale === 'km' ? 'ក្នុងចំណោម' : 'of' }} {{ configs.length }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div
              v-if="isLoading"
              class="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400"
            >
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
              <p>{{ t('loading') }}...</p>
            </div>

            <!-- Empty State -->
            <div
              v-else-if="filteredConfigs.length === 0 && configs.length === 0"
              class="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400"
            >
              <FileText class="h-20 w-20 mb-4 text-gray-400" />
              <p class="text-lg font-medium mb-2">
                {{ t('nginxNoConfigs') }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {{ t('nginxNoConfigsDesc') }}
              </p>
              <button
                class="px-6 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-medium"
                @click="activeMenu = 'new-site'"
              >
                {{ t('nginxCreateFirst') }}
              </button>
            </div>

            <!-- No Results State -->
            <div
              v-else-if="filteredConfigs.length === 0 && configs.length > 0"
              class="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400"
            >
              <SearchX class="h-20 w-20 mb-4 text-gray-400" />
              <p class="text-lg font-medium mb-2">
                {{ locale === 'km' ? 'រកមិនឃើញលទ្ធផល' : 'No results found' }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {{
                  locale === 'km'
                    ? 'សូមព្យាយាមផ្លាស់ប្តូរការស្វែងរក ឬតម្រង'
                    : 'Try adjusting your search or filters'
                }}
              </p>
              <button
                class="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors text-sm"
                @click="clearFilters"
              >
                {{ locale === 'km' ? 'សម្អាតតម្រង' : 'Clear Filters' }}
              </button>
            </div>

            <!-- Active Sites -->
            <div v-else class="space-y-6">
              <!-- Active Sites with HTTPS -->
              <div
                v-if="activeSitesWithSSL.length > 0"
                class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4"
              >
                <h4
                  class="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2"
                >
                  <Lock class="h-5 w-5" />
                  {{ locale === 'km' ? 'គេហទំព័រសកម្ម (មាន HTTPS)' : 'Active Sites (HTTPS)' }}
                  <span
                    class="ml-auto px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full"
                  >
                    {{ activeSitesWithSSL.length }}
                  </span>
                </h4>
                <div class="space-y-2">
                  <div
                    v-for="config in activeSitesWithSSL"
                    :key="config.name"
                    class="bg-white dark:bg-gray-800 rounded-lg border border-green-300 dark:border-green-700 overflow-hidden transition-all hover:shadow-md"
                  >
                    <!-- Site Card Header -->
                    <div class="flex items-center justify-between p-4">
                      <button
                        class="flex-1 min-w-0 text-left"
                        @click="toggleSiteDetails(config.name)"
                      >
                        <div class="flex items-center gap-2 mb-1">
                          <button
                            class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                            :title="
                              isFavorite('nginxConfigs', config.name)
                                ? locale === 'km'
                                  ? 'ដកចេញពីចំណូលចិត្ត'
                                  : 'Remove from favorites'
                                : locale === 'km'
                                  ? 'បន្ថែមទៅចំណូលចិត្ត'
                                  : 'Add to favorites'
                            "
                            @click.stop="
                              toggleFavorite('nginxConfigs', {
                                id: config.name,
                                name: config.name,
                                path: config.path,
                                type: 'nginx',
                              })
                            "
                          >
                            <Star
                              class="h-4 w-4"
                              :class="
                                isFavorite('nginxConfigs', config.name)
                                  ? 'text-yellow-400'
                                  : 'text-gray-400'
                              "
                              :fill="
                                isFavorite('nginxConfigs', config.name) ? 'currentColor' : 'none'
                              "
                            />
                          </button>
                          <ChevronRight
                            :class="[
                              'h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform flex-shrink-0',
                              { 'rotate-90': expandedSite === config.name },
                            ]"
                          />
                          <Code2 class="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <span class="font-semibold text-green-700 dark:text-green-400 truncate">{{
                            config.name
                          }}</span>
                          <span
                            class="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded flex-shrink-0"
                          >
                            {{ t('active') }}
                          </span>
                          <span
                            v-if="config.hasSSL"
                            class="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded flex items-center gap-1 flex-shrink-0"
                            :title="locale === 'km' ? 'មាន SSL/HTTPS' : 'SSL/HTTPS Enabled'"
                          >
                            <Lock class="h-3 w-3" />
                            HTTPS
                          </span>
                        </div>
                        <div
                          class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 ml-9"
                        >
                          <Folder class="h-3.5 w-3.5 flex-shrink-0" />
                          <span class="truncate">{{ config.path }}</span>
                        </div>
                      </button>
                      <div
                        :ref="(el) => setDropdownRef(el, config.name)"
                        class="ml-4 relative flex-shrink-0"
                      >
                        <button
                          class="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          :title="locale === 'km' ? 'សកម្មភាព' : 'Actions'"
                          @click="toggleDropdown(config.name)"
                        >
                          <MoreVertical class="h-5 w-5" />
                        </button>
                        <div
                          v-if="openDropdown === config.name"
                          :class="getDropdownClasses(config.name)"
                          class="absolute right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
                        >
                          <button
                            class="w-full px-4 py-2 text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            @click="loadConfigForEdit(config.name)"
                          >
                            <Pencil class="h-4 w-4" />
                            {{ locale === 'km' ? 'កែសម្រួល' : 'Edit' }}
                          </button>
                          <div class="border-t border-gray-200 dark:border-gray-700 my-1" />
                          <button
                            class="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            @click="handleDisableConfig(config.name)"
                          >
                            <Ban class="h-4 w-4" />
                            {{ locale === 'km' ? 'បិទដំណើរការ' : 'Disable' }}
                          </button>
                          <button
                            class="w-full px-4 py-2 text-left text-sm text-orange-600 dark:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            @click="handleRemoveSsl(config.name)"
                          >
                            <LockOpen class="h-4 w-4" />
                            {{ locale === 'km' ? 'ដក HTTPS' : 'Remove HTTPS' }}
                          </button>
                          <div class="border-t border-gray-200 dark:border-gray-700 my-1" />
                          <button
                            class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                            @click="handleDeleteConfig(config.name)"
                          >
                            <Trash2 class="h-4 w-4" />
                            {{ t('delete') }}
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Expandable Site Details -->
                    <Transition
                      enter-active-class="transition-all duration-300 ease-in-out overflow-hidden"
                      enter-from-class="max-h-0 opacity-0"
                      enter-to-class="max-h-[500px] opacity-100"
                      leave-active-class="transition-all duration-300 ease-in-out overflow-hidden"
                      leave-from-class="max-h-[500px] opacity-100"
                      leave-to-class="max-h-0 opacity-0"
                    >
                      <div
                        v-if="expandedSite === config.name"
                        class="border-t border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/10 p-4"
                      >
                        <div class="space-y-3">
                          <!-- Access URLs -->
                          <div>
                            <h5 class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              {{ locale === 'km' ? 'តំណភ្ជាប់ចូលប្រើ' : 'Access URLs' }}
                            </h5>
                            <div class="space-y-1">
                              <a
                                v-if="config.hasSSL"
                                :href="`https://${config.name}`"
                                target="_blank"
                                class="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                <Lock class="h-4 w-4" />
                                https://{{ config.name }}
                              </a>
                              <a
                                :href="`http://${config.name}`"
                                target="_blank"
                                class="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                <Link class="h-4 w-4" />
                                http://{{ config.name }}
                              </a>
                            </div>
                          </div>

                          <!-- Configuration Info -->
                          <div class="grid grid-cols-2 gap-3 text-xs">
                            <div class="bg-white/50 dark:bg-gray-800/50 p-2 rounded">
                              <span class="text-gray-600 dark:text-gray-400"
                                >{{ locale === 'km' ? 'ឈ្មោះដែន' : 'Domain' }}:</span
                              >
                              <p class="font-mono font-semibold text-gray-900 dark:text-gray-100">
                                {{ config.name }}
                              </p>
                            </div>
                            <div class="bg-white/50 dark:bg-gray-800/50 p-2 rounded">
                              <span class="text-gray-600 dark:text-gray-400"
                                >{{ locale === 'km' ? 'ស្ថានភាព' : 'Status' }}:</span
                              >
                              <p class="font-semibold text-green-600 dark:text-green-400">
                                {{ config.enabled ? t('active') : t('inactive') }}
                              </p>
                            </div>
                          </div>
                          <div class="bg-white/50 dark:bg-gray-800/50 p-2 rounded text-xs">
                            <span class="text-gray-600 dark:text-gray-400"
                              >{{ locale === 'km' ? 'ផ្លូវគម្រោង' : 'Path' }}:</span
                            >
                            <p class="font-mono text-gray-900 dark:text-gray-100 break-all">
                              {{ config.path }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Transition>
                  </div>
                </div>
              </div>

              <!-- Active Sites without HTTPS -->
              <div
                v-if="activeSitesWithoutSSL.length > 0"
                class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4"
              >
                <h4
                  class="font-semibold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center gap-2"
                >
                  <CheckCircle2 class="h-5 w-5" />
                  {{ locale === 'km' ? 'គេហទំព័រសកម្ម (គ្មាន HTTPS)' : 'Active Sites (No HTTPS)' }}
                  <span
                    class="ml-auto px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full"
                  >
                    {{ activeSitesWithoutSSL.length }}
                  </span>
                </h4>
                <div class="space-y-2">
                  <div
                    v-for="config in activeSitesWithoutSSL"
                    :key="config.name"
                    class="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border border-yellow-300 dark:border-yellow-700"
                  >
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <Code2 class="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                        <span class="font-semibold text-yellow-700 dark:text-yellow-400 truncate">{{
                          config.name
                        }}</span>
                        <span
                          class="px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded flex-shrink-0"
                        >
                          {{ t('active') }}
                        </span>
                      </div>
                      <div
                        class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 ml-7"
                      >
                        <Folder class="h-3.5 w-3.5 flex-shrink-0" />
                        <span class="truncate">{{ config.path }}</span>
                      </div>
                    </div>
                    <div
                      :ref="(el) => setDropdownRef(el, config.name)"
                      class="ml-4 relative flex-shrink-0"
                    >
                      <button
                        class="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        :title="locale === 'km' ? 'សកម្មភាព' : 'Actions'"
                        @click="toggleDropdown(config.name)"
                      >
                        <MoreVertical class="h-5 w-5" />
                      </button>
                      <div
                        v-if="openDropdown === config.name"
                        :class="getDropdownClasses(config.name)"
                        class="absolute right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
                      >
                        <button
                          class="w-full px-4 py-2 text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          @click="loadConfigForEdit(config.name)"
                        >
                          <Pencil class="h-4 w-4" />
                          {{ locale === 'km' ? 'កែសម្រួល' : 'Edit' }}
                        </button>
                        <div class="border-t border-gray-200 dark:border-gray-700 my-1" />
                        <button
                          class="w-full px-4 py-2 text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          @click="handleAddSsl(config.name)"
                        >
                          <Lock class="h-4 w-4" />
                          {{ locale === 'km' ? 'បន្ថែម HTTPS' : 'Add HTTPS' }}
                        </button>
                        <button
                          class="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          @click="handleDisableConfig(config.name)"
                        >
                          <Ban class="h-4 w-4" />
                          {{ locale === 'km' ? 'បិទដំណើរការ' : 'Disable' }}
                        </button>
                        <div class="border-t border-gray-200 dark:border-gray-700 my-1" />
                        <button
                          class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                          @click="handleDeleteConfig(config.name)"
                        >
                          <Trash2 class="h-4 w-4" />
                          {{ t('delete') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Inactive/Disabled Sites -->
              <div
                v-if="inactiveSites.length > 0"
                class="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <h4
                  class="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"
                >
                  <CircleX class="h-5 w-5" />
                  {{ t('nginxInactiveSites') }}
                  <span
                    class="ml-auto px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                  >
                    {{ inactiveSites.length }}
                  </span>
                </h4>
                <div class="space-y-2">
                  <div
                    v-for="config in inactiveSites"
                    :key="config.name"
                    class="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600"
                  >
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <Code2 class="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <span class="font-semibold text-gray-700 dark:text-gray-300 truncate">{{
                          config.name
                        }}</span>
                        <span
                          class="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded flex-shrink-0"
                        >
                          {{ t('inactive') }}
                        </span>
                        <span
                          v-if="config.hasSSL"
                          class="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded flex items-center gap-1 flex-shrink-0"
                          :title="locale === 'km' ? 'មាន SSL/HTTPS' : 'SSL/HTTPS Enabled'"
                        >
                          <Lock class="h-3 w-3" />
                          HTTPS
                        </span>
                      </div>
                      <div
                        class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 ml-7"
                      >
                        <Folder class="h-3.5 w-3.5 flex-shrink-0" />
                        <span class="truncate">{{ config.path }}</span>
                      </div>
                    </div>
                    <div
                      :ref="(el) => setDropdownRef(el, config.name)"
                      class="ml-4 relative flex-shrink-0"
                    >
                      <button
                        class="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        :title="locale === 'km' ? 'សកម្មភាព' : 'Actions'"
                        @click="toggleDropdown(config.name)"
                      >
                        <MoreVertical class="h-5 w-5" />
                      </button>
                      <div
                        v-if="openDropdown === config.name"
                        :class="getDropdownClasses(config.name)"
                        class="absolute right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
                      >
                        <button
                          class="w-full px-4 py-2 text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          @click="loadConfigForEdit(config.name)"
                        >
                          <Pencil class="h-4 w-4" />
                          {{ locale === 'km' ? 'កែសម្រួល' : 'Edit' }}
                        </button>
                        <div class="border-t border-gray-200 dark:border-gray-700 my-1" />
                        <button
                          class="w-full px-4 py-2 text-left text-sm text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          @click="handleEnableConfig(config.name)"
                        >
                          <CheckCircle2 class="h-4 w-4" />
                          {{ locale === 'km' ? 'បើកដំណើរការ' : 'Enable' }}
                        </button>
                        <button
                          v-if="!config.hasSSL"
                          class="w-full px-4 py-2 text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          @click="handleAddSsl(config.name)"
                        >
                          <Lock class="h-4 w-4" />
                          {{ locale === 'km' ? 'បន្ថែម HTTPS' : 'Add HTTPS' }}
                        </button>
                        <button
                          v-if="config.hasSSL"
                          class="w-full px-4 py-2 text-left text-sm text-orange-600 dark:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          @click="handleRemoveSsl(config.name)"
                        >
                          <LockOpen class="h-4 w-4" />
                          {{ locale === 'km' ? 'ដក HTTPS' : 'Remove HTTPS' }}
                        </button>
                        <div class="border-t border-gray-200 dark:border-gray-700 my-1" />
                        <button
                          class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                          @click="handleDeleteConfig(config.name)"
                        >
                          <Trash2 class="h-4 w-4" />
                          {{ t('delete') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, inject, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  AlertCircle,
  Ban,
  CheckCircle2,
  ChevronRight,
  CircleX,
  Code2,
  FileText,
  Folder,
  Link,
  Lock,
  LockOpen,
  MoreVertical,
  Pencil,
  RefreshCw,
  Search,
  SearchX,
  Star,
  Trash2,
} from 'lucide-vue-next'
import { useNginx } from '../composables/useNginx'
import { useStatus } from '../composables/useStatus'
import { useTools } from '../composables/useTools'
import { useFavorites } from '../composables/useFavorites'
import { domainSchema, pathSchema, validateField } from '../utils/validation'
import DirectorySelector from '../components/common/DirectorySelector.vue'
import AlertNotification from '../components/common/AlertNotification.vue'
import CustomSelect from '../components/common/CustomSelect.vue'
import VirtualHostSidebar from '../components/virtual-host/VirtualHostSidebar.vue'
import phpIcon from '@/assets/svg/php.svg'
import laravelIcon from '@/assets/svg/laravel.svg'
import wordpressIcon from '@/assets/svg/wordpress.svg'
import vueIcon from '@/assets/svg/vuejs.svg'
import nuxtIcon from '@/assets/svg/nuxtjs.svg'
import reactIcon from '@/assets/svg/react.svg'
import htmlIcon from '@/assets/svg/html5.svg'

const { t, locale } = useI18n()
const {
  configureNginx,
  isConfiguring,
  listNginxConfigs,
  deleteNginxConfig,
  enableNginxConfig,
  disableNginxConfig,
  addSslToConfig,
  removeSslFromConfig,
  getNginxConfigDetails,
  isLoading,
} = useNginx()
const status = useStatus()
const { installedTools, checkInstalledTools } = useTools()
const { toggleFavorite, isFavorite } = useFavorites()
const errorModal = inject('errorModal', null)

const projectType = ref('php')
const domain = ref('')
const nginxProjectPath = ref('')
const phpVersion = ref('')
const port = ref(80)
const enableSSL = ref(false)
const configs = ref([])
const activeMenu = ref('sites')
const openDropdown = ref(null)
const dropdownRefs = ref({})
const dropdownPositions = ref({})
const validationErrors = ref({})
const expandedSite = ref(null)
const searchQuery = ref('')
const statusFilter = ref('all')
const sslFilter = ref('all')
const editMode = ref(false)
const editingConfigName = ref(null)

// Optimized: single-pass filtering for better performance
const filteredConfigs = computed(() => {
  const query = searchQuery.value?.toLowerCase()

  return configs.value.filter((config) => {
    // Search filter
    if (
      query &&
      !config.name.toLowerCase().includes(query) &&
      !config.path.toLowerCase().includes(query)
    ) {
      return false
    }

    // Status filter
    if (statusFilter.value === 'active' && !config.enabled) return false
    if (statusFilter.value === 'inactive' && config.enabled) return false

    // SSL filter
    if (sslFilter.value === 'https' && !config.hasSSL) return false
    if (sslFilter.value === 'no-https' && config.hasSSL) return false

    return true
  })
})

// Computed properties to separate sites by status and SSL (using filtered configs)
const activeSitesWithSSL = computed(() =>
  filteredConfigs.value.filter((config) => config.enabled && config.hasSSL)
)
const activeSitesWithoutSSL = computed(() =>
  filteredConfigs.value.filter((config) => config.enabled && !config.hasSSL)
)
const inactiveSites = computed(() => filteredConfigs.value.filter((config) => !config.enabled))

onMounted(async () => {
  await checkInstalledTools()
  loadCachedConfigs()
  await loadConfigs()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

function loadCachedConfigs() {
  try {
    const cached = localStorage.getItem('nginxConfigs')
    if (cached) {
      configs.value = JSON.parse(cached)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load cached configs:', error)
  }
}

function saveCachedConfigs() {
  try {
    localStorage.setItem('nginxConfigs', JSON.stringify(configs.value))
    localStorage.setItem('nginxConfigsTimestamp', Date.now().toString())
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to save cached configs:', error)
  }
}

async function loadConfigs() {
  try {
    configs.value = await listNginxConfigs()
    saveCachedConfigs()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load configs:', error)
  }
}

async function loadConfigForEdit(configName) {
  closeDropdown()
  try {
    const details = await getNginxConfigDetails(configName)

    // Populate form with existing values
    domain.value = details.domain || ''
    nginxProjectPath.value = details.projectPath || ''
    projectType.value = details.projectType || 'php'
    port.value = details.port || 80
    phpVersion.value = details.phpVersion || ''
    enableSSL.value = details.hasSSL || false

    // Set edit mode
    editMode.value = true
    editingConfigName.value = configName

    // Switch to new-site menu
    activeMenu.value = 'new-site'
  } catch (error) {
    status.showStatus(
      locale.value === 'km'
        ? `កំហុសក្នុងការផ្ទុកការកំណត់: ${error.message}`
        : `Error loading config: ${error.message}`,
      'error'
    )
  }
}

function cancelEdit() {
  // Reset form
  domain.value = ''
  nginxProjectPath.value = ''
  projectType.value = 'php'
  port.value = 80
  phpVersion.value = ''
  enableSSL.value = false
  validationErrors.value = {}

  // Exit edit mode
  editMode.value = false
  editingConfigName.value = null
}

async function toggleDropdown(configName) {
  if (openDropdown.value === configName) {
    openDropdown.value = null
  } else {
    openDropdown.value = configName
    await nextTick()
    checkDropdownPosition(configName)
  }
}

function closeDropdown() {
  openDropdown.value = null
}

function checkDropdownPosition(configName) {
  const dropdownElement = dropdownRefs.value[configName]
  if (!dropdownElement) return

  const rect = dropdownElement.getBoundingClientRect()
  const dropdownHeight = 250
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top

  dropdownPositions.value[configName] =
    spaceBelow < dropdownHeight && spaceAbove > spaceBelow ? 'up' : 'down'
}

function handleClickOutside(event) {
  if (openDropdown.value) {
    const dropdownElement = dropdownRefs.value[openDropdown.value]
    if (dropdownElement && !dropdownElement.contains(event.target)) {
      closeDropdown()
    }
  }
}

function getDropdownClasses(configName) {
  const position = dropdownPositions.value[configName]
  return position === 'up' ? 'bottom-full mb-2' : 'mt-2'
}

function setDropdownRef(el, configName) {
  if (el) {
    dropdownRefs.value[configName] = el
  }
}

function toggleSiteDetails(configName) {
  if (expandedSite.value === configName) {
    expandedSite.value = null
  } else {
    expandedSite.value = configName
  }
}

function validateDomain() {
  const result = validateField(domainSchema, 'domain', domain.value)
  if (!result.valid) {
    validationErrors.value.domain = result.error
  } else {
    delete validationErrors.value.domain
  }
}

function validatePath() {
  const result = validateField(pathSchema, 'path', nginxProjectPath.value)
  if (!result.valid) {
    validationErrors.value.path = result.error
  } else {
    delete validationErrors.value.path
  }
}

async function handleDeleteConfig(configName) {
  closeDropdown()
  const confirmMessage =
    locale.value === 'km'
      ? `តើអ្នកប្រាកដថាចង់លុបការកំណត់រចនាសម្ព័ន្ធ "${configName}" មែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`
      : `Are you sure you want to delete the configuration "${configName}"? This action cannot be undone.`

  if (!confirm(confirmMessage)) {
    return
  }

  try {
    await deleteNginxConfig(configName)
    status.showStatus(
      locale.value === 'km' ? `បានលុប ${configName} ជោគជ័យ` : `Successfully deleted ${configName}`,
      'success'
    )
    await loadConfigs()
  } catch (error) {
    status.showStatus(
      locale.value === 'km'
        ? `កំហុសក្នុងការលុប: ${error.message}`
        : `Error deleting: ${error.message}`,
      'error'
    )
  }
}

async function handleEnableConfig(configName) {
  closeDropdown()
  try {
    await enableNginxConfig(configName)
    status.showStatus(
      locale.value === 'km'
        ? `បានបើកដំណើរការ ${configName} ជោគជ័យ`
        : `Successfully enabled ${configName}`,
      'success'
    )
    await loadConfigs()
  } catch (error) {
    status.showStatus(
      locale.value === 'km'
        ? `កំហុសក្នុងការបើកដំណើរការ: ${error.message}`
        : `Error enabling: ${error.message}`,
      'error'
    )
  }
}

async function handleDisableConfig(configName) {
  closeDropdown()
  try {
    await disableNginxConfig(configName)
    status.showStatus(
      locale.value === 'km'
        ? `បានបិទដំណើរការ ${configName} ជោគជ័យ`
        : `Successfully disabled ${configName}`,
      'success'
    )
    await loadConfigs()
  } catch (error) {
    status.showStatus(
      locale.value === 'km'
        ? `កំហុសក្នុងការបិទដំណើរការ: ${error.message}`
        : `Error disabling: ${error.message}`,
      'error'
    )
  }
}

async function handleAddSsl(configName) {
  closeDropdown()
  try {
    status.showStatus(
      locale.value === 'km'
        ? 'កំពុងបង្កើត SSL... (អ្នកប្រហែលជាត្រូវបញ្ចូលពាក្យសម្ងាត់)'
        : 'Adding SSL... (You may need to enter your password)',
      'info'
    )
    await addSslToConfig(configName)
    status.showStatus(
      locale.value === 'km'
        ? `បានបន្ថែម HTTPS ទៅ ${configName} ជោគជ័យ`
        : `Successfully added HTTPS to ${configName}`,
      'success'
    )
    await loadConfigs()
  } catch (error) {
    status.showStatus(
      locale.value === 'km'
        ? `កំហុសក្នុងការបន្ថែម HTTPS: ${error.message}`
        : `Error adding HTTPS: ${error.message}`,
      'error'
    )
  }
}

async function handleRemoveSsl(configName) {
  closeDropdown()
  const confirmMessage =
    locale.value === 'km'
      ? `តើអ្នកប្រាកដថាចង់ដក HTTPS ពី "${configName}" មែនទេ?`
      : `Are you sure you want to remove HTTPS from "${configName}"?`

  if (!confirm(confirmMessage)) {
    return
  }

  try {
    await removeSslFromConfig(configName)
    status.showStatus(
      locale.value === 'km'
        ? `បានដក HTTPS ពី ${configName} ជោគជ័យ`
        : `Successfully removed HTTPS from ${configName}`,
      'success'
    )
    await loadConfigs()
  } catch (error) {
    status.showStatus(
      locale.value === 'km'
        ? `កំហុសក្នុងការដក HTTPS: ${error.message}`
        : `Error removing HTTPS: ${error.message}`,
      'error'
    )
  }
}

const projectTypeOptions = [
  { value: 'php', label: 'PHP', icon: phpIcon },
  { value: 'laravel', label: 'Laravel', icon: laravelIcon },
  { value: 'wordpress', label: 'WordPress', icon: wordpressIcon },
  { value: 'static-vue', label: 'Vue', icon: vueIcon },
  { value: 'nuxt', label: 'Nuxt', icon: nuxtIcon },
  { value: 'react', label: 'React', icon: reactIcon },
  { value: 'static-html', label: 'HTML', icon: htmlIcon },
]

const phpVersionOptions = computed(() => {
  const options = [{ value: '', label: 'Auto-detect (ស្វ័យប្រវត្តិ)', icon: phpIcon }]

  // Add installed PHP versions
  if (installedTools.value.php.installed && installedTools.value.php.versions.length > 0) {
    installedTools.value.php.versions.forEach((version) => {
      options.push({
        value: version,
        label: `PHP ${version}-FPM`,
        icon: phpIcon,
      })
    })
  }

  return options
})

function clearFilters() {
  searchQuery.value = ''
  statusFilter.value = 'all'
  sslFilter.value = 'all'
}

async function handleConfigureNginx() {
  // Validate form fields
  validateDomain()
  validatePath()

  // Check if there are validation errors
  if (Object.keys(validationErrors.value).length > 0) {
    status.showStatus(
      locale.value === 'km' ? 'សូមពិនិត្យកំហុសនៅក្នុងទម្រង់' : 'Please fix validation errors',
      'error'
    )
    return
  }

  if (!domain.value || !nginxProjectPath.value) {
    status.showStatus(
      locale.value === 'km' ? 'សូមបំពេញព័ត៌មានទាំងអស់' : 'Please fill all fields',
      'error'
    )
    return
  }

  // If in edit mode, delete the old config first
  if (editMode.value && editingConfigName.value) {
    try {
      await deleteNginxConfig(editingConfigName.value)
    } catch (error) {
      status.showStatus(
        locale.value === 'km'
          ? `កំហុសក្នុងការលុបការកំណត់ចាស់: ${error.message}`
          : `Error deleting old config: ${error.message}`,
        'error'
      )
      return
    }
  }

  status.showStatus(
    locale.value === 'km'
      ? 'កំពុងកំណត់រចនាសម្ព័ន្ធ... (អ្នកប្រហែលជាត្រូវបញ្ចូលពាក្យសម្ងាត់)'
      : 'Configuring... (You may need to enter your password)',
    'info'
  )

  try {
    const result = await configureNginx({
      domain: domain.value,
      projectPath: nginxProjectPath.value,
      port: port.value,
      projectType: projectType.value,
      phpVersion: phpVersion.value || null,
      enableSSL: enableSSL.value,
    })

    const phpInfo = result.phpFpmSocket ? `\nPHP-FPM: ${result.phpFpmSocket}` : ''
    const sslInfo = result.sslGenerated ? `\n✓ ${t('sslGenerated')}` : ''
    const hostsInfo = result.hostsUpdated ? `\n✓ ${t('hostsUpdated')}` : ''

    const actionText = editMode.value
      ? locale.value === 'km'
        ? 'បានធ្វើបច្ចុប្បន្នភាព'
        : 'updated'
      : locale.value === 'km'
        ? 'បានកំណត់រចនាសម្ព័ន្ធ'
        : 'configured'

    status.showStatus(
      locale.value === 'km'
        ? `Nginx ${actionText}ជោគជ័យ!${phpInfo}${sslInfo}${hostsInfo}\n\nអ្នកអាចចូលប្រើគេហទំព័ររបស់អ្នកតាមរយៈ៖\nhttp://${domain.value}`
        : `Nginx ${actionText} successfully!${phpInfo}${sslInfo}${hostsInfo}\n\nYou can now access your site at:\nhttp://${domain.value}`,
      'success'
    )

    // Reset form and exit edit mode
    cancelEdit()

    // Reload configs list and switch to Sites view
    await loadConfigs()
    activeMenu.value = 'sites'
  } catch (error) {
    // Show detailed error in modal
    if (errorModal) {
      errorModal.showError(error, {
        title: locale.value === 'km' ? 'បរាជ័យក្នុងការកំណត់ Nginx' : 'Failed to Configure Nginx',
        subtitle:
          locale.value === 'km'
            ? 'មានកំហុសកើតឡើងពេលកំណត់រចនាសម្ព័ន្ធ Nginx'
            : 'An error occurred while configuring Nginx',
        suggestions: [
          locale.value === 'km'
            ? 'ពិនិត្យមើលថាតើអ្នកបានបញ្ចូលពាក្យសម្ងាត់ត្រឹមត្រូវ (sudo privilege ត្រូវការ)'
            : 'Check if you entered the correct password (sudo privilege required)',
          locale.value === 'km'
            ? 'ត្រូវប្រាកដថា Nginx ត្រូវបានដំឡើងនៅលើប្រព័ន្ធរបស់អ្នក'
            : 'Ensure Nginx is installed on your system',
          locale.value === 'km'
            ? 'ពិនិត្យមើលថាតើផ្លូវគម្រោងមានឬអត់'
            : 'Check if the project path exists',
        ],
        context: {
          Domain: domain.value,
          'Project Path': nginxProjectPath.value,
          'Project Type': projectType.value,
          Port: port.value,
          'PHP Version': phpVersion.value || 'Auto-detect',
          'SSL Enabled': enableSSL.value ? 'Yes' : 'No',
        },
        onRetry: handleConfigureNginx,
      })
    }
  }
}
</script>
