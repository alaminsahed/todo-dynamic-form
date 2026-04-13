import { FIELD_TYPES } from '@/types/form'
import type { FormField } from '@/types/form'

import styles from './index.module.css'

interface Props {
  field: FormField
  value: string | boolean
  onChange: (id: string, value: string | boolean) => void
}

const DynamicField = ({ field, value, onChange }: Props) => {
  const inputId = `field-${field.id}`

  const labelEl = (
    <label className={styles.label} htmlFor={inputId}>
      {field.label}
      {field.required && <span className={styles.required}>*</span>}
    </label>
  )

  if (field.type === FIELD_TYPES.TEXTAREA) {
    return (
      <div className={styles.group}>
        {labelEl}
        <textarea
          id={inputId}
          className={styles.textarea}
          value={String(value)}
          required={field.required}
          rows={4}
          onChange={(e) => onChange(field.id, e.target.value)}
        />
      </div>
    )
  }

  if (field.type === FIELD_TYPES.SELECT) {
    return (
      <div className={styles.group}>
        {labelEl}
        <select
          id={inputId}
          className={styles.select}
          value={String(value)}
          required={field.required}
          onChange={(e) => onChange(field.id, e.target.value)}
        >
          <option value="">— Select an option —</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (field.type === FIELD_TYPES.CHECKBOX) {
    return (
      <div className={styles.checkGroup}>
        <input
          id={inputId}
          className={styles.checkbox}
          type="checkbox"
          checked={Boolean(value)}
          required={field.required}
          onChange={(e) => onChange(field.id, e.target.checked)}
        />
        <label className={styles.checkLabel} htmlFor={inputId}>
          {field.label}
          {field.required && <span className={styles.required}>*</span>}
        </label>
      </div>
    )
  }

  return (
    <div className={styles.group}>
      {labelEl}
      <input
        id={inputId}
        className={styles.input}
        type={field.type}
        value={String(value)}
        required={field.required}
        onChange={(e) => onChange(field.id, e.target.value)}
      />
    </div>
  )
}

export default DynamicField
