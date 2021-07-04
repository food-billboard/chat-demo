declare namespace STORE_GLOBAL {

  export interface IState {
    getUserInfo: STORE_USER.IBaseState<STORE_USER.IUserInfo>
    Forgot: STORE_USER.IBaseState<any>
    Login: STORE_USER.IBaseState<any>
    Message: STORE_USER.IBaseState<STORE_USER.IMessageData>
    MessageDetail: STORE_USER.IBaseState<STORE_USER.IMessageDetailData>
    Register: STORE_USER.IBaseState<any>
    Room: STORE_USER.IBaseState<STORE_USER.IRoomData>
    Socket: STORE_USER.IBaseState<STORE_USER.ISocketData>
    InviteFriend: STORE_USER.IBaseState<STORE_USER.IInviteFriendList>
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
    member: string 
  }

  export interface ISocketData {
    socket: any 
  }

  export interface IBaseState<T=any> {
    error: any
    loading: boolean 
    value: T
  }

  export interface IRoomData {
    roomList: API_CHAT.IGetRoomListData[]
  }

  export interface IMessageData {
    messageList: API_CHAT.IGetMessageListData[]
  }

  export interface IMessageDetailData {
    messageDetailList: API_CHAT.IgetMessageDetailRes
  }

  export interface IInviteFriendList {
    inviteFriendList: API_CHAT.IGetInviteFriendListRes[]
  }

}