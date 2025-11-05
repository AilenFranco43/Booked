// Guardar el token en localStorage
export const saveToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

// Obtener el token de localStorage
export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
};

// Guardar el token en sessionStorage (si prefieres usar sessionStorage)
// export const saveToken = (token) => {
//   sessionStorage.setItem('token', token);
// };

// Obtener el token de sessionStorage (si prefieres usar sessionStorage)
// export const getToken = () => {
//   return sessionStorage.getItem('token');
// };
