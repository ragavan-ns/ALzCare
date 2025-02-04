const API_URL = "http://localhost:3000"; // Backend URL

// Daily Routine API
export const getDailyRoutine = async () => {
    const response = await fetch(`${API_URL}/routine`);
    return await response.json();
};

export const addDailyTask = async (task, time) => {
    const response = await fetch(`${API_URL}/routine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, time }),
    });
    return await response.json();
};

export const updateDailyTask = async (id, task, time) => {
    const response = await fetch(`${API_URL}/routine/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, time }),
    });
    return await response.json();
};

export const deleteDailyTask = async (id) => {
    const response = await fetch(`${API_URL}/routine/${id}`, { method: "DELETE" });
    return await response.json();
};

// Appointments API
export const getAppointments = async () => {
    const response = await fetch(`${API_URL}/appointments`);
    return await response.json();
};

export const addAppointment = async (doctor, time) => {
    const response = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctor, time }),
    });
    return await response.json();
};

export const updateAppointment = async (id, doctor, time) => {
    const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctor, time }),
    });
    return await response.json();
};

export const deleteAppointment = async (id) => {
    const response = await fetch(`${API_URL}/appointments/${id}`, { method: "DELETE" });
    return await response.json();
};

export const getUserProfile = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/profile/${userId}`); // Pass userId dynamically
    return await response.json();
  } catch (error) {
    console.error("Profile fetch error:", error);
    return { success: false, error };
  }
};
