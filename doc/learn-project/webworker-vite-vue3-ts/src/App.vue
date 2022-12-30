<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/">worker</RouterLink>
    <RouterLink to="/about">worker dynamic</RouterLink>
  </nav>
  <RouterView/>
</template>

<style scoped>
nav {
  font-size: 24px;
}

nav a {
  padding: 0 1rem;
  color: gray;
}

nav a.router-link-active {
  color: blue;
  background-color: lightblue;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a:first-of-type {
  border: 0;
}
</style>
