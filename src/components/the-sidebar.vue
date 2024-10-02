<script setup lang="ts">
  import {
    StoreActions,
    StoreMutations,
    type IBackendUser,
    type IChangeUserCardActivePayload,
    type IRequestUsers,
    type IState,
  } from "@/types";
  import { computed, onMounted, ref } from "vue";
  // @ts-ignore
  import { useStore } from "vuex";
  import { ElInput, ElNotification } from "element-plus";
  import SvgLoader from "@/components/svg-loader.vue";
  import UserCardSmall from "@/components/user-card/user-card-small.vue";
  import {
    useDebounceFn,
    useIntersectionObserver,
    useResizeObserver,
    type UseIntersectionObserverReturn,
  } from "@vueuse/core";
  import type { FetchResponse } from "ofetch";
  import type { Store } from "vuex/types/index.js";

  const store = useStore() as Store<IState>;
  const loaderEl = ref<HTMLElement | null>(null);
  const page = ref<number>(1);
  const limit = ref<number>(7);
  const isRequestPending = ref<boolean>(false);
  const isLoaderVisible = ref<boolean>(false);
  const totalUsersCountAtBackend = ref<number | null>(null);
  const observer = ref<UseIntersectionObserverReturn | null>(null);

  const reactiveState = computed(() => store.state);

  const debounceTime = 400;

  const hasMorePostsAtBackend = () => {
    if (totalUsersCountAtBackend.value === null) return false;

    return (
      reactiveState.value.usersList.length < totalUsersCountAtBackend.value
    );
  };

  const inputModal = ref<string>("");

  const requestToData = async (): Promise<void> => {
    try {
      isRequestPending.value = true;

      const body: IRequestUsers = {
        inputModel: inputModal.value,
        limit: limit.value,
        page: page.value,
      };

      const res: FetchResponse<IBackendUser[]> | null = await store.dispatch(
        StoreActions.SEARCH_USERS,
        body
      );

      if (res) {
        const count = res.headers.get("X-Total-Count");
        totalUsersCountAtBackend.value =
          typeof count === "string" ? +count : count;

        const data = res._data as IBackendUser[];
        const frontUsersList = await store.dispatch(
          StoreActions.NORMALIZE_BACKEND_USERS,
          data
        );

        if (page.value === 1) {
          store.commit(StoreMutations.SET_USERS_LIST, frontUsersList);
        } else {
          store.commit(StoreMutations.APPEND_USERS_LIST, frontUsersList);
        }
      }
    } catch (err) {
      console.log(err);

      ElNotification({
        type: "error",
        title: "Произошла ошибка",
        message: (err as Error).message,
        duration: 10_000,
      });

      stopObserver();
    } finally {
      isRequestPending.value = false;
    }
  };

  const resetSearchData = () => {
    page.value = 1;
    isLoaderVisible.value = true;
    totalUsersCountAtBackend.value = null;
    isRequestPending.value = false;
    store.commit(StoreMutations.SET_USERS_LIST, []);

    stopObserver();
  };

  const stopObserver = () => {
    observer.value?.stop();
    observer.value = null;
  };

  const initObserver = () => {
    stopObserver();

    observer.value = useIntersectionObserver(
      loaderEl,
      async ([{ isIntersecting }]) => {
        if (
          isIntersecting &&
          !isRequestPending.value &&
          isLoaderVisible.value
        ) {
          page.value++;

          await requestToData();

          if (!hasMorePostsAtBackend()) {
            isLoaderVisible.value = false;
            stopObserver();
          }
        }
      },
      { rootMargin: "0px 0px 50% 0px" }
    );
  };

  const request = async () => {
    resetSearchData();

    await requestToData();

    if (hasMorePostsAtBackend()) {
      initObserver();
    } else {
      isLoaderVisible.value = false;
    }
  };

  const userCardClickHandler = (id: number) => {
    const activeUserCard = reactiveState.value.usersList.find(
      ({ isActive }) => isActive
    );

    if (activeUserCard) {
      store.commit(StoreMutations.CHANGE_USER_CARD_ACTIVE, {
        id: activeUserCard.id,
        value: false,
      } as IChangeUserCardActivePayload);
    }

    if (id !== activeUserCard?.id) {
      store.commit(StoreMutations.CHANGE_USER_CARD_ACTIVE, {
        id,
        value: true,
      } as IChangeUserCardActivePayload);
    }
  };

  const inputHandler = useDebounceFn(request, debounceTime);

  const resultEl = ref<HTMLElement | null>(null);
  const resultElHeight = ref<number>(0);
  const resultElHeightCssVar = computed(() => `${resultElHeight.value}px`);

  onMounted(() => {
    if (inputModal.value) request();

    resultElHeight.value = resultEl.value!.offsetHeight!;
    useResizeObserver(resultEl, () => {
      resultElHeight.value = resultEl.value!.offsetHeight!;
    });
  });
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__section">
      <div class="sidebar__title">Поиск сотрудников</div>
      <el-input
        v-model="inputModal"
        placeholder="Введите id или имя"
        class="sidebar__input input"
        @input="inputHandler"
      />
    </div>
    <div ref="resultEl" class="sidebar__section">
      <div class="sidebar__title sidebar__title_result">Результаты</div>
      <div class="sidebar__users-card-wrapper users-card-wrapper">
        <div
          v-if="!reactiveState.usersList.length && !isLoaderVisible"
          class="users-card-wrapper__empty"
        >
          Ничего не найдено
        </div>
        <div v-else class="users-card-wrapper__users">
          <user-card-small
            v-for="user in reactiveState.usersList"
            :key="user.id"
            class="users-card-wrapper__user"
            :user="user"
            @click="userCardClickHandler(user.id)"
          />
        </div>
        <svg-loader
          v-if="isLoaderVisible"
          ref="loaderEl"
          class="users-card-wrapper__loader"
        />
      </div>
    </div>
  </aside>
</template>

<style lang="scss">
  .input.el-input {
    --el-input-focus-border-color: var(--gray-middle);
    --el-input-hover-border-color: var(--gray-middle);
    --el-input-border-color: var(--gray-middle);
    --el-input-height: auto;

    & > .el-input__wrapper {
      @apply px-[24px] py-[16px] rounded-[8px];

      box-shadow: 0 0 0 1.5px
        var(--el-input-border-color, var(--el-border-color)) inset;

      &.is-focus {
        box-shadow: 0 0 0 1.5px
          var(--el-input-border-color, var(--el-border-color)) inset;
      }

      &:hover {
        box-shadow: 0 0 0 1.5px
          var(--el-input-border-color, var(--el-border-color)) inset;
      }
    }
  }
</style>

<style scoped lang="scss">
  .sidebar {
    @apply py-[27px] pl-[20px] pr-[30px] grid gap-[28px] grid-rows-[auto,1fr];
    // .sidebar__section
    &__section {
    }
    // .sidebar__title
    &__title {
      @apply text-[--black] font-semibold leading-[140%];

      &_result {
        @apply mb-[26px];
      }
    }
    // .sidebar__input
    &__input {
      @apply mt-[14px] text-[14px] leading-[1];
    }
    // .sidebar__users-card-wrapper
    &__users-card-wrapper {
      @apply mt-[16px];
    }
  }
  .users-card-wrapper {
    @apply mx-[-16px] px-[16px] overflow-auto my-[-10px] py-[10px];
    max-height: calc(v-bind("resultElHeightCssVar") - 24px - 16px);

    @apply grid;
    // .users-card-wrapper__empty
    &__empty {
      @apply text-[--gray-dark] leading-[1];
      font-size: 14px;
    }
    // .users-card-wrapper__users
    &__users {
      @apply grid gap-[18px];
    }
    // .users-card-wrapper__loader
    &__loader {
      @apply justify-self-center mt-[16px];
    }
  }
</style>
