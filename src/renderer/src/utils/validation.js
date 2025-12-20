import * as yup from 'yup'

export const projectNameSchema = yup.object({
  projectName: yup
    .string()
    .required('Project name is required')
    .matches(
      /^[a-z0-9-]+$/,
      'Project name can only contain lowercase letters, numbers, and hyphens'
    )
    .min(3, 'Project name must be at least 3 characters')
    .max(50, 'Project name must not exceed 50 characters'),
})

export const domainSchema = yup.object({
  domain: yup
    .string()
    .required('Domain name is required')
    .matches(
      /^[a-z0-9]+([-.][a-z0-9]+)*\.[a-z]{2,}$/,
      'Invalid domain format (e.g., example.local, api.young-sia.local)'
    ),
})

export const pathSchema = yup.object({
  path: yup
    .string()
    .required('Path is required')
    .matches(/^\//, 'Path must be absolute (start with /)'),
})

export const portSchema = yup.object({
  port: yup
    .number()
    .required('Port is required')
    .min(1, 'Port must be between 1 and 65535')
    .max(65535, 'Port must be between 1 and 65535')
    .integer('Port must be an integer'),
})

export const phpExtensionSchema = yup.object({
  extensions: yup
    .string()
    .required('Extension names are required')
    .matches(
      /^[a-z0-9-]+(,[a-z0-9-]+)*$/,
      'Extensions must be comma-separated (e.g., curl,mbstring,xml)'
    ),
})

export function validateField(schema, fieldName, value) {
  try {
    schema.validateSyncAt(fieldName, { [fieldName]: value })
    return { valid: true, error: null }
  } catch (error) {
    return { valid: false, error: error.message }
  }
}

export function validateForm(schema, data) {
  try {
    schema.validateSync(data, { abortEarly: false })
    return { valid: true, errors: {} }
  } catch (error) {
    const errors = {}
    error.inner.forEach((err) => {
      errors[err.path] = err.message
    })
    return { valid: false, errors }
  }
}
