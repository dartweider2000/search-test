import type UsersApi from "@/api/modules/users.api";
import type { FetchResponse } from "ofetch";
import type { ActionContext } from "vuex/types/index.js";

export interface IBackendUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
}

export interface IFrontUser extends IBackendUser {
  isActive: boolean;
  image: string;
}

export interface IChangeUserCardActivePayload {
  id: number;
  value: boolean;
}

export interface IRequestUsers {
  page: number;
  limit: number;
  inputModel: string;
}

export interface IApi {
  users: UsersApi;
}

export enum StoreMutations {
  CHANGE_USER_CARD_ACTIVE = "change_user_card_active",
  SET_USERS_LIST = "set_users_list",
  APPEND_USERS_LIST = "append_users_list",
}

export enum StoreActions {
  SEARCH_USERS = "search_users",
  NORMALIZE_BACKEND_USERS = "normalize_backend_users",
}

export interface IState {
  usersList: IFrontUser[];
}

export interface IMutations {
  [StoreMutations.CHANGE_USER_CARD_ACTIVE](
    state: IState,
    payload: IChangeUserCardActivePayload
  ): void;
  [StoreMutations.SET_USERS_LIST](state: IState, payload: IFrontUser[]): void;
  [StoreMutations.APPEND_USERS_LIST](
    state: IState,
    payload: IFrontUser[]
  ): void;
}

export interface IGetters {
  getActiveUser(state: IState, getters: IGetters): IFrontUser | null;
}

export interface IActions {
  [StoreActions.SEARCH_USERS](
    context: ActionContext<IState, IState>,
    payload: IRequestUsers
  ): Promise<FetchResponse<IBackendUser[]> | null>;
  [StoreActions.NORMALIZE_BACKEND_USERS](
    context: ActionContext<IState, IState>,
    payload: IBackendUser[]
  ): IFrontUser[];
}

export interface IStore {
  state: IState;
  actions: IActions;
  getters: IGetters;
  mutations: IMutations;
}
