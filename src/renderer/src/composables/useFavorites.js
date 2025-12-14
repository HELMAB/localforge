import { ref, computed } from 'vue'

/**
 * Favorites Management
 * Allows users to favorite/pin projects, nginx configs, etc.
 */

const STORAGE_KEY = 'localforge_favorites'

const favorites = ref(loadFavorites())

function loadFavorites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored
      ? JSON.parse(stored)
      : {
          projects: [],
          nginxConfigs: [],
          sslCerts: [],
        }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load favorites:', error)
    return {
      projects: [],
      nginxConfigs: [],
      sslCerts: [],
    }
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to save favorites:', error)
  }
}

export function useFavorites() {
  function toggleFavorite(type, item) {
    const list = favorites.value[type]
    if (!list) {
      // eslint-disable-next-line no-console
      console.warn(`Unknown favorite type: ${type}`)
      return
    }

    const index = list.findIndex((fav) => fav.id === item.id)

    if (index > -1) {
      // Remove from favorites
      list.splice(index, 1)
    } else {
      // Add to favorites
      list.push({
        id: item.id,
        name: item.name,
        path: item.path,
        type: item.type,
        addedAt: new Date().toISOString(),
      })
    }

    saveFavorites()
  }

  function isFavorite(type, id) {
    const list = favorites.value[type]
    return list ? list.some((fav) => fav.id === id) : false
  }

  function getFavorites(type) {
    return favorites.value[type] || []
  }

  function removeFavorite(type, id) {
    const list = favorites.value[type]
    if (!list) return

    const index = list.findIndex((fav) => fav.id === id)
    if (index > -1) {
      list.splice(index, 1)
      saveFavorites()
    }
  }

  function clearFavorites(type) {
    if (type) {
      favorites.value[type] = []
    } else {
      favorites.value = {
        projects: [],
        nginxConfigs: [],
        sslCerts: [],
      }
    }
    saveFavorites()
  }

  const favoriteProjects = computed(() => favorites.value.projects)
  const favoriteNginxConfigs = computed(() => favorites.value.nginxConfigs)
  const favoriteSslCerts = computed(() => favorites.value.sslCerts)

  const hasFavorites = computed(() => {
    return (
      favorites.value.projects.length > 0 ||
      favorites.value.nginxConfigs.length > 0 ||
      favorites.value.sslCerts.length > 0
    )
  })

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavorites,
    removeFavorite,
    clearFavorites,
    favoriteProjects,
    favoriteNginxConfigs,
    favoriteSslCerts,
    hasFavorites,
  }
}
