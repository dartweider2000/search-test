<script setup lang="ts">
  import UserCardImage from "@/components/user-card/user-card-image.vue";
  import type { IFrontUser } from "@/types";

  defineProps<{
    user: IFrontUser;
  }>();
</script>

<template>
  <div class="user-card" :class="{ 'is-active': user.isActive }">
    <div class="user-card__image">
      <user-card-image :image-src="user.image" />
    </div>
    <div class="user-card__body">
      <div class="user-card__name">{{ user.name }}</div>
      <div class="user-card__email">{{ user.email }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .user-card {
    @apply grid grid-cols-[70px,1fr] items-center rounded-[10px] overflow-hidden cursor-pointer border-[1px] border-solid border-transparent;
    box-shadow: 0px 0px 10px 0px var(--drop-shadow);

    &.is-active {
      @apply border-[--brown];
    }
    // .user-card__image
    &__image {
      @apply h-[70px] border-r-[1px] border-solid border-[--brown];
    }
    // .user-card__body
    &__body {
      @apply text-[14px] h-full p-[15px] grid content-center overflow-hidden;

      .is-active & {
        @apply bg-[--brown];
      }
    }
    // .user-card__name
    &__name {
      @apply text-[--black] font-semibold leading-[1] overflow-hidden text-ellipsis whitespace-nowrap;
    }
    // .user-card__email
    &__email {
      @apply text-[--gray-dark] overflow-hidden text-ellipsis whitespace-nowrap;
    }
  }
</style>
