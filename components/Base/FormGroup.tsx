import React, { useState, ReactElement, isValidElement, cloneElement, useEffect } from 'react';
import clsx from 'clsx';
import { usePasswordStore } from '@/store/usePasswordStore';
import { Icon } from '@iconify/react';
import { BaseInputProps, TextareaProps, Group } from '@/types';

const isPasswordElement = (
  el: ReactElement<BaseInputProps | TextareaProps>
): el is ReactElement<BaseInputProps> => {
  return 'type' in el.props && el.props.type === 'password';
};

const FormGroup: React.FC<Group> = ({ children, label, required, value }) => {
  const [focus, setFocus] = useState<boolean>(false);
  const [hasValue, setHasValue] = useState<boolean>(false);

  const handleFocus = () => setFocus(true);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFocus(false);
    setHasValue(!!e.target.value);
  };
  
  const isValid = isValidElement(children);
  const isPasswordInput = isValid && isPasswordElement(children);
  const isName = isValid ? children.props.name : undefined;

  const showPassword = usePasswordStore((s) => 
    isName ? s.isVisible(isName) : false
  )

  const toggleVisibility = usePasswordStore((s) => s.toggleVisibility)

  useEffect(() => {
    setHasValue(!!value)
  }, [value])

  return (
    <div className="relative w-full bg-white mt-4">
      <label
        className={clsx(
          'absolute left-3 bg-white transition-all px-1',
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
        {isValid &&
          cloneElement(children, {
            className: 'w-full outline-none bg-transparent',
            onFocus: handleFocus,
            onBlur: handleBlur,
            ...(isPasswordInput &&  {
              type: showPassword ? 'text' : 'password'
            })
          })}
        {isPasswordInput && isName && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => toggleVisibility(isName)}
          >
            <Icon icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"} width={24} height={24} />
          </span>
        )}
      </div>
    </div>
  );
};

export default FormGroup;
