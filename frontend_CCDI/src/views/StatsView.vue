<template>
  <div class="stats-page">

    <div class="page-header">
      <div>
        <h1>Statistics</h1>
        <p class="page-sub">Overview of clinic performance</p>
      </div>
      <BaseSelect v-model="period" :options="periodOptions" style="min-width:160px" />
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card" v-for="k in kpis" :key="k.label">
        <div class="kpi-top">
          <span class="kpi-icon" :style="{ color: k.color }">{{ k.icon }}</span>
          <span :class="['badge', k.up ? 'badge--success' : 'badge--danger']">
            {{ k.up ? '↑' : '↓' }} {{ k.change }}
          </span>
        </div>
        <p class="kpi-value">{{ k.value }}</p>
        <p class="kpi-label">{{ k.label }}</p>
      </div>
    </div>

    <!-- Charts row -->
    <div class="charts-row">
      <div class="card chart-card">
        <h3>Patients by Month</h3>
        <div class="bar-chart">
          <div
            class="bar-col"
            v-for="(m, i) in monthlyData"
            :key="m.month"
          >
            <div class="bar-fill" :style="{ height: barHeight(m.value) + '%', animationDelay: i * 0.06 + 's' }">
              <span class="bar-tooltip">{{ m.value }}</span>
            </div>
            <span class="bar-label">{{ m.month }}</span>
          </div>
        </div>
      </div>

      <div class="card chart-card chart-card--sm">
        <h3>Patient Status</h3>
        <div class="donut-wrap">
          <svg viewBox="0 0 120 120" class="donut">
            <circle
              v-for="(seg, i) in donutSegments" :key="i"
              cx="60" cy="60" r="48"
              fill="none"
              :stroke="seg.color"
              stroke-width="16"
              :stroke-dasharray="seg.dash"
              :stroke-dashoffset="seg.offset"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div class="donut-legend">
            <div class="legend-item" v-for="s in statusSplit" :key="s.label">
              <span class="legend-dot" :style="{ background: s.color }"></span>
              <span>{{ s.label }}</span>
              <span class="legend-val">{{ s.pct }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Specialty breakdown -->
    <div class="card">
      <h3>Workers by Specialty</h3>
      <div class="specialty-bars" style="margin-top:20px">
        <div class="spec-row" v-for="s in specialtyData" :key="s.role">
          <span class="spec-label">{{ s.role }}</span>
          <div class="spec-track">
            <div class="spec-fill" :style="{ width: s.pct + '%', background: s.color }"></div>
          </div>
          <span class="spec-count">{{ s.count }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import { statsService } from '@/services/api.js'

const period = ref('month')
const statsData = ref(null)

const periodOptions = [
  { value: 'week',  label: 'This week' },
  { value: 'month', label: 'This month' },
  { value: 'year',  label: 'This year' },
]

const kpis = ref([
  { icon: '◎', label: 'Total Patients',    value: '—', change: '—', up: true,  color: 'var(--accent)'  },
  { icon: '◈', label: 'Active Workers',    value: '—', change: '—', up: true,  color: 'var(--success)' },
  { icon: '⊡', label: 'Appointments',      value: '—', change: '—', up: true,  color: 'var(--warn)'    },
  { icon: '◇', label: 'Monthly Revenue',   value: '—', change: '—', up: true,  color: '#A78BFA'        },
])

// Static demo data — replace with real API data
const monthlyData = [
  { month: 'Aug', value: 42 }, { month: 'Sep', value: 58 }, { month: 'Oct', value: 51 },
  { month: 'Nov', value: 67 }, { month: 'Dec', value: 44 }, { month: 'Jan', value: 72 },
  { month: 'Feb', value: 89 },
]

const statusSplit = [
  { label: 'Active',    pct: 62, color: 'var(--success)' },
  { label: 'Follow-up', pct: 24, color: 'var(--warn)'    },
  { label: 'Inactive',  pct: 14, color: '#D5DDE8'        },
]

const specialtyData = [
  { role: 'General Dentist', count: 8,  pct: 80, color: 'var(--accent)'  },
  { role: 'Orthodontist',    count: 5,  pct: 50, color: 'var(--success)' },
  { role: 'Hygienist',       count: 10, pct: 100,color: 'var(--warn)'    },
  { role: 'Oral Surgeon',    count: 3,  pct: 30, color: '#A78BFA'        },
  { role: 'Assistant',       count: 8,  pct: 80, color: '#F97316'        },
]

const maxBar = computed(() => Math.max(...monthlyData.map(m => m.value)))
function barHeight(v) { return Math.round((v / maxBar.value) * 100) }

// SVG donut
const circumference = 2 * Math.PI * 48 // ≈ 301.6
const donutSegments = computed(() => {
  let offset = 0
  return statusSplit.map(s => {
    const dash = (s.pct / 100) * circumference
    const gap  = circumference - dash
    const seg  = { color: s.color, dash: `${dash} ${gap}`, offset: -offset }
    offset += dash
    return seg
  })
})

async function loadStats() {
  try {
    const res = await statsService.get()
    const d = res.data
    kpis.value[0].value  = d.total_patients  ?? '—'
    kpis.value[0].change = d.patients_change ?? '—'
    kpis.value[1].value  = d.active_workers  ?? '—'
    kpis.value[2].value  = d.appointments    ?? '—'
    kpis.value[3].value  = d.revenue ? `$${d.revenue}` : '—'
  } catch (e) { console.error(e) }
}

onMounted(loadStats)
</script>

<style scoped>
.stats-page { display: flex; flex-direction: column; gap: 24px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; }
.page-header h1 { font-size: 28px; font-weight: 600; }
.page-sub { font-size: 13px; color: var(--muted); margin-top: 4px; }

.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.kpi-card {
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 22px;
}
.kpi-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.kpi-icon { font-size: 20px; }
.kpi-value { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 600; color: var(--navy); }
.kpi-label { font-size: 12px; color: var(--muted); margin-top: 4px; }

.charts-row { display: grid; grid-template-columns: 1.6fr 1fr; gap: 20px; }
.chart-card h3 { font-size: 16px; font-weight: 500; margin-bottom: 24px; }

/* Bar chart */
.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 160px;
}
.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  height: 100%;
  justify-content: flex-end;
}
.bar-fill {
  width: 100%;
  background: var(--accent);
  border-radius: 6px 6px 0 0;
  position: relative;
  min-height: 4px;
  animation: growUp 0.5s ease both;
  transition: background var(--transition);
}
.bar-fill:hover { background: var(--navy); }
.bar-tooltip {
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--navy);
  color: #fff;
  font-size: 11px;
  padding: 3px 7px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
}
.bar-fill:hover .bar-tooltip { opacity: 1; }
.bar-label { font-size: 11px; color: var(--muted); }

@keyframes growUp { from { height: 0 !important; } }

/* Donut */
.donut-wrap { display: flex; flex-direction: column; align-items: center; gap: 20px; }
.donut { width: 140px; height: 140px; }
.donut-legend { width: 100%; display: flex; flex-direction: column; gap: 10px; }
.legend-item { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.legend-val { margin-left: auto; font-weight: 500; }

/* Specialty bars */
.specialty-bars { display: flex; flex-direction: column; gap: 14px; }
.spec-row { display: flex; align-items: center; gap: 16px; }
.spec-label { font-size: 13px; min-width: 140px; color: var(--navy); }
.spec-track { flex: 1; height: 8px; background: #E8EDF3; border-radius: 4px; overflow: hidden; }
.spec-fill { height: 100%; border-radius: 4px; transition: width 0.6s cubic-bezier(0.4,0,0.2,1); }
.spec-count { font-size: 13px; font-weight: 600; min-width: 24px; text-align: right; color: var(--navy); }
</style>