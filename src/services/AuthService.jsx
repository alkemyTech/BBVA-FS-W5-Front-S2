const AuthService = {
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
  getToken: () => {
    return localStorage.getItem("token");
  },
  getEmail: () => {
    return localStorage.getItem("email");
  },
  getNombre: () => {
    return localStorage.getItem("nombre");
  },
  getApellido: () => {
    return localStorage.getItem("apellido");
  },
  GetRol: () => {
    return localStorage.getItem("rol");
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
  },
};

export default AuthService;
