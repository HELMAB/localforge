import { describe, it, expect, beforeEach } from 'vitest'

describe('validation utilities', () => {
  let projectNameSchema
  let domainSchema
  let pathSchema
  let portSchema
  let phpExtensionSchema
  let validateField
  let validateForm

  beforeEach(async () => {
    const module = await import('@/utils/validation')
    projectNameSchema = module.projectNameSchema
    domainSchema = module.domainSchema
    pathSchema = module.pathSchema
    portSchema = module.portSchema
    phpExtensionSchema = module.phpExtensionSchema
    validateField = module.validateField
    validateForm = module.validateForm
  })

  describe('projectNameSchema', () => {
    it('validates valid project names (lowercase, numbers, hyphens)', async () => {
      const valid = await projectNameSchema.isValid({ projectName: 'my-project' })
      expect(valid).toBe(true)
    })

    it('validates project names with numbers only', async () => {
      const valid = await projectNameSchema.isValid({ projectName: 'project123' })
      expect(valid).toBe(true)
    })

    it('rejects uppercase letters', async () => {
      const valid = await projectNameSchema.isValid({ projectName: 'MyProject' })
      expect(valid).toBe(false)
    })

    it('rejects special characters', async () => {
      const valid = await projectNameSchema.isValid({ projectName: 'my_project' })
      expect(valid).toBe(false)
    })

    it('rejects spaces in project name', async () => {
      const valid = await projectNameSchema.isValid({ projectName: 'my project' })
      expect(valid).toBe(false)
    })

    it('rejects project names shorter than 3 characters', async () => {
      const valid = await projectNameSchema.isValid({ projectName: 'ab' })
      expect(valid).toBe(false)
    })

    it('rejects project names exceeding 50 characters', async () => {
      const valid = await projectNameSchema.isValid({ projectName: 'a'.repeat(51) })
      expect(valid).toBe(false)
    })

    it('accepts project names at minimum length (3 chars)', async () => {
      const valid = await projectNameSchema.isValid({ projectName: 'abc' })
      expect(valid).toBe(true)
    })

    it('accepts project names at maximum length (50 chars)', async () => {
      const valid = await projectNameSchema.isValid({ projectName: 'a'.repeat(50) })
      expect(valid).toBe(true)
    })
  })

  describe('domainSchema', () => {
    it('validates valid domains', async () => {
      const valid = await domainSchema.isValid({ domain: 'example.local' })
      expect(valid).toBe(true)
    })

    it('validates subdomains', async () => {
      const valid = await domainSchema.isValid({ domain: 'api.young-sia.local' })
      expect(valid).toBe(true)
    })

    it('validates domains with numbers', async () => {
      const valid = await domainSchema.isValid({ domain: 'site123.local' })
      expect(valid).toBe(true)
    })

    it('rejects domains without TLD', async () => {
      const valid = await domainSchema.isValid({ domain: 'example' })
      expect(valid).toBe(false)
    })

    it('rejects domains with spaces', async () => {
      const valid = await domainSchema.isValid({ domain: 'example local' })
      expect(valid).toBe(false)
    })

    it('rejects domains starting with hyphen', async () => {
      const valid = await domainSchema.isValid({ domain: '-example.local' })
      expect(valid).toBe(false)
    })
  })

  describe('pathSchema', () => {
    it('validates absolute paths', async () => {
      const valid = await pathSchema.isValid({ path: '/var/www/html' })
      expect(valid).toBe(true)
    })

    it('validates root path', async () => {
      const valid = await pathSchema.isValid({ path: '/' })
      expect(valid).toBe(true)
    })

    it('validates paths with numbers', async () => {
      const valid = await pathSchema.isValid({ path: '/var/www/project123' })
      expect(valid).toBe(true)
    })

    it('rejects relative paths', async () => {
      const valid = await pathSchema.isValid({ path: 'relative/path' })
      expect(valid).toBe(false)
    })

    it('rejects empty path', async () => {
      const valid = await pathSchema.isValid({ path: '' })
      expect(valid).toBe(false)
    })
  })

  describe('portSchema', () => {
    it('validates minimum port (1)', async () => {
      const valid = await portSchema.isValid({ port: 1 })
      expect(valid).toBe(true)
    })

    it('validates maximum port (65535)', async () => {
      const valid = await portSchema.isValid({ port: 65535 })
      expect(valid).toBe(true)
    })

    it('validates common ports', async () => {
      const valid = await portSchema.isValid({ port: 80 })
      expect(valid).toBe(true)
    })

    it('validates ports in valid range', async () => {
      const valid = await portSchema.isValid({ port: 3000 })
      expect(valid).toBe(true)
    })

    it('rejects port 0 (out of range)', async () => {
      const valid = await portSchema.isValid({ port: 0 })
      expect(valid).toBe(false)
    })

    it('rejects negative ports', async () => {
      const valid = await portSchema.isValid({ port: -1 })
      expect(valid).toBe(false)
    })

    it('rejects ports above 65535', async () => {
      const valid = await portSchema.isValid({ port: 65536 })
      expect(valid).toBe(false)
    })

    it('rejects floating point ports', async () => {
      const valid = await portSchema.isValid({ port: 80.5 })
      expect(valid).toBe(false)
    })
  })

  describe('phpExtensionSchema', () => {
    it('validates comma-separated extensions', async () => {
      const valid = await phpExtensionSchema.isValid({ extensions: 'curl,mbstring,xml' })
      expect(valid).toBe(true)
    })

    it('validates single extension', async () => {
      const valid = await phpExtensionSchema.isValid({ extensions: 'curl' })
      expect(valid).toBe(true)
    })

    it('validates extensions with numbers', async () => {
      const valid = await phpExtensionSchema.isValid({ extensions: 'curl,mbstring,json' })
      expect(valid).toBe(true)
    })

    it('rejects extensions with spaces', async () => {
      const valid = await phpExtensionSchema.isValid({ extensions: 'curl, mbstring' })
      expect(valid).toBe(false)
    })

    it('rejects special characters in extensions', async () => {
      const valid = await phpExtensionSchema.isValid({ extensions: 'curl@mbstring' })
      expect(valid).toBe(false)
    })
  })

  describe('validateField', () => {
    it('returns valid result for correct input', () => {
      const result = validateField(projectNameSchema, 'projectName', 'my-project')
      expect(result).toEqual({ valid: true, error: null })
    })

    it('returns error for invalid input', () => {
      const result = validateField(projectNameSchema, 'projectName', 'AB')
      expect(result.valid).toBe(false)
      expect(result.error).toBeTruthy()
    })

    it('returns error for empty required field', () => {
      const result = validateField(projectNameSchema, 'projectName', '')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('required')
    })
  })

  describe('validateForm', () => {
    it('returns valid result for valid data', () => {
      const result = validateForm(projectNameSchema, { projectName: 'my-project' })
      expect(result).toEqual({ valid: true, errors: {} })
    })

    it('returns error for invalid data', () => {
      const result = validateForm(projectNameSchema, { projectName: 'AB' })
      expect(result.valid).toBe(false)
      expect(result.errors.projectName).toBeTruthy()
    })

    it('returns all errors when abortEarly is false', () => {
      const schemaWithMultipleFields = projectNameSchema
      const result = validateForm(schemaWithMultipleFields, { projectName: '' })
      expect(result.valid).toBe(false)
      expect(result.errors.projectName).toBeTruthy()
    })

    it('returns multiple field errors', async () => {
      const combinedSchema = projectNameSchema.concat(domainSchema)
      const result = validateForm(combinedSchema, { projectName: 'AB', domain: 'invalid' })
      expect(result.valid).toBe(false)
      expect(result.errors.projectName).toBeTruthy()
      expect(result.errors.domain).toBeTruthy()
    })
  })
})
