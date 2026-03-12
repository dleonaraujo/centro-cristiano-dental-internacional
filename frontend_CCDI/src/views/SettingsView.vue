<template>
  <div class="settings-page">
    <div class="page-header">
      <h1>Settings</h1>
      <p class="page-sub">Configure your DentalCore system</p>
    </div>

    <div class="settings-layout">

      <!-- Sidebar nav -->
      <div class="settings-nav card">
        <button
          v-for="s in sections" :key="s.key"
          :class="['settings-nav-item', { active: activeSection === s.key }]"
          @click="activeSection = s.key"
        >
          <span>{{ s.icon }}</span>
          {{ s.label }}
        </button>
      </div>

      <!-- Content -->
      <div class="settings-content">

        <!-- Clinic Info -->
        <div v-if="activeSection === 'clinic'" class="card settings-card">
          <h3>Clinic Information</h3>
          <p class="section-desc">Basic details about your dental center</p>
          <div class="form-grid" style="margin-top:24px">
            <BaseInput v-model="clinic.name"     label="Clinic Name"    placeholder="CCDI Dental Center" class="span-2" />
            <BaseInput v-model="clinic.address"  label="Address"        placeholder="123 Main St" class="span-2" />
            <BaseInput v-model="clinic.phone"    label="Phone"          icon="☏" />
            <BaseInput v-model="clinic.email"    label="Email"          type="email" icon="@" />
            <BaseInput v-model="clinic.website"  label="Website"        placeholder="https://…" />
            <BaseInput v-model="clinic.timezone" label="Timezone"       placeholder="America/Mexico_City" />
          </div>
          <div class="save-row">
            <button class="btn btn--primary" @click="saveClinic">Save Changes</button>
          </div>
        </div>

        <!-- Appearance -->
        <div v-if="activeSection === 'appearance'" class="card settings-card">
          <h3>Appearance</h3>
          <p class="section-desc">Customize how the system looks</p>
          <div class="appearance-options" style="margin-top:24px">
            <div class="option-row">
              <div>
                <p class="opt-label">Language</p>
                <p class="opt-hint">Interface language</p>
              </div>
              <BaseSelect v-model="appearance.language" :options="langOptions" style="min-width:160px" />
            </div>
            <div class="option-row">
              <div>
                <p class="opt-label">Date Format</p>
                <p class="opt-hint">How dates are displayed</p>
              </div>
              <BaseSelect v-model="appearance.dateFormat" :options="dateFormats" style="min-width:160px" />
            </div>
            <div class="option-row">
              <div>
                <p class="opt-label">Currency</p>
                <p class="opt-hint">Used in billing and stats</p>
              </div>
              <BaseSelect v-model="appearance.currency" :options="currencies" style="min-width:160px" />
            </div>
          </div>
          <div class="save-row">
            <button class="btn btn--primary" @click="saveAppearance">Save Changes</button>
          </div>
        </div>

        <!-- API -->
        <div v-if="activeSection === 'api'" class="card settings-card">
          <h3>API Configuration</h3>
          <p class="section-desc">Connection settings for the Django backend</p>
          <div class="form-grid" style="margin-top:24px">
            <BaseInput v-model="api.base_url" label="API Base URL" placeholder="http://localhost:8000/api/" class="span-2" />
            <BaseInput v-model="api.timeout"  label="Timeout (ms)" type="number" />
          </div>
          <div class="api-status" style="margin-top:20px">
            <div :class="['status-dot', apiOk ? 'status-dot--ok' : 'status-dot--err']"></div>
            <span>{{ apiOk ? 'Connected' : 'Not connected' }}</span>
            <button class="btn btn--ghost" style="font-size:12px;padding:5px 12px;margin-left:auto" @click="testApi">Test connection</button>
          </div>
          <div class="save-row">
            <button class="btn btn--primary" @click="saveApi">Save</button>
          </div>
        </div>

      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseInput  from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'

const activeSection = ref('clinic')
const toast = ref('')
const apiOk = ref(false)

const sections = [
  { key: 'clinic',     label: 'Clinic Info',  icon: '🏥' },
  { key: 'appearance', label: 'Appearance',   icon: '🎨' },
  { key: 'api',        label: 'API / Backend',icon: '⚙️' },
]

const clinic = ref({ name: '', address: '', phone: '', email: '', website: '', timezone: 'UTC' })
const appearance = ref({ language: 'en', dateFormat: 'MM/DD/YYYY', currency: 'USD' })
const api = ref({ base_url: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/', timeout: 5000 })

const langOptions    = [{ value: 'en', label: 'English' }, { value: 'es', label: 'Español' }]
const dateFormats    = [{ value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' }, { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' }]
const currencies     = [{ value: 'USD', label: 'USD ($)' }, { value: 'MXN', label: 'MXN ($)' }, { value: 'EUR', label: 'EUR (€)' }]

function showToast(msg) {
  toast.value = msg
  setTimeout(() => toast.value = '', 3000)
}

function saveClinic()     { showToast('Clinic settings saved') }
function saveAppearance() { showToast('Appearance settings saved') }
function saveApi()        { showToast('API settings saved') }

async function testApi() {
  try {
    const res = await fetch(api.value.base_url.replace(/\/$/, '') + '/')
    apiOk.value = res.ok
    showToast(res.ok ? '✓ Connection successful' : '✗ Connection failed')
  } catch { apiOk.value = false; showToast('✗ Could not reach API') }
}
</script>

<style scoped>
.settings-page { display: flex; flex-direction: column; gap: 24px; }
.page-header h1 { font-size: 28px; font-weight: 600; }
.page-sub { font-size: 13px; color: var(--muted); margin-top: 4px; }

.settings-layout { display: grid; grid-template-columns: 220px 1fr; gap: 24px; align-items: start; }

.settings-nav { padding: 12px; display: flex; flex-direction: column; gap: 2px; }
.settings-nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 8px;
  background: none; border: none;
  font-family: 'DM Sans', sans-serif; font-size: 14px;
  color: var(--muted); cursor: pointer;
  transition: var(--transition); text-align: left;
}
.settings-nav-item:hover { background: var(--ivory); color: var(--navy); }
.settings-nav-item.active { background: var(--accent-glow); color: var(--accent); font-weight: 500; }

.settings-card h3 { font-size: 18px; font-weight: 500; }
.section-desc { font-size: 13px; color: var(--muted); margin-top: 4px; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-grid .span-2 { grid-column: span 2; }
.save-row { display: flex; justify-content: flex-end; margin-top: 24px; border-top: 1px solid #E8EDF3; padding-top: 20px; }

.appearance-options { display: flex; flex-direction: column; gap: 0; }
.option-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #E8EDF330;
}
.opt-label { font-size: 14px; font-weight: 500; }
.opt-hint  { font-size: 12px; color: var(--muted); margin-top: 2px; }

.api-status { display: flex; align-items: center; gap: 8px; font-size: 14px; padding: 12px 16px; background: var(--ivory); border-radius: 8px; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; }
.status-dot--ok  { background: var(--success); box-shadow: 0 0 0 3px #3ECFA030; }
.status-dot--err { background: var(--muted); }

.toast {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
  background: var(--navy); color: var(--white);
  padding: 12px 24px; border-radius: 8px;
  font-size: 14px; font-weight: 500;
  box-shadow: 0 8px 32px rgba(13,27,42,0.2);
  z-index: 2000; pointer-events: none;
}
.toast-enter-active, .toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(12px); }
</style>