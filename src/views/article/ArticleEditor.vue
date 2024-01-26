<script setup lang="ts">
import { ref } from 'vue';
import {MdEditor} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const text = ref('Hello Editor!');

// TODO: Auto save drafts to localstorage
// TODO: "continue" button
// TODO: Input for article name
</script>

<template>
  <div class="w-full flex flex-column align-items-center">
    <h1>Create Article</h1>
    <div class="flex flex-column align-items-center w-30rem">

    </div>
  </div>
  <MdEditor v-model="text" language="en-US" previewTheme='github' theme="dark" />
</template>



<style scoped>

</style>