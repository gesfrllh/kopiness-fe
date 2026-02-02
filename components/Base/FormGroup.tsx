import React, { useState, isValidElement, cloneElement, useEffect } from 'react';
import clsx from 'clsx';
import { usePasswordStore } from '@/store/usePasswordStore';
import { Icon } from '@iconify/react';
import { Group } from '@/types';

const FormGroup: React.FC<Group> = ({ children, label, required, value }) => {
  const [focus, setFocus] = useState<boolean>(false);
  const [hasValue, setHasValue] = useState<boolean>(false);

  const handleFocus = () => setFocus(true);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFocus(false);
    setHasValue(!!e.target.value);
  };

  const isValid = isValidElement(children);

  const initialType = isValid && 'type' in children.props ? children.props.type : undefined;
  const isPasswordInput = initialType === 'password';
  const isName = isValid ? children.props.name : undefined;

  const showPassword = usePasswordStore((s) =>
    isName ? s.isVisible(isName) : false
  )

  const childValue = isValid && 'value' in children.props ? children.props.value : value

  const toggleVisibility = usePasswordStore((s) => s.toggleVisibility)

  useEffect(() => {
    setHasValue(childValue !== undefined && childValue !== null && String(childValue).length > 0)
  }, [childValue])

  return (
    <div className="relative w-full bg-colors-var">
      <label
        className={clsx(
          'absolute left-3 bg-colors-var transition-all px-1',
          focus || hasValue ? 'text-xs -top-2 bg-colors-var' : ' top-2.5'
        )}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={clsx(
          'border rounded px-3 pt-4 pb-2 transition-colors',
          focus ? 'border-var' : 'border-gray-300'
        )}
      >
        {isValid &&
          cloneElement(children, {
            className: 'w-full outline-none bg-transparent',
            onFocus: handleFocus,
            onBlur: handleBlur,
            ...(isPasswordInput && {
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
