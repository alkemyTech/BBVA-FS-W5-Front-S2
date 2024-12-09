import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: '',
  nombre: '',
  apellido: '',
  rol: '',
  token: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.nombre = action.payload.nombre;
      state.apellido = action.payload.apellido;
      state.rol = action.payload.rol;
      state.token = action.payload.token;

      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.id = '';
      state.email = '';
      state.nombre = '';
      state.apellido = '';
      state.rol = '';
      state.token = '';

      localStorage.clear();
    },
  },
});


export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
