<template>
  <div class="dashboard">
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <div class="stat-icon" :style="{ background: stat.bg }">{{ stat.icon }}</div>
        <div>
          <p class="stat-value">{{ stat.value }}</p>
          <p class="stat-label">{{ stat.label }}</p>
        </div>
        <span :class="['badge', stat.badgeClass]">{{ stat.change }}</span>
      </div>
    </div>

    <div class="content-grid">
      <div class="card">
        <div class="card-header">
          <h3>Recent Patients</h3>
          <RouterLink to="/patients" class="btn btn--ghost" style="font-size:13px;padding:6px 14px">View all</RouterLink>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Last Visit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in recentPatients" :key="p.id">
              <td>
                <div class="cell-name">
                  <div class="mini-avatar">{{ p.name[0] }}</div>
                  {{ p.name }}
                </div>
              </td>
              <td class="muted">{{ p.lastVisit }}</td>
              <td><span :class="['badge', p.badgeClass]">{{ p.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Workers on Duty</h3>
          <RouterLink to="/workers" class="btn btn--ghost" style="font-size:13px;padding:6px 14px">View all</RouterLink>
        </div>
        <div class="worker-list">
          <div class="worker-item" v-for="w in workers" :key="w.id">
            <div class="worker-avatar">{{ w.name[0] }}</div>
            <div class="worker-info">
              <p class="worker-name">{{ w.name }}</p>
              <p class="worker-role muted">{{ w.role }}</p>
            </div>
            <span :class="['badge', w.available ? 'badge--success' : 'badge--warn']">
              {{ w.available ? 'Available' : 'In session' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const stats = [
  { icon: '◎', label: 'Total Patients',   value: '1,284', change: '+12%', bg: '#4CB8C415', badgeClass: 'badge--success' },
  { icon: '◈', label: 'Active Workers',   value: '34',    change: '+2',   bg: '#3ECFA015', badgeClass: 'badge--success' },
  { icon: '⊡', label: 'Appointments Today', value: '57', change: '↑ 8',  bg: '#F4B94215', badgeClass: 'badge--warn'    },
  { icon: '◇', label: 'Monthly Revenue',  value: '$48.2k', change: '+5%', bg: '#E05C6B15', badgeClass: 'badge--accent'  },
]

const recentPatients = [
  { id: 1, name: 'Sofia Martínez', lastVisit: 'Today, 09:30', status: 'Active',   badgeClass: 'badge--success' },
  { id: 2, name: 'James Okafor',   lastVisit: 'Yesterday',    status: 'Follow-up', badgeClass: 'badge--warn'   },
  { id: 3, name: 'Mei Lin',        lastVisit: 'Feb 14',       status: 'Active',   badgeClass: 'badge--success' },
  { id: 4, name: 'Carlos Pereira', lastVisit: 'Feb 12',       status: 'Inactive', badgeClass: 'badge--danger'  },
]

const workers = [
  { id: 1, name: 'Dr. Amara Nwosu',  role: 'Orthodontist',   available: false },
  { id: 2, name: 'Dr. Lena Fischer', role: 'General Dentist', available: true  },
  { id: 3, name: 'Yuki Tanaka',      role: 'Hygienist',      available: true  },
]
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}

.stat-card {
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 22px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px; height: 48px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-size: 20px;
  flex-shrink: 0;
}
.stat-value {
  font-family: 'Cormorant Garamond', serif;
  font-size: 26px;
  font-weight: 600;
  color: var(--navy);
  line-height: 1;
  margin-bottom: 3px;
}
.stat-label { font-size: 12px; color: var(--muted); }
.stat-card .badge { margin-left: auto; flex-shrink: 0; }

.content-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.card-header h3 {
  font-size: 18px;
  font-weight: 500;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}
.data-table th {
  text-align: left;
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--muted);
  padding: 0 0 12px;
  border-bottom: 1px solid #E8EDF3;
}
.data-table td {
  padding: 14px 0;
  font-size: 14px;
  border-bottom: 1px solid #E8EDF330;
}
.cell-name {
  display: flex;
  align-items: center;
  gap: 10px;
}
.mini-avatar {
  width: 30px; height: 30px;
  border-radius: 50%;
  background: var(--accent-glow);
  color: var(--accent);
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 600;
}
.muted { color: var(--muted); font-size: 13px; }

.worker-list { display: flex; flex-direction: column; gap: 16px; }
.worker-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
.worker-avatar {
  width: 38px; height: 38px;
  border-radius: 50%;
  background: var(--navy);
  color: var(--accent);
  display: grid;
  place-items: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}
.worker-name { font-size: 14px; font-weight: 500; }
.worker-role { font-size: 12px; }
.worker-item .badge { margin-left: auto; }
</style>