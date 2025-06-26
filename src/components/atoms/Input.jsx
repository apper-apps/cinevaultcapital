import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  label,
  type = 'text',
  placeholder,
  icon,
  error,
  className = '',
  value,
  onChange,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputClasses = `
    w-full px-4 py-3 
    bg-surface-800 border border-surface-600 rounded-lg
    text-slate-100 placeholder-slate-400
    focus:outline-none focus:border-primary-500 focus:bg-surface-700
    transition-all duration-200
    ${icon ? 'pl-11' : ''}
    ${error ? 'border-red-500 focus:border-red-500' : ''}
    ${className}
  `;

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <ApperIcon 
              name={icon} 
              className={`w-5 h-5 transition-colors duration-200 ${
                isFocused ? 'text-primary-400' : 'text-slate-400'
              }`} 
            />
          </div>
        )}
        
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-400 flex items-center">
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;