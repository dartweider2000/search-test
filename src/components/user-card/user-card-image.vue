<script setup lang="ts">
  import { ref } from "vue";
  import { ElSkeleton, ElSkeletonItem } from "element-plus";

  defineProps<{
    imageSrc: string;
  }>();

  const isLoading = ref<boolean>(true);

  const loadHandler = () => {
    isLoading.value = false;
  };
</script>

<template>
  <div class="image-block">
    <img
      :src="imageSrc"
      class="image-block__image"
      :class="{ isLoading: 'opacity-0 invisible' }"
      alt="image"
      @load="loadHandler"
    />
    <el-skeleton class="image-block__skeleton" :loading="isLoading" animated>
      <template #template>
        <el-skeleton-item variant="image" />
      </template>
    </el-skeleton>
  </div>
</template>

<style scoped lang="scss">
  .image-block {
    @apply relative w-full h-full;
    // .image-block__image
    &__image {
      @apply object-cover absolute top-0 left-0 w-full h-full;
    }
    // .image-block__skeleton
    &__skeleton {
    }
  }
</style>
