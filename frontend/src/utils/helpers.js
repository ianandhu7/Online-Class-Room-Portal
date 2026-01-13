// Date formatting helper
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Validation helpers
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    return password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password);
};

// String helpers
export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// Array helpers
export const sortByKey = (array, key, order = 'asc') => {
    return [...array].sort((a, b) => {
        if (order === 'asc') {
            return a[key] > b[key] ? 1 : -1;
        }
        return a[key] < b[key] ? 1 : -1;
    });
};

// Error handling
export const getErrorMessage = (error) => {
    if (error.response) {
        return error.response.data.message || 'An error occurred';
    }
    if (error.request) {
        return 'No response from server';
    }
    return error.message || 'An error occurred';
};
