// @ts-ignore
import { createStore } from "vuex";
import {
  StoreActions,
  StoreMutations,
  type IActions,
  type IGetters,
  type IMutations,
  type IState,
  type IRequestUsers,
} from "@/types/index";
import api from "@/api";
import defaultImageSrc from "@/assets/images/default-image.jpg";

const state: () => IState = () => ({
  usersList: [],
});

const mutations: IMutations = {
  [StoreMutations.CHANGE_USER_CARD_ACTIVE](state, payload) {
    const userCard = state.usersList.find(({ id }) => id === payload.id);

    if (userCard) {
      userCard.isActive = payload.value;
    }
  },
  [StoreMutations.APPEND_USERS_LIST](state, payload) {
    state.usersList.push(...payload);
  },
  [StoreMutations.SET_USERS_LIST](state, payload) {
    state.usersList = payload;
  },
};

const actions: IActions = {
  [StoreActions.NORMALIZE_BACKEND_USERS](context, payload) {
    return payload.map((backUser) => ({
      ...backUser,
      image: defaultImageSrc,
      isActive: false,
    }));
  },
  async [StoreActions.SEARCH_USERS](_, payload: IRequestUsers) {
    const queryList = [
      ...new Set(
        payload.inputModel
          .split(",")
          .map((value) => value.trim())
          .filter((value) => value)
      ),
    ];
    const type = /^\d+$/.test(queryList[0]) ? "id" : "username";

    if (queryList.length) {
      return await api.users.searchUsers(
        queryList,
        payload.page,
        payload.limit,
        type
      );
    } else {
      return null;
    }
  },
};

const getters: IGetters = {
  getActiveUser(state) {
    return state.usersList.find(({ isActive }) => isActive) || null;
  },
};

export default createStore({
  state,
  mutations,
  getters,
  actions,
});
