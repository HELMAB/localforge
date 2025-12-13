<template>
  <div class="flex gap-4 h-full">
    <!-- Sidebar Menu -->
    <div class="w-64 flex flex-col bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ t('nginxMenu') }}
        </h3>
      </div>
      
      <nav class="flex-1 p-2">
        <button
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors mb-1',
            activeMenu === 'new-site'
              ? 'bg-blue-500 dark:bg-blue-600 text-white shadow-sm'
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
          @click="activeMenu = 'new-site'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="font-medium">{{ t('nginxNewSite') }}</span>
        </button>

        <button
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
            activeMenu === 'sites'
              ? 'bg-blue-500 dark:bg-blue-600 text-white shadow-sm'
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
          @click="activeMenu = 'sites'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="font-medium">{{ t('nginxSites') }}</span>
          <span class="ml-auto px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            {{ configs.length }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <!-- New Site Form -->
      <div
        v-if="activeMenu === 'new-site'"
        class="p-6 overflow-y-auto h-full"
      >
        <div class="space-y-6">
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {{ t('nginxCreateNew') }}
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('nginxCreateNewDesc') }}
            </p>
          </div>

          <!-- Project Type Selector -->
          <div>
            <label class="block text-sm font-medium mb-2 dark:text-gray-300">
              {{ t('nginxProjectTypeLabel') }} <span class="text-red-500">*</span>
            </label>
            <CustomSelect
              v-model="projectType"
              :options="projectTypeOptions"
            />
          </div>

          <!-- Domain Name -->
          <div>
            <label class="block text-sm font-medium mb-2 dark:text-gray-300">
              {{ t('domainLabel') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model="domain"
              type="text"
              class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example.local"
            >
          </div>

          <!-- Project Path -->
          <div>
            <label class="block text-sm font-medium mb-2 dark:text-gray-300">
              {{ t('nginxPathLabel') }} <span class="text-red-500">*</span>
            </label>
            <DirectorySelector v-model="nginxProjectPath" />
          </div>

          <!-- PHP Version (only for PHP, Laravel, and WordPress projects) -->
          <div v-if="['php', 'laravel', 'wordpress'].includes(projectType)">
            <label class="block text-sm font-medium mb-2 dark:text-gray-300">{{ t('nginxPhpVersionLabel') }}</label>
            <CustomSelect
              v-model="phpVersion"
              :options="phpVersionOptions"
              placeholder="Auto-detect (ស្វ័យប្រវត្តិ)"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ t('nginxPhpHint') }}
            </p>
          </div>

          <!-- Port -->
          <div>
            <label class="block text-sm font-medium mb-2 dark:text-gray-300">{{ t('portLabel') }}</label>
            <input
              v-model.number="port"
              type="number"
              class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>

          <!-- Enable SSL Toggle -->
          <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900">
            <div class="flex-1">
              <label class="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-green-600 dark:text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ t('enableSSL') }}
              </label>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-7">
                {{ t('enableSSLDesc') }}
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="enableSSL"
                type="checkbox"
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
            </label>
          </div>

          <button
            :disabled="isConfiguring"
            class="w-full px-6 py-3 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            @click="handleConfigureNginx"
          >
            {{ isConfiguring ? t('checking') : t('configureBtn') }}
          </button>

          <StatusMessage
            :message="status.message.value"
            :type="status.type.value"
            :visible="status.visible.value"
          />
        </div>
      </div>

      <!-- Sites List -->
      <div
        v-else-if="activeMenu === 'sites'"
        class="p-6 overflow-y-auto h-full"
      >
        <!-- Header -->
        <div class="mb-6 flex items-center justify-between">
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clip-rule="evenodd"
              />
            </svg>
            {{ t('refresh') }}
          </button>
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
          v-else-if="configs.length === 0"
          class="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-20 w-20 mb-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
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

        <!-- Active Sites -->
        <div
          v-else
          class="space-y-6"
        >
          <!-- Active Sites with HTTPS -->
          <div
            v-if="activeSitesWithSSL.length > 0"
            class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4"
          >
            <h4 class="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ locale === 'km' ? 'គេហទំព័រសកម្ម (មាន HTTPS)' : 'Active Sites (HTTPS)' }}
              <span class="ml-auto px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
                {{ activeSitesWithSSL.length }}
              </span>
            </h4>
            <div class="space-y-2">
              <div
                v-for="config in activeSitesWithSSL"
                :key="config.name"
                class="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-300 dark:border-green-700"
              >
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="font-semibold text-green-700 dark:text-green-400 truncate">{{ config.name }}</span>
                    <span class="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded flex-shrink-0">
                      {{ t('active') }}
                    </span>
                    <span
                      v-if="config.hasSSL"
                      class="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded flex items-center gap-1 flex-shrink-0"
                      :title="locale === 'km' ? 'មាន SSL/HTTPS' : 'SSL/HTTPS Enabled'"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      HTTPS
                    </span>
                  </div>
                  <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 ml-7">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3.5 w-3.5 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z"
                        clip-rule="evenodd"
                      />
                      <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                    </svg>
                    <span class="truncate">{{ config.path }}</span>
                  </div>
                </div>
                <button
                  :disabled="isDeleting"
                  class="ml-4 px-4 py-2 text-sm bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 disabled:opacity-50 transition-colors flex-shrink-0 font-medium"
                  @click="handleDeleteConfig(config.name)"
                >
                  {{ t('delete') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Active Sites without HTTPS -->
          <div
            v-if="activeSitesWithoutSSL.length > 0"
            class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4"
          >
            <h4 class="font-semibold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ locale === 'km' ? 'គេហទំព័រសកម្ម (គ្មាន HTTPS)' : 'Active Sites (No HTTPS)' }}
              <span class="ml-auto px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full">
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="font-semibold text-yellow-700 dark:text-yellow-400 truncate">{{ config.name }}</span>
                    <span class="px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded flex-shrink-0">
                      {{ t('active') }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 ml-7">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3.5 w-3.5 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z"
                        clip-rule="evenodd"
                      />
                      <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                    </svg>
                    <span class="truncate">{{ config.path }}</span>
                  </div>
                </div>
                <button
                  :disabled="isDeleting"
                  class="ml-4 px-4 py-2 text-sm bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 disabled:opacity-50 transition-colors flex-shrink-0 font-medium"
                  @click="handleDeleteConfig(config.name)"
                >
                  {{ t('delete') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Inactive/Disabled Sites -->
          <div
            v-if="inactiveSites.length > 0"
            class="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ t('nginxInactiveSites') }}
              <span class="ml-auto px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="font-semibold text-gray-700 dark:text-gray-300 truncate">{{ config.name }}</span>
                    <span class="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded flex-shrink-0">
                      {{ t('inactive') }}
                    </span>
                    <span
                      v-if="config.hasSSL"
                      class="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded flex items-center gap-1 flex-shrink-0"
                      :title="locale === 'km' ? 'មាន SSL/HTTPS' : 'SSL/HTTPS Enabled'"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      HTTPS
                    </span>
                  </div>
                  <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 ml-7">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3.5 w-3.5 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z"
                        clip-rule="evenodd"
                      />
                      <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                    </svg>
                    <span class="truncate">{{ config.path }}</span>
                  </div>
                </div>
                <button
                  :disabled="isDeleting"
                  class="ml-4 px-4 py-2 text-sm bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 disabled:opacity-50 transition-colors flex-shrink-0 font-medium"
                  @click="handleDeleteConfig(config.name)"
                >
                  {{ t('delete') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNginx } from '../../composables/useNginx'
import { useStatus } from '../../composables/useStatus'
import { useTools } from '../../composables/useTools'
import DirectorySelector from '../common/DirectorySelector.vue'
import StatusMessage from '../common/StatusMessage.vue'
import CustomSelect from '../common/CustomSelect.vue'
import phpIcon from '@/assets/svg/php.svg'
import laravelIcon from '@/assets/svg/laravel.svg'
import wordpressIcon from '@/assets/svg/wordpress.svg'
import vueIcon from '@/assets/svg/vuejs.svg'
import reactIcon from '@/assets/svg/react.svg'
import htmlIcon from '@/assets/svg/html5.svg'

const { t, locale } = useI18n()
const { configureNginx, isConfiguring, listNginxConfigs, deleteNginxConfig, isLoading, isDeleting } = useNginx()
const status = useStatus()
const { installedTools, checkInstalledTools } = useTools()

const projectType = ref('php')
const domain = ref('')
const nginxProjectPath = ref('')
const phpVersion = ref('')
const port = ref(80)
const enableSSL = ref(false)
const configs = ref([])
const activeMenu = ref('new-site')

// Computed properties to separate sites by status and SSL
const activeSitesWithSSL = computed(() => configs.value.filter(config => config.enabled && config.hasSSL))
const activeSitesWithoutSSL = computed(() => configs.value.filter(config => config.enabled && !config.hasSSL))
const activeSites = computed(() => configs.value.filter(config => config.enabled))
const inactiveSites = computed(() => configs.value.filter(config => !config.enabled))

onMounted(async () => {
  await checkInstalledTools()
  await loadConfigs()
})

async function loadConfigs() {
  try {
    configs.value = await listNginxConfigs()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load configs:', error)
  }
}

async function handleDeleteConfig(configName) {
  const confirmMessage = locale.value === 'km'
    ? `តើអ្នកប្រាកដថាចង់លុបការកំណត់រចនាសម្ព័ន្ធ "${configName}" មែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`
    : `Are you sure you want to delete the configuration "${configName}"? This action cannot be undone.`
  
  if (!confirm(confirmMessage)) {
    return
  }

  try {
    await deleteNginxConfig(configName)
    status.showStatus(
      locale.value === 'km'
        ? `បានលុប ${configName} ជោគជ័យ`
        : `Successfully deleted ${configName}`,
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

const projectTypeOptions = [
  { value: 'php', label: 'PHP', icon: phpIcon },
  { value: 'laravel', label: 'Laravel', icon: laravelIcon },
  { value: 'wordpress', label: 'WordPress', icon: wordpressIcon },
  { value: 'static-vue', label: 'Vue', icon: vueIcon },
  { value: 'react', label: 'React', icon: reactIcon },
  { value: 'static-html', label: 'HTML', icon: htmlIcon }
]

const phpVersionOptions = computed(() => {
  const options = [
    { value: '', label: 'Auto-detect (ស្វ័យប្រវត្តិ)', icon: phpIcon }
  ]
  
  // Add installed PHP versions
  if (installedTools.value.php.installed && installedTools.value.php.versions.length > 0) {
    installedTools.value.php.versions.forEach(version => {
      options.push({
        value: version,
        label: `PHP ${version}-FPM`,
        icon: phpIcon
      })
    })
  }
  
  return options
})

async function handleConfigureNginx() {
  if (!domain.value || !nginxProjectPath.value) {
    status.showStatus(
      locale.value === 'km'
        ? 'សូមបំពេញព័ត៌មានទាំងអស់'
        : 'Please fill all fields',
      'error'
    )
    return
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
      enableSSL: enableSSL.value
    })

    const phpInfo = result.phpFpmSocket ? `\nPHP-FPM: ${result.phpFpmSocket}` : ''
    const sslInfo = result.sslGenerated ? `\n✓ ${t('sslGenerated')}` : ''
    const hostsInfo = result.hostsUpdated ? `\n✓ ${t('hostsUpdated')}` : ''

    status.showStatus(
      locale.value === 'km'
        ? `Nginx បានកំណត់រចនាសម្ព័ន្ធជោគជ័យ!${phpInfo}${sslInfo}${hostsInfo}\n\nអ្នកអាចចូលប្រើគេហទំព័ររបស់អ្នកតាមរយៈ៖\nhttp://${domain.value}`
        : `Nginx configured successfully!${phpInfo}${sslInfo}${hostsInfo}\n\nYou can now access your site at:\nhttp://${domain.value}`,
      'success'
    )
    
    // Reload configs list and switch to Sites view
    await loadConfigs()
    activeMenu.value = 'sites'
  } catch (error) {
    status.showStatus(
      locale.value === 'km'
        ? `កំហុស: ${error.message}\n\nប្រសិនបើអ្នកមិនបានបញ្ចូលពាក្យសម្ងាត់ សូមព្យាយាមម្តងទៀត។`
        : `Error: ${error.message}\n\nIf you didn't enter the password, please try again.`,
      'error'
    )
  }
}
</script>
