const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const getIsEmailValid = (value: string): boolean => EMAIL_REGEXP.test(value)
