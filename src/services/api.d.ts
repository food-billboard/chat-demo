declare namespace API_USER {

  export interface ILoginParams {
    mobile: string | number 
    password: string 
  }

  export interface IGetUserInfoResData extends STORE_USER.IUserInfo {}

  export interface IForgetParams {
    password: string 
    email: string 
    captcha: string 
  }

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

  export interface IGetUserListData {
    username: string 
    avatar: string 
    _id: string 
    description: string 
    friend_id: string 
  }

  export interface IGetBlackUserRes extends IGetUserListData {}

  export interface IGetFriendsParams extends IGetBlackUserParams {}

  export interface IGetFriendsRes extends IGetUserListData {
    member: string 
  }

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

declare namespace API_CHAT {

  export interface IGetMemberListParams {
    _id: string 
    currPage?: number 
    pageSize?: number 
  }

  export type TUserData = {
    username: string 
    _id: string 
    avatar: string 
  }

  export type TUserStatus = "ONLINE" | "OFFLINE"

  export interface IGetMemberListData {
    user: TUserData & { friend_id: string }
    _id: string 
    status: TUserStatus
    sid: string 
    createdAt: string 
    updatedAt: string 
  }

  export type TRoomType = "SYSTEM" | "USER"

  export type TChatType = "CHAT" | "GROUP_CHAT" | "SYSTEM"

  export interface IGetRoomListParams {
    _id?: string 
    type?: TRoomType 
    origin?: 0 | 1
    create_user?: string 
    content?: string 
    members?: string 
    currPage?: number 
    pageSize?: number 
  }

  export type TCreateUser = TUserData & {
    description: string 
    member: string 
  }

  export type TRoomInfo = {
    name: string 
    description: string 
    avatar: string 
  }

  export interface IGetRoomListData {
    _id: string 
    create_user: TCreateUser
    info: TRoomInfo
    members: number 
    is_delete: boolean 
    createdAt: string 
    updatedAt: string 
    online_members: number 
    type: TChatType
  }

  export interface IPostRoomParams {
    _id: string 
  }

  export interface IPutRoomParams {
    _id?: string 
    all?: 0 | 1 
  }

  export interface IDeleteRoomParams {
    _id: string 
  }

  export interface ICreateRoomParams {
    _id?: string 
    type: "CHAT" | "GROUP_CHAT" 
    members: string 
  }

  export interface IPostJoinRoomParams {
    _id: string 
  }

  export interface IDeleteJoinRoomParams {
    _id: string 
  }

  export interface IGetMessageListParams {
    _id?: string 
    currPage?: number 
    pageSize?: number
  }

  export interface IGetMessageListData {
    createdAt: string 
    updatedAt: string 
    _id: string 
    type: TChatType
    create_user: TCreateUser
    info: TRoomInfo
    message_info: {
      _id: string 
      image: string 
      poster: string 
      video: string 
      text: string,
      media_type: TMessageMediaType
    }
    un_read_message_count: number 
  }

  export interface IPutMessageParams {
    _id: string 
    type?: 0 | 1
  }

  export interface IDeleteMessageParams {
    _id: string 
    type?: 0 | 1
  }

  export type TMessageMediaType = "IMAGE" | "AUDIO" | "TEXT" | "VIDEO"

  export interface IPostMessageParams {
    _id: string 
    type: TMessageMediaType
    content: string 
    point_to?: string 
  }

  export interface IGetMessageDetailParams {
    _id: string 
    currPage?: number 
    pageSize?: number 
    start?: string 
  }

  export interface IgetMessageDetailRes {
    room: Pick<IGetRoomListData, '_id' | 'info'>,
    message: IGetMessageDetailData[]
  }

  export interface IGetMessageDetailData {
    _id: string 
    user_info: TUserData & { description: string }
    media_type: TMessageMediaType
    point_to: string 
    createdAt: string 
    updatedAt: string 
    content: Partial<{
      video: string 
      image: string 
      text: string 
      audio: string 
      poster: string
    }>
  }

  export interface IAgreeFriendParams {
    _id: string 
  }

  export interface IDisagreeFriendParams {
    _id: string 
  }

  export interface IGetInviteFriendListParams {
    currPage?: number 
    pageSize?: number 
  }

  export interface IGetInviteFriendListRes {
    _id:	string
    avatar: string 
    username: string 
    description: string 
    createdAt: string 
  }

}