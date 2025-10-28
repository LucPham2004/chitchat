import { Account, ApiResponse, GetAccount, User } from "../types/backend"
import instance from "./Axios-customize"
import { UserCreationRequest } from "../types/User"

export const callRegister = (request: UserCreationRequest) => {
    const response = instance.post<ApiResponse<User>>('/auth/register', request);
    return response;
};

export const callLogin = (email: string, password: string) => {
    return instance.post<ApiResponse<Account>>('/auth/login', { email, password })
}

export const callLogout = () => {
    return instance.post<ApiResponse<void>>('/auth/logout')
}

export const callForgotPassSendOtp = (email: string) => {
    return instance.post<ApiResponse<Account>>('/auth/forgot-password', { email })
}

export const callForgotPassVerifyOtp = (email: string, otp: string) => {
    return instance.post<ApiResponse<void>>('/auth/verify-otp', { email, otp })
}

export const callResetPassword = (token: string, newPassword: string, confirmPassword: string) => {
    return instance.post<ApiResponse<void>>('/auth/reset-password', { token, newPassword, confirmPassword })
}

export const callFetchAccount = () => {
    return instance.get<ApiResponse<GetAccount>>('/auth/account')
}

export const callVerifyOtp = (email: string, otp: string) => {
    return instance.post<ApiResponse<void>>(`/auth/verify-otp`, { email, otp })
}