<script setup lang="ts">
import { navGroups } from '../configs/nav'
</script>

<template>
  <nav class="side-nav">
    <router-link to="/home" class="side-nav__home" active-class="side-nav__item--active">
      首页 Home
    </router-link>

    <div v-for="group in navGroups" :key="group.title" class="side-nav__group">
      <p class="side-nav__title">{{ group.title }}</p>
      <router-link
        v-for="item in group.items"
        :key="item.route"
        :to="{ name: item.route }"
        class="side-nav__item"
        active-class="side-nav__item--active"
      >
        {{ item.label }}
      </router-link>
    </div>
  </nav>
</template>

<style scoped>
.side-nav__home {
  display: block;
  padding: 8px 12px;
  margin-bottom: 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.side-nav__group {
  margin-bottom: 20px;
}

.side-nav__title {
  margin: 0 0 6px;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: rgba(31, 41, 51, 0.55);
}

.side-nav__item {
  display: block;
  padding: 8px 12px;
  margin: 2px 0;
  border-radius: 10px;
  font-size: 14px;
  color: #1f2933;
  text-decoration: none;
  transition: background 0.2s ease;
}

.side-nav__item:hover {
  background: rgba(255, 255, 255, 0.4);
}

.side-nav__item--active {
  background: rgba(255, 255, 255, 0.66);
  font-weight: 600;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.7);
}
</style>
