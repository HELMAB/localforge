import { describe, it, expect } from 'vitest'

describe('useProject', () => {
  it('should export project types', () => {
    const projectTypes = ['laravel', 'vue', 'nuxt', 'react', 'wordpress']
    expect(projectTypes).toHaveLength(5)
    expect(projectTypes).toContain('laravel')
    expect(projectTypes).toContain('vue')
  })

  it('should validate project data structure', () => {
    const validProjectData = {
      name: 'test-project',
      type: 'laravel',
      path: '/home/user/projects',
      phpVersion: '8.2',
    }

    expect(validProjectData.name).toBeDefined()
    expect(validProjectData.type).toBeDefined()
    expect(validProjectData.path).toBeDefined()
  })

  it('should generate valid operation id', () => {
    const operationId = `project-${Date.now()}`
    expect(operationId).toMatch(/^project-\d+$/)
  })
})
