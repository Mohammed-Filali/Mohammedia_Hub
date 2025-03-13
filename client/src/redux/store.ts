import { createStore } from "redux";

const initialState = {
  user: null,
};

const SET_USER = "SET_USER";

export const setUser = (user: any) => ({
  type: SET_USER,
  payload: user,
});

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

export type RootState = ReturnType<typeof store.getState>; // ✅ Add this
export default store;
