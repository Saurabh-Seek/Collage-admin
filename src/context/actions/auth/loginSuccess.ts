import { LOGIN_SUCCESS } from "../../actionTypes";

export default (payload: any) => (dispatch: any) => {
  dispatch({
    type: LOGIN_SUCCESS,
    payload: payload,
  });
};
