export const getAuth = () => {

    try {

        const raw = localStorage.getItem("auth");

        return raw ? JSON.parse(raw) : null;

    } catch {

        return null;

    }

};

export const getToken = () => {

    return getAuth()?.token ?? null;

};

export const getUser = () => {

    return getAuth()?.user ?? null;

};

export const getRoles = () => {

    return getUser()?.roles ?? [];

};

export const isAuthenticated = () => {

    return !!getToken();

};

export const hasRole = (role) => {

    const roles = getRoles();

    return roles.includes(role);

};

export const login = (data) => {

    localStorage.setItem("auth", JSON.stringify(data));

};

export const logout = () => {

    localStorage.removeItem("auth");

};