import { Account, ApiResponse, GetAccount, User } from "../types/backend"
import instance from "./Axios-customize"
import { UserCreationRequest } from "../types/User"

export const callRegister = (request: UserCreationRequest) => {
        const response = instance.post<ApiResponse<User>>('/api/auth/register', request);

        return response;
        // console.log(response);
        // if (response.status === 200 && response.data) {
        //     return response.data; // Successful response
        // }
        // if (response.status !== 200) {
        //     return response;
        // }
};


export const callLogin = (username: string, password: string) => {
    return instance.post<ApiResponse<Account>>('/api/auth/login', { username, password })
}

export const callLogout = () => {
    return instance.post<ApiResponse<void>>('/api/auth/logout')
}

export const callFetchAccount = () => {
    return instance.get<ApiResponse<GetAccount>>('/api/auth/account')
}

export const callVerifyOtp = (email: string, otp: string) => {
    return instance.post<ApiResponse<void>>(`/api/auth/verify-otp`, {
        param: {
            email, otp
        }
    })
}