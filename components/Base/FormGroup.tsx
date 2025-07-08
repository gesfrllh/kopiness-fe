import React, { useState, ReactElement, isValidElement, cloneElement, useEffect } from 'react';
import clsx from 'clsx';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

interface Group {
  label: string;
  required?: boolean;
  children: ReactElement<InputProps | TextareaProps>;
  value?: string
}

const FormGroup: React.FC<Group> = ({ children, label, required, value }) => {
  const [focus, setFocus] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = () => setFocus(true);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFocus(false);
    setHasValue(!!e.target.value);
  };

  useEffect(() => {
    setHasValue(!!value)
  }, [value])

  return (
    <div className="relative w-full mt-4">
      <label
        className={clsx(
          'absolute left-3 transition-all px-1',
          focus || hasValue ? 'text-xs -top-2 bg-white text-amber-800' : 'text-gray-500 top-2.5'
        )}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={clsx(
          'border rounded px-3 pt-5 pb-2 transition-colors',
          focus ? 'border-amber-800' : 'border-gray-300'
        )}
      >
        {isValidElement(children) &&
          cloneElement(children, {
            className: 'w-full outline-none bg-transparent',
            onFocus: handleFocus,
            onBlur: handleBlur,
          })}
      </div>
    </div>
  );
};

export default FormGroup;
