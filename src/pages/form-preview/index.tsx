import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuArrowRight, LuArrowLeft, LuCircleCheck } from 'react-icons/lu';

import { PUBLIC } from '@/constant/app-routes';
import { FIELD_TYPES } from '@/types/form';
import { useFormConfig } from '@/hooks/useFormConfig';
import DynamicField from './components/DynamicField';

import styles from './index.module.css';

type FormValues = Record<string, string | boolean>;

function buildInitialValues(
  fields: ReturnType<typeof useFormConfig>['fields'],
): FormValues {
  return Object.fromEntries(
    fields.map((f) => [f.id, f.type === FIELD_TYPES.CHECKBOX ? false : '']),
  );
}

const FormPreview = () => {
  const navigate = useNavigate();
  const { fields } = useFormConfig();
  const [values, setValues] = useState<FormValues>(() =>
    buildInitialValues(fields),
  );
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (id: string, value: string | boolean) => {
    setSubmitted(false);
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const output = Object.fromEntries(
      fields.map((f) => [f.label || f.id, values[f.id]]),
    );

    console.log('[Form Preview] Submitted data:', output);
    setSubmitted(true);
  };

  if (fields.length === 0) {
    return (
      <div className={styles.wrap}>
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No form defined yet.</p>
          <p className={styles.emptyText}>
            Go to the Form Builder and save a form configuration first.
          </p>
          <button
            type="button"
            className={styles.emptyBtn}
            onClick={() => navigate(PUBLIC.FORM_BUILDER)}
          >
            Go to Form Builder
            <LuArrowRight size={15} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.top}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Form Preview</h1>
          <p className={styles.subtitle}>
            Fill in the form below and hit <strong>Submit</strong>. The data
            will be printed to the browser console.
          </p>
        </div>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => navigate(PUBLIC.FORM_BUILDER)}
        >
          <LuArrowLeft size={15} />
          Edit form
        </button>
      </header>

      <div className={styles.card}>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          noValidate={false}
        >
          <div className={styles.fieldList}>
            {fields.map((field) => (
              <DynamicField
                key={field.id}
                field={field}
                value={values[field.id] ?? ''}
                onChange={handleChange}
              />
            ))}
          </div>

          <div className={styles.formFooter}>
            {submitted && (
              <p className={styles.successMsg} role="status">
                <LuCircleCheck size={16} />
                Submitted! Check the browser console for the data.
              </p>
            )}
            <button type="submit" className={styles.submitBtn}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPreview;
