import axios from "axios";

const API_URL = "http://localhost:3000"; // Backend URL

// Daily Routine API
export const getDailyRoutine = async () => {
    const response = await axios.get(`${API_URL}/routine`);
    return response.data;
};

export const addDailyTask = async (task, time) => {
    const response = await axios.post(`${API_URL}/routine`, { task, time });
    return response.data;
};

export const updateDailyTask = async (id, task, time) => {
    const response = await axios.put(`${API_URL}/routine/${id}`, { task, time });
    return response.data;
};

export const deleteDailyTask = async (id) => {
    const response = await axios.delete(`${API_URL}/routine/${id}`);
    return response.data;
};

// Appointments API
export const getAppointments = async () => {
    const response = await axios.get(`${API_URL}/appointments`);
    return response.data;
};

export const addAppointment = async (doctor, time) => {
    const response = await axios.post(`${API_URL}/appointments`, { doctor, time });
    return response.data;
};

export const updateAppointment = async (id, doctor, time) => {
    const response = await axios.put(`${API_URL}/appointments/${id}`, { doctor, time });
    return response.data;
};

export const deleteAppointment = async (id) => {
    const response = await axios.delete(`${API_URL}/appointments/${id}`);
    return response.data;
};

// User Profile API
export const getUserProfile = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/profile/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Profile fetch error:", error);
        return { success: false, error };
    }
};
