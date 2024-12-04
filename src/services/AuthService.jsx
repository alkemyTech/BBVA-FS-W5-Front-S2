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
    return localStorage.getRol("rol");
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  },
};

export default AuthService;
