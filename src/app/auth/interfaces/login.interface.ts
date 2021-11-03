export interface ILoginData {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface IRegisterData {
    fullName: string;
    email: string;
    password: string;
    phone: string;
}

export interface ITokens {
    token: string;
    refreshToken: string;
    userId: string;
    username:string;
    isPublicPage: boolean;
    userLandlordOrPM:string;
    redirectToLead: boolean;
    email: string;
    permissionSettings: string;
}
