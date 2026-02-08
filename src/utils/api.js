import axiosInstance from './axios';

export const getUsers = () => {
    return axiosInstance.get('/employees');
}

export const uploadFile = (formData) => {
    return axiosInstance.post('employee_imports', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}