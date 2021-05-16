declare namespace STORE_GLOBAL {

  export interface IState {
    getUserInfo: STORE_USER.IBaseState<STORE_USER.IUserInfo>
  }

}

declare namespace STORE_USER {

  export interface IUserInfo {
    _id: string 
    attentions: number 
    avatar: string 
    fans: number 
    username: string 
    createdAt: string 
    updatedAt: string 
  }

  export interface IBaseState<T=any> {
    error: any
    loading: boolean 
    value: T
  }

}