import { useState, useCallback } from 'react'
import type { FormField } from '@/types/form'

const STORAGE_KEY = 'form-builder-fields'

const readFromStorage = (): FormField[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as FormField[]) : []
  } catch {
    return []
  }
}

const writeToStorage = (fields: FormField[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fields))
}

export const useFormConfig = () => {
  const [fields, setFields] = useState<FormField[]>(readFromStorage)

  const saveFields = useCallback((next: FormField[]) => {
    writeToStorage(next)
    setFields(next)
  }, [])

  const clearFields = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setFields([])
  }, [])

  return { fields, saveFields, clearFields }
}
