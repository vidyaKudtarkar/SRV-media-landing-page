/**
 * Form Validation with Accessibility
 * ----------------------------------
 * WCAG 2.2 AA compliant form validation
 * Screen reader announcements
 * Keyboard accessible
 */
(function () {
    const form = document.querySelector('.hero__enquiry form');
    if (!form) return;

    const inputs = {
        parentName: document.getElementById('parent-name'),
        phoneNumber: document.getElementById('phone-number'),
        gradeInquiry: document.getElementById('grade-inquiry')
    };

    const errors = {
        parentName: document.getElementById('parent-name-error'),
        phoneNumber: document.getElementById('phone-number-error'),
        gradeInquiry: document.getElementById('grade-inquiry-error')
    };

    // Check if form exists
    if (!inputs.parentName || !inputs.phoneNumber || !inputs.gradeInquiry) return;

    /**
     * Validate phone number format
     */
    function validatePhone(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    /**
     * Show error message
     */
    function showError(field, message) {
        const errorElement = errors[field];
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.setAttribute('role', 'alert');
        }
    }

    /**
     * Clear error message
     */
    function clearError(field) {
        const errorElement = errors[field];
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.removeAttribute('role');
        }
    }

    /**
     * Validate individual field
     */
    function validateField(field, value) {
        switch (field) {
            case 'parentName':
                if (!value.trim()) {
                    showError('parentName', 'Parent\'s name is required');
                    return false;
                }
                if (value.trim().length < 2) {
                    showError('parentName', 'Name must be at least 2 characters');
                    return false;
                }
                clearError('parentName');
                return true;

            case 'phoneNumber':
                if (!value.trim()) {
                    showError('phoneNumber', 'Phone number is required');
                    return false;
                }
                if (!validatePhone(value)) {
                    showError('phoneNumber', 'Please enter a valid phone number');
                    return false;
                }
                clearError('phoneNumber');
                return true;

            case 'gradeInquiry':
                if (!value.trim()) {
                    showError('gradeInquiry', 'Grade inquiry is required');
                    return false;
                }
                if (value.trim().length < 5) {
                    showError('gradeInquiry', 'Please provide more details');
                    return false;
                }
                clearError('gradeInquiry');
                return true;

            default:
                return true;
        }
    }

    // Real-time validation on blur
    inputs.parentName?.addEventListener('blur', () => {
        validateField('parentName', inputs.parentName.value);
    });

    inputs.phoneNumber?.addEventListener('blur', () => {
        validateField('phoneNumber', inputs.phoneNumber.value);
    });

    inputs.gradeInquiry?.addEventListener('blur', () => {
        validateField('gradeInquiry', inputs.gradeInquiry.value);
    });

    // Clear errors on input
    inputs.parentName?.addEventListener('input', () => {
        if (inputs.parentName.value.trim()) {
            clearError('parentName');
        }
    });

    inputs.phoneNumber?.addEventListener('input', () => {
        if (inputs.phoneNumber.value.trim()) {
            clearError('phoneNumber');
        }
    });

    inputs.gradeInquiry?.addEventListener('input', () => {
        if (inputs.gradeInquiry.value.trim()) {
            clearError('gradeInquiry');
        }
    });

    // Form submission validation
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isParentNameValid = validateField('parentName', inputs.parentName.value);
        const isPhoneValid = validateField('phoneNumber', inputs.phoneNumber.value);
        const isGradeValid = validateField('gradeInquiry', inputs.gradeInquiry.value);

        if (isParentNameValid && isPhoneValid && isGradeValid) {
            // Form is valid, submit it
            // Focus first error if any
            if (!isParentNameValid) {
                inputs.parentName.focus();
            } else if (!isPhoneValid) {
                inputs.phoneNumber.focus();
            } else if (!isGradeValid) {
                inputs.gradeInquiry.focus();
            } else {
                // All valid, proceed with submission
                form.submit();
            }
        } else {
            // Focus first invalid field
            if (!isParentNameValid) {
                inputs.parentName.focus();
            } else if (!isPhoneValid) {
                inputs.phoneNumber.focus();
            } else if (!isGradeValid) {
                inputs.gradeInquiry.focus();
            }
        }
    });
})();

