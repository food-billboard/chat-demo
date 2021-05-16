declare namespace API_USER {

  export interface ILoginParams {
    mobile: string | number 
    password: string 
  }

  export interface IGetUserInfoResData extends STORE_USER.IUserInfo {}

  export interface IRegisterParams {
    mobile: string | number 
    password: string 
    email: string 
    captcha: string 
    username?: string 
    description?: string 
    avatar?: string 
  }

  export interface IRegisterResData extends IGetUserInfoResData {}

  export interface ISendEmailParams {
    email: string 
    type: "forget" | "register"
  }

}