const safeGetStorageItem = (key, defaultValue = null) => {
  try {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (e) {
    console.error(`Error accessing ${key}:`, e);
    return defaultValue;
  }
};

export const saveToken = (userId, token, role) => {
  try {
    const data = { userId, token, role };
    sessionStorage.setItem("authData", JSON.stringify(data));
  } catch (e) {
    console.error("Error saving token:", e);
  }
};

export const getCurrentUser = () => {
  return safeGetStorageItem("authData");
};

export const removeToken = () => {
  try {
    sessionStorage.removeItem("authData");
  } catch (e) {
    console.error("Error removing token:", e);
  }
};

