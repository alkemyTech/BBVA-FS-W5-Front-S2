const AuthService = {
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
  getToken: () => {
    return localStorage.getItem("token");
  },
  getUsername: () => {
    return localStorage.getItem("username");
  },
  getNombre: () => {
    return localStorage.getItem("nombre");
  },
  getApellido: () => {
    return localStorage.getItem("apellido");
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  },
};

export default AuthService;
