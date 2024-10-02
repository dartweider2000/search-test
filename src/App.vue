<script setup lang="ts">
  import TheSidebar from "@/components/the-sidebar.vue";
  import UserCardLarge from "@/components/user-card/user-card-large.vue";
  // @ts-ignore
  import { Store, useStore } from "vuex";
  import type { IGetters, IState } from "./types";

  const store = useStore() as Store<IState>;
</script>

<template>
  <div class="app">
    <header class="app__header header">
      <div class="header__title">Жилфонд</div>
      <div class="header__text">Пользователь</div>
    </header>
    <div class="app__body">
      <the-sidebar class="app__sidebar" />
      <div class="app__user-card-wrapper">
        <div
          v-if="!(store.getters as IGetters).getActiveUser"
          class="app__empty"
        >
          Выберите сотрудника, чтобы посмотреть его профиль
        </div>
        <user-card-large
          v-else
          class="app__user-card"
          :user="store.getters.getActiveUser"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .app {
    @apply grid gap-[25px] grid-rows-[auto,1fr] p-[50px] min-h-dvh;
    // .app__header
    &__header {
    }
    // .app__body
    &__body {
      @apply rounded-[16px] bg-[--gray-light] grid grid-cols-[296px,1fr];
      box-shadow: 0 0 10px var(--drop-shadow);
    }
    // .app__sidebar
    &__sidebar {
      @apply border-r-[1px] border-solid border-[--gray-middle-plus];
    }
    // .app__user-card-wrapper
    &__user-card-wrapper {
      @apply grid pl-[20px] py-[30px] pr-[30px];
    }
    // .app__empty
    &__empty {
      @apply self-center justify-self-center;
    }
    &__user-card {
      @apply self-start;
    }
  }
  .header {
    @apply grid grid-cols-[1fr,auto] items-start;
    // .header__title
    &__title {
      @apply text-[red] font-bold;
      font-size: 32px;
    }
    // .header__text
    &__text {
      @apply text-[--black];
    }
  }
</style>
