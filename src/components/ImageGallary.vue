<script setup>
const props = defineProps(["posts"]);
const envs = import.meta.env;

const baseImageUrl = envs.VITE_BASE_PHOTO_URL;
</script>

<template>
  <div class="image-gallary-container">
    <img
      v-for="post in props.posts"
      :key="post.id"
      :src="`${baseImageUrl}${post.url}`"
    />
  </div>
</template>

<style scoped>
.image-gallary-container {
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
}

img {
  margin: 5px;
  width: 200px;
  height: auto;
  object-fit: contain;
}
</style>
