<template>
  <header class="topbar">
    <div class="topbar__left">
      <h2 class="page-title">{{ title }}</h2>
    </div>
    <div class="topbar__right">
      <div class="search-box">
        <span class="search-icon">⌕</span>
        <input type="text" placeholder="Search patients, workers…" />
      </div>
      <button class="notif-btn">
        <span>🔔</span>
        <span class="notif-dot"></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const titles = {
  '/':         'Dashboard',
  '/patients': 'Patients',
  '/workers':  'Workers',
  '/stats':    'Statistics',
  '/settings': 'Settings',
}
const title = computed(() => titles[route.path] || 'DentalCore')
</script>

<style scoped>
.topbar {
  position: fixed;
  top: 0;
  left: var(--sidebar-w);
  right: 0;
  height: var(--topbar-h);
  background: var(--white);
  border-bottom: 1px solid #E8EDF3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  z-index: 90;
}

.page-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 600;
  color: var(--navy);
}

.topbar__right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--ivory);
  border: 1.5px solid #E8EDF3;
  border-radius: 8px;
  padding: 8px 14px;
  transition: var(--transition);
}
.search-box:focus-within {
  border-color: var(--accent);
  background: var(--white);
}
.search-icon { font-size: 16px; color: var(--muted); }
.search-box input {
  border: none;
  background: transparent;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: var(--navy);
  outline: none;
  width: 220px;
}
.search-box input::placeholder { color: var(--muted); }

.notif-btn {
  position: relative;
  background: var(--ivory);
  border: 1.5px solid #E8EDF3;
  border-radius: 8px;
  width: 40px; height: 40px;
  cursor: pointer;
  font-size: 16px;
  display: grid;
  place-items: center;
  transition: var(--transition);
}
.notif-btn:hover { border-color: var(--accent); }
.notif-dot {
  position: absolute;
  top: 8px; right: 8px;
  width: 7px; height: 7px;
  background: var(--danger);
  border-radius: 50%;
  border: 1.5px solid var(--white);
}
</style>