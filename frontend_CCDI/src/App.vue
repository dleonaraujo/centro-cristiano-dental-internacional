<template>
  <div id="app">
    <Sidebar />
    <div class="main-content">
      <Topbar />
      <main class="page-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/layout/Sidebar.vue'
import Topbar from '@/components/layout/Topbar.vue'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --navy:       #0D1B2A;
  --navy-mid:   #132338;
  --navy-light: #1C3250;
  --accent:     #4CB8C4;
  --accent-glow:#4CB8C433;
  --ivory:      #F7F4EF;
  --white:      #FFFFFF;
  --muted:      #8A9BB0;
  --danger:     #E05C6B;
  --success:    #3ECFA0;
  --warn:       #F4B942;
  --sidebar-w:  260px;
  --topbar-h:   64px;
  --radius:     12px;
  --shadow:     0 4px 24px rgba(13,27,42,0.12);
  --transition: 0.2s cubic-bezier(0.4,0,0.2,1);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--ivory);
  color: var(--navy);
  min-height: 100vh;
}

#app {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: var(--sidebar-w);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-content {
  flex: 1;
  padding: 32px;
  margin-top: var(--topbar-h);
}

/* Shared utility classes */
.card {
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 24px;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.3px;
}
.badge--success { background: #3ECFA018; color: var(--success); }
.badge--danger  { background: #E05C6B18; color: var(--danger);  }
.badge--warn    { background: #F4B94218; color: var(--warn);    }
.badge--accent  { background: var(--accent-glow); color: var(--accent); }

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: var(--transition);
}
.btn--primary {
  background: var(--accent);
  color: var(--navy);
}
.btn--primary:hover { background: #3aa8b4; transform: translateY(-1px); }
.btn--ghost {
  background: transparent;
  color: var(--navy);
  border: 1.5px solid #D5DDE8;
}
.btn--ghost:hover { border-color: var(--accent); color: var(--accent); }

h1, h2, h3, .display { font-family: 'Cormorant Garamond', serif; }
</style>