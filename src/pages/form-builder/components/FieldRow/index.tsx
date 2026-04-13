import { useState } from 'react';
import { LuArrowUp, LuArrowDown, LuTrash2 } from 'react-icons/lu';

import { FIELD_TYPES } from '@/types/form';
import type { FieldType, FormField } from '@/types/form';

import styles from './index.module.css';

interface Props {
  field: FormField;
  index: number;
  total: number;
  disabled?: boolean;
  onChange: (id: string, patch: Partial<FormField>) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: 'Text input',
  number: 'Number input',
  email: 'Email input',
  textarea: 'Textarea',
  select: 'Dropdown (select)',
  checkbox: 'Checkbox',
};

const FieldRow = ({
  field,
  index,
  total,
  disabled = false,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: Props) => {
  const [rawOptions, setRawOptions] = useState(() => field.options.join(', '));

  const commitOptions = () => {
    const options = rawOptions
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean);
    onChange(field.id, { options });
    setRawOptions(options.join(', '));
  };

  return (
    <div className={`${styles.row} ${disabled ? styles.rowLocked : ''}`}>
      <div className={styles.rowIndex}>{index + 1}</div>

      <div className={styles.fields}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor={`label-${field.id}`}>
            Label
          </label>
          <input
            id={`label-${field.id}`}
            className={styles.input}
            type="text"
            placeholder="e.g. User Name"
            value={field.label}
            disabled={disabled}
            onChange={(e) => onChange(field.id, { label: e.target.value })}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor={`type-${field.id}`}>
            Input type
          </label>
          <select
            id={`type-${field.id}`}
            className={styles.select}
            value={field.type}
            disabled={disabled}
            onChange={(e) =>
              onChange(field.id, {
                type: e.target.value as FieldType,
                options: [],
              })
            }
          >
            {Object.entries(FIELD_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {field.type === FIELD_TYPES.SELECT && (
          <div className={`${styles.fieldGroup} ${styles.fieldGroupWide}`}>
            <label className={styles.label} htmlFor={`options-${field.id}`}>
              Options <span className={styles.hint}>(comma-separated)</span>
            </label>
            <input
              id={`options-${field.id}`}
              className={styles.input}
              type="text"
              placeholder="e.g. Option A, Option B, Option C"
              value={rawOptions}
              disabled={disabled}
              onChange={(e) => setRawOptions(e.target.value)}
              onBlur={commitOptions}
            />
          </div>
        )}

        <div className={styles.checkGroup}>
          <input
            id={`required-${field.id}`}
            className={styles.checkbox}
            type="checkbox"
            checked={field.required}
            disabled={disabled}
            onChange={(e) => onChange(field.id, { required: e.target.checked })}
          />
          <label className={styles.checkLabel} htmlFor={`required-${field.id}`}>
            Required
          </label>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.moveBtn}
          onClick={() => onMoveUp(field.id)}
          disabled={disabled || index === 0}
          aria-label="Move field up"
          title="Move up"
        >
          <LuArrowUp size={15} />
        </button>
        <button
          type="button"
          className={styles.moveBtn}
          onClick={() => onMoveDown(field.id)}
          disabled={disabled || index === total - 1}
          aria-label="Move field down"
          title="Move down"
        >
          <LuArrowDown size={15} />
        </button>
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={() => onDelete(field.id)}
          disabled={disabled}
          aria-label="Remove field"
          title="Remove"
        >
          <LuTrash2 size={15} />
        </button>
      </div>
    </div>
  );
};

export default FieldRow;
