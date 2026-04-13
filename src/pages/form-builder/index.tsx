import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPlus, LuTrash, LuSave, LuPencil, LuArrowRight, LuArrowLeft } from 'react-icons/lu';

import { PUBLIC } from '@/constant/app-routes';
import { FIELD_TYPES } from '@/types/form';
import type { FormField } from '@/types/form';
import { useFormConfig } from '@/hooks/useFormConfig';
import FieldRow from './components/FieldRow';

import styles from './index.module.css';

function createField(): FormField {
  return {
    id: crypto.randomUUID(),
    label: '',
    type: FIELD_TYPES.TEXT,
    required: false,
    options: [],
  };
}

const FormBuilder = () => {
  const navigate = useNavigate();
  const { fields: savedFields, saveFields, clearFields } = useFormConfig();
  const [fields, setFields] = useState<FormField[]>(savedFields);
  const [locked, setLocked] = useState(savedFields.length > 0);

  const handleChange = (id: string, patch: Partial<FormField>) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    );
  };

  const handleAdd = () => {
    setFields((prev) => [...prev, createField()]);
  };

  const handleDelete = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleMoveUp = (id: string) => {
    setFields((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };

  const handleMoveDown = (id: string) => {
    setFields((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx === -1 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  };

  const handleSave = () => {
    saveFields(fields);
    setLocked(true);
  };

  const handleEdit = () => {
    setLocked(false);
  };

  const handleClear = () => {
    clearFields();
    setFields([]);
    setLocked(false);
  };

  const canSave =
    fields.length > 0 && fields.every((f) => f.label.trim() !== '');

  return (
    <div className={styles.wrap}>
      <header className={styles.top}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Form Builder</h1>
          <p className={styles.subtitle}>
            Define your form fields. Choose a label and input type for each.
            Save to preview and submit.
          </p>
        </div>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => navigate(PUBLIC.TODOS)}
        >
          <LuArrowLeft size={15} />
          Todos
        </button>
      </header>

      <div className={styles.fieldList}>
        {fields.length === 0 && (
          <div className={styles.empty}>
            No fields yet. Click <strong>Add field</strong> to start building
            your form.
          </div>
        )}
        {fields.map((field, index) => (
          <FieldRow
            key={field.id}
            field={field}
            index={index}
            total={fields.length}
            disabled={locked}
            onChange={handleChange}
            onDelete={handleDelete}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
          />
        ))}
      </div>

      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.addBtn}
          onClick={handleAdd}
          disabled={locked}
        >
          <LuPlus size={16} />
          Add field
        </button>

        <div className={styles.toolbarRight}>
          {fields.length > 0 && !locked && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleClear}
            >
              <LuTrash size={15} />
              Clear all
            </button>
          )}
          {locked ? (
            <button
              type="button"
              className={styles.editBtn}
              onClick={handleEdit}
            >
              <LuPencil size={15} />
              Edit form
            </button>
          ) : (
            <button
              type="button"
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={!canSave}
            >
              <LuSave size={15} />
              Save form
            </button>
          )}
          {locked && (
            <button
              type="button"
              className={styles.previewBtn}
              onClick={() => navigate(PUBLIC.FORM_PREVIEW)}
            >
              Preview
              <LuArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
