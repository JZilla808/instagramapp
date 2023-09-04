<script setup>
const props = defineProps(["post"]);
const envs = import.meta.env;

const baseImageUrl = envs.VITE_BASE_PHOTO_URL;

const url = baseImageUrl + props.post.url;
</script>
<template>
  <ACard hoverable style="width: 240px" class="card">
    <template #cover>
      <img alt="example" :src="url" />
    </template>
    <ACardMeta :title="post.username">
      <template #description>{{ post.caption }}</template>
    </ACardMeta>
  </ACard>
</template>

<style scoped>
.card {
  margin-bottom: 20px;
}
</style>
