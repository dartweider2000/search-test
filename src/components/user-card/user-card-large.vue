<script setup lang="ts">
  import type { IFrontUser } from "@/types";
  import { computed, toRefs } from "vue";

  const props = defineProps<{
    user: IFrontUser;
  }>();

  const { user } = toRefs(props);

  const aboutMe = computed(() => `Hello my name is ${user.value.name}`);
</script>

<template>
  <div class="user-card">
    <div class="user-card__image-wrapper">
      <div class="user-card__image">
        <img :src="user.image" alt="image" />
      </div>
    </div>
    <div class="user-card__body user-body">
      <div class="user-body__name">{{ user.name }}</div>
      <div class="user-body__data">
        <div class="user-body__field">email:</div>
        <div class="user-body__value">{{ user.email }}</div>
      </div>
      <div class="user-body__data">
        <div class="user-body__field">phone:</div>
        <div class="user-body__value">{{ user.phone }}</div>
      </div>
      <div class="user-body__data user-body__data_col">
        <div class="user-body__field">О себе:</div>
        <div class="user-body__value">{{ aboutMe }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .user-card {
    @apply grid grid-cols-[424px,1fr] gap-[60px];

    @media (max-width: 1200px) {
      @apply grid-cols-[1fr] grid-rows-[auto,1fr] justify-items-start;
    }
    // .user-card__image-wrapper
    &__image-wrapper {
      @apply border-[1px] border-solid border-[--brown];

      // @media (max-width: 1200px) {
      //   @apply hidden;
      // }
    }
    // .user-card__image
    &__image {
    }
    // .user-card__body
    &__body {
    }
  }
  .user-body {
    @apply grid gap-[10px] content-start;
    // .user-body__name
    &__name {
      @apply leading-[140%] font-semibold text-black;
      font-size: 16px;
    }
    // .user-body__data
    &__data {
      @apply grid grid-flow-col justify-start whitespace-nowrap text-ellipsis overflow-hidden gap-x-[10px];
      // .user-body__data_col
      &_col {
        @apply mt-[10px] whitespace-normal grid-flow-row;

        & > .user-body__value {
          @apply mt-[25px];
        }
      }
    }
    // .user-body__field
    &__field {
      @apply text-[--black] font-semibold;
    }
    // .user-body__value
    &__value {
      @apply text-[--gray-dark];
    }
  }
</style>
