import { Account, ApiResponse, GetAccount, User } from "../types/backend"
import instance from "./Axios-customize"
import { UserCreationRequest } from "../types/User"

export const callRegister = (request: UserCreationRequest) => {
    const response = instance.post<ApiResponse<User>>('/auth/register', request);
    return response;
};

export const callLogin = (username: string, password: string) => {
    return instance.post<ApiResponse<Account>>('/auth/login', { username, password })
}

export const callLogout = () => {
    return instance.post<ApiResponse<void>>('/auth/logout')
}

export const callFetchAccount = () => {
    return instance.get<ApiResponse<GetAccount>>('/auth/account')
}

export const callVerifyOtp = (email: string, otp: string) => {
    return instance.post<ApiResponse<void>>(`/auth/verify-otp`, {
        param: {
            email, otp
        }
    })
}