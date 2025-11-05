//   "user": {
//     "id": "sdf"
//     "name": "Gaspar",
//     "email": "test@gmailfdsf.com",
//     "mobileNumber": "23423423423423",
//     "birthDate": "2001-01-01T00:00:00.000Z",
//     "nationality": "rwerwer",
//   },

export const USER_STATE = {
  'CHECKING': 'CHECKING',
  'VERIFIED': 'VERIFIED',
  'UNVERIFIED': 'UNVERIFIED'
}

export const createAuthSlice = (set) => ({
  status: USER_STATE.CHECKING,
  user: null,
  setUser: (user) => set({ user }), // ✅ Agregamos setUser

  login: (user) => {
    set({ user, status: USER_STATE.VERIFIED })
  },

  logout: () => {
    set({ status: USER_STATE.UNVERIFIED, user: null })
  },

  checking: () => set({ status: USER_STATE.CHECKING })


  
});
