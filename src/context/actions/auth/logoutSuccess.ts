import { LOGOUT_SUCCESS } from "../../actionTypes"

export default (payload:any) => (dispatch:any) => {
    dispatch({
        type: LOGOUT_SUCCESS,
        payload: payload
    })
}