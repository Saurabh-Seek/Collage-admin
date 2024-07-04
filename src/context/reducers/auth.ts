import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from "../actionTypes";

const auth = (state: any, { type, payload }: any) => {
    switch (type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                ...payload,
                isLogin: true,
                isSignUp: false,
            }
        case LOGOUT_SUCCESS:
            return {
                ...state,
                accessToken: "",
                email: null,
                email_verified: null,
                user: null,
                user_name: null,
                account_status: null,
                account_type: null,
                device_type: null,
                token_gen_at: null,
                admin_verified: null,
                social_token: null,
                social_type: null,
                fcm_token: null,
                provider: "META_MASK",
                type: null,
                _id: null,
                isLogin: false,
                isSignUp: false,
            }
        default: {
            return {
                ...state,
            }
        }
    }
}

export default auth;