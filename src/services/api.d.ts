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

  export interface IBlackUserParams {
    _id: string 
  }

  export interface IUnBlackUserParams extends IBlackUserParams {}

  export interface IGetBlackUserParams {
    currPage?: number 
    pageSize?: number 
  }

  export interface IGetBlackUserRes {
    username: string 
    avatar: string 
    _id: string 
  }

  export interface IGetFriendsParams extends IGetBlackUserParams {}

  export interface IGetFriendsRes extends IGetBlackUserRes {}

  export interface IPostFriendsParams extends IBlackUserParams {}

  export interface IDeleteFriendsParams extends IUnBlackUserParams {}

}

declare namespace Upload {

  export interface IDeleteParams {
    _id: string
  }

  export interface ILooadParams {
    load: string
  }

  export interface IGetMediaListParams {
    currPage?: number 
    pageSize?: number 
    content?: string 
    type: 0 | 1 | 2
    _id?: string 
    origin_type?:  API_DATA.IDataSourceType
    auth?: TAuth
    status?: TStatus
    size?: number | string 
  } 

  export interface IGetMediaListRes {
    total: number 
    list: IGetMediaListData[]
  }

  export interface IGetMediaListData {
    _id: string 
    src: string 
    name: string 
    createdAt: string 
    updatedAt: string 
    origin_type: API_DATA.IDataSourceType
    white_list_count: number 
    origin: {
      name: string 
      _id: string 
    }
    auth: TAuth
    info: {
      md5: string 
      status: TStatus
      size: number 
      mime: string 
    }
  }

}