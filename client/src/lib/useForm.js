import { useState } from 'react';

/** Tiny form helper: values, per-field errors, submit state. `validate(values)` returns {field: message}. */
export function useForm(initial, validate, onSubmit) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [done, setDone] = useState(false);

  const set = (name) => (e) => {
    const v = e && e.target ? e.target.value : e;
    setValues((s) => ({ ...s, [name]: v }));
    if (errors[name]) setErrors((s) => ({ ...s, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setFormError('');
    if (Object.keys(errs).length) {
      document.querySelector('[role="alert"]')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(values);
      setDone(true);
      setValues(initial);
    } catch (err) {
      setFormError(err.message || 'Could not send. Please try again.');
      if (err.errors) setErrors(err.errors);
    } finally {
      setSubmitting(false);
    }
  };

  return { values, errors, set, submitting, formError, done, setDone, handleSubmit };
}
