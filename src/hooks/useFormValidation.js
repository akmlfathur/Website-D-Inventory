import { useState, useCallback } from 'react';

// Validation rules
const validators = {
    required: (value) => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        if (Array.isArray(value)) return value.length > 0;
        return true;
    },
    email: (value) => {
        if (!value) return true; // Let required handle empty
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    },
    minLength: (value, length) => {
        if (!value) return true;
        return value.length >= length;
    },
    maxLength: (value, length) => {
        if (!value) return true;
        return value.length <= length;
    },
    min: (value, min) => {
        if (value === '' || value === null || value === undefined) return true;
        return Number(value) >= min;
    },
    max: (value, max) => {
        if (value === '' || value === null || value === undefined) return true;
        return Number(value) <= max;
    },
    pattern: (value, regex) => {
        if (!value) return true;
        return regex.test(value);
    },
};

// Error messages
const defaultMessages = {
    required: (field) => `${field} wajib diisi`,
    email: () => 'Format email tidak valid',
    minLength: (field, length) => `${field} minimal ${length} karakter`,
    maxLength: (field, length) => `${field} maksimal ${length} karakter`,
    min: (field, min) => `${field} minimal ${min}`,
    max: (field, max) => `${field} maksimal ${max}`,
    pattern: (field) => `Format ${field} tidak valid`,
};

export default function useFormValidation(initialValues, validationSchema) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validate a single field
    const validateField = useCallback((name, value) => {
        const fieldRules = validationSchema[name];
        if (!fieldRules) return null;

        for (const rule of fieldRules) {
            const { type, value: ruleValue, message, label } = rule;
            const fieldLabel = label || name;

            let isValid = true;
            let errorMessage = '';

            switch (type) {
                case 'required':
                    isValid = validators.required(value);
                    errorMessage = message || defaultMessages.required(fieldLabel);
                    break;
                case 'email':
                    isValid = validators.email(value);
                    errorMessage = message || defaultMessages.email();
                    break;
                case 'minLength':
                    isValid = validators.minLength(value, ruleValue);
                    errorMessage = message || defaultMessages.minLength(fieldLabel, ruleValue);
                    break;
                case 'maxLength':
                    isValid = validators.maxLength(value, ruleValue);
                    errorMessage = message || defaultMessages.maxLength(fieldLabel, ruleValue);
                    break;
                case 'min':
                    isValid = validators.min(value, ruleValue);
                    errorMessage = message || defaultMessages.min(fieldLabel, ruleValue);
                    break;
                case 'max':
                    isValid = validators.max(value, ruleValue);
                    errorMessage = message || defaultMessages.max(fieldLabel, ruleValue);
                    break;
                case 'pattern':
                    isValid = validators.pattern(value, ruleValue);
                    errorMessage = message || defaultMessages.pattern(fieldLabel);
                    break;
                case 'custom':
                    isValid = rule.validate(value, values);
                    errorMessage = message || `${fieldLabel} tidak valid`;
                    break;
                default:
                    break;
            }

            if (!isValid) {
                return errorMessage;
            }
        }

        return null;
    }, [validationSchema, values]);

    // Validate all fields
    const validateAll = useCallback(() => {
        const newErrors = {};
        let isValid = true;

        for (const fieldName in validationSchema) {
            const error = validateField(fieldName, values[fieldName]);
            if (error) {
                newErrors[fieldName] = error;
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    }, [validationSchema, values, validateField]);

    // Handle input change
    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setValues((prev) => ({ ...prev, [name]: newValue }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    }, [errors]);

    // Handle blur
    const handleBlur = useCallback((e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));

        const error = validateField(name, value);
        if (error) {
            setErrors((prev) => ({ ...prev, [name]: error }));
        }
    }, [validateField]);

    // Handle form submission
    const handleSubmit = useCallback((callback) => async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Mark all fields as touched
        const allTouched = {};
        for (const fieldName in validationSchema) {
            allTouched[fieldName] = true;
        }
        setTouched(allTouched);

        // Validate all fields
        const isValid = validateAll();

        if (isValid) {
            try {
                await callback(values);
            } catch (error) {
                console.error('Form submission error:', error);
            }
        }

        setIsSubmitting(false);
    }, [validationSchema, validateAll, values]);

    // Reset form
    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialValues]);

    // Set single value
    const setValue = useCallback((name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    }, []);

    // Get field props (for easy binding)
    const getFieldProps = useCallback((name) => ({
        name,
        value: values[name] || '',
        onChange: handleChange,
        onBlur: handleBlur,
    }), [values, handleChange, handleBlur]);

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        validateField,
        validateAll,
        reset,
        setValue,
        setValues,
        getFieldProps,
        isValid: Object.keys(errors).length === 0,
    };
}
