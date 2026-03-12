<template>
  <aside class="sidebar">
    <div class="sidebar__logo">
      <span class="logo-icon">✦</span>
      <div>
        <p class="logo-name">Centro Cristiano</p>
        <p class="logo-sub">Dental Internacional</p>
      </div>
    </div>

    <nav class="sidebar__nav">
      <p class="nav-group-label">Main</p>
      <RouterLink v-for="item in mainNav" :key="item.to" :to="item.to" class="nav-item">
        <span class="nav-icon" v-html="item.icon"></span>
        <span>{{ item.label }}</span>
      </RouterLink>

      <p class="nav-group-label">Management</p>
      <RouterLink v-for="item in mgmtNav" :key="item.to" :to="item.to" class="nav-item">
        <span class="nav-icon" v-html="item.icon"></span>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="sidebar__footer">
      <div class="user-avatar">A</div>
      <div>
        <p class="user-name">Admin</p>
        <p class="user-role">Administrator</p>
      </div>
    </div>
  </aside>
</template>

<script setup>
const mainNav = [
  { to: '/',         label: 'Dashboard',  icon: '⬡' },
  { to: '/patients', label: 'Patients',   icon: '◎' },
  { to: '/workers',  label: 'Workers',    icon: '◈' },
]
const mgmtNav = [
  { to: '/stats',    label: 'Statistics', icon: '◇' },
  { to: '/settings', label: 'Settings',   icon: '◉' },
]
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0; top: 0;
  width: var(--sidebar-w);
  height: 100vh;
  background: var(--navy);
  display: flex;
  flex-direction: column;
  padding: 28px 0;
  z-index: 100;
}

.sidebar__logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px 28px;
  border-bottom: 1px solid var(--navy-light);
}
.logo-icon {
  font-size: 22px;
  color: var(--accent);
  line-height: 1;
}
.logo-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px;
  font-weight: 600;
  color: var(--white);
  letter-spacing: 0.5px;
}
.logo-sub {
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.sidebar__nav {
  flex: 1;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-group-label {
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--muted);
  padding: 16px 8px 8px;
  font-weight: 500;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  color: #8A9BB0;
  text-decoration: none;
  font-size: 14px;
  font-weight: 400;
  transition: var(--transition);
}
.nav-item:hover {
  background: var(--navy-light);
  color: var(--white);
}
.nav-item.router-link-active {
  background: var(--accent-glow);
  color: var(--accent);
  font-weight: 500;
}
.nav-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
  opacity: 0.8;
}

.sidebar__footer {
  padding: 20px 24px 0;
  border-top: 1px solid var(--navy-light);
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
}
.user-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--navy);
  display: grid;
  place-items: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}
.user-name  { font-size: 13px; font-weight: 500; color: var(--white); }
.user-role  { font-size: 11px; color: var(--muted); }
</style>