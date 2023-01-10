import { Accessor, createSignal, onCleanup, onMount } from 'solid-js';
import { createForm } from 'final-form';

interface Api<FormValues> {
  values: Accessor<FormValues>;
  isSubmitting: Accessor<boolean>;
  handleSubmit: (event: Event) => void;
  field: (ref: HTMLElement) => void;
  error: (ref: HTMLElement, name: Accessor<keyof FormValues>) => void;
}

export const useForm = <FormValues,>(
  onSubmit: (values: FormValues) => Promise<void>,
  initialValues: FormValues,
  validate: (values: FormValues) => Partial<Record<keyof FormValues, string>> = () => ({}),
): Api<FormValues> => {
  const form = createForm({ onSubmit, initialValues, validate });
  const [isSubmitting, setSubmitting] = createSignal(false);
  const [values, setValues] = createSignal(initialValues);
  const unsubscribes: Array<() => void> = [];
  onMount(() => {
    unsubscribes.push(
      form.subscribe(
        ({ submitting, values }) => {
          setSubmitting(submitting);
          setValues(() => values);
        },
        {
          submitting: true,
          values: true,
        },
      ),
    );
  });

  onCleanup(() => unsubscribes.forEach((unsubscribe) => unsubscribe()));

  const field = (ref: HTMLInputElement) => {
    const name = ref.name as keyof FormValues;
    let removeListeners: () => void | undefined;
    unsubscribes.push(
      form.registerField(
        name,
        ({ value, change, focus, blur }) => {
          ref.value = String(value);
          if (!removeListeners) {
            // we haven't registered listeners yet
            const onBlur = (event: Event) => blur();
            const onChange = (event: Event) => change((event.target as any).value); // any? 😢
            const onFocus = (event: Event) => focus();
            ref.addEventListener('blur', onBlur);
            ref.addEventListener('input', onChange);
            ref.addEventListener('focus', onFocus);
            removeListeners = () => {
              ref.removeEventListener('blur', onBlur);
              ref.removeEventListener('input', onChange);
              ref.removeEventListener('focus', onFocus);
            };
            unsubscribes.push(removeListeners);
          }
        },
        { value: true },
      ),
    );
  };

  const error = (ref: HTMLInputElement, getName: Accessor<keyof FormValues>) => {
    const name = getName();
    unsubscribes.push(
      form.registerField(
        name,
        ({ touched, error }) => {
          ref.innerText = touched && error ? error : '';
        },
        { touched: true, error: true },
      ),
    );
  };

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    form.submit();
  };

  return {
    isSubmitting,
    error,
    field,
    handleSubmit,
    values,
  };
};
