<template>
  <div class="detail-page" v-if="patient">

    <!-- Back + Header -->
    <div class="detail-header">
      <button class="btn btn--ghost back-btn" @click="$router.back()">← Back</button>
      <div class="patient-hero">
        <div class="hero-avatar" :style="{ background: avatarColor(patient.name) }">{{ initials(patient.name) }}</div>
        <div>
          <h1>{{ patient.name }}</h1>
          <div class="hero-meta">
            <span>{{ patient.email }}</span>
            <span class="dot">·</span>
            <span>{{ patient.phone }}</span>
            <span class="dot">·</span>
            <span :class="['badge', statusBadge(patient.status)]">{{ patient.status }}</span>
          </div>
        </div>
        <button class="btn btn--primary" style="margin-left:auto" @click="openEdit">Edit Patient</button>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button v-for="tab in tabs" :key="tab.key" :class="['tab', { active: activeTab === tab.key }]" @click="activeTab = tab.key">
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Tab: Overview -->
    <div v-if="activeTab === 'overview'" class="tab-content">
      <div class="overview-grid">
        <div class="card info-card">
          <h3>Personal Information</h3>
          <div class="info-rows">
            <div class="info-row"><span>Date of Birth</span><span>{{ formatDate(patient.date_of_birth) }}</span></div>
            <div class="info-row"><span>Nationality</span><span>{{ patient.nationality || '—' }}</span></div>
            <div class="info-row"><span>Blood Type</span><span>{{ patient.blood_type || '—' }}</span></div>
            <div class="info-row"><span>Address</span><span>{{ patient.address || '—' }}</span></div>
          </div>
        </div>
        <div class="card info-card">
          <h3>Quick Stats</h3>
          <div class="quick-stats">
            <div class="qs" v-for="s in quickStats" :key="s.label">
              <p class="qs-value">{{ s.value }}</p>
              <p class="qs-label">{{ s.label }}</p>
            </div>
          </div>
        </div>
        <div class="card info-card span-2" v-if="patient.notes">
          <h3>Notes</h3>
          <p class="notes-text">{{ patient.notes }}</p>
        </div>
      </div>
    </div>

    <!-- Tab: Treatments -->
    <div v-if="activeTab === 'treatments'" class="tab-content">
      <div class="card table-card">
        <div class="section-header">
          <h3>Treatment History</h3>
          <button class="btn btn--primary" style="font-size:13px" @click="showTreatmentForm = true">+ Add Treatment</button>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Treatment</th><th>Tooth</th><th>Worker</th><th>Date</th><th>Cost</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!treatments.length">
              <td colspan="6" class="empty-cell">No treatments recorded</td>
            </tr>
            <tr v-for="t in treatments" :key="t.id" class="data-row">
              <td><strong>{{ t.treatment_type }}</strong></td>
              <td>{{ t.tooth_number || '—' }}</td>
              <td>{{ t.worker_name || '—' }}</td>
              <td>{{ formatDate(t.date) }}</td>
              <td>{{ t.cost ? `$${t.cost}` : '—' }}</td>
              <td><span :class="['badge', t.status === 'Completed' ? 'badge--success' : 'badge--warn']">{{ t.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tab: Appointments -->
    <div v-if="activeTab === 'appointments'" class="tab-content">
      <div class="card table-card">
        <div class="section-header">
          <h3>Appointments</h3>
          <button class="btn btn--primary" style="font-size:13px" @click="showAppointmentForm = true">+ Book Appointment</button>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>Date & Time</th><th>Worker</th><th>Reason</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr v-if="!appointments.length"><td colspan="4" class="empty-cell">No appointments found</td></tr>
            <tr v-for="a in appointments" :key="a.id" class="data-row">
              <td>{{ formatDateTime(a.datetime) }}</td>
              <td>{{ a.worker_name || '—' }}</td>
              <td>{{ a.reason || '—' }}</td>
              <td><span :class="['badge', apptBadge(a.status)]">{{ a.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tab: Documents -->
    <div v-if="activeTab === 'documents'" class="tab-content">
      <div class="card">
        <div class="section-header">
          <h3>Documents & X-Rays</h3>
          <label class="btn btn--primary" style="font-size:13px;cursor:pointer">
            + Upload
            <input type="file" style="display:none" @change="uploadDocument" multiple />
          </label>
        </div>
        <div v-if="!documents.length" class="empty-docs">
          <p style="color:var(--muted)">No documents uploaded yet</p>
        </div>
        <div class="docs-grid" v-else>
          <div class="doc-card" v-for="d in documents" :key="d.id">
            <div class="doc-icon">📄</div>
            <p class="doc-name">{{ d.name }}</p>
            <p class="doc-date">{{ formatDate(d.uploaded_at) }}</p>
            <a :href="d.file_url" target="_blank" class="btn btn--ghost" style="font-size:12px;padding:4px 10px">View</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <BaseModal v-model="showEditForm" title="Edit Patient" width="680px">
      <form class="form-grid" @submit.prevent="saveEdit">
        <BaseInput v-model="editForm.first_name" label="First Name" required />
        <BaseInput v-model="editForm.last_name"  label="Last Name"  required />
        <BaseInput v-model="editForm.email"      label="Email"      type="email" icon="@" />
        <BaseInput v-model="editForm.phone"      label="Phone"      icon="☏" />
        <BaseInput v-model="editForm.date_of_birth" label="Date of Birth" type="date" />
        <BaseInput v-model="editForm.nationality" label="Nationality" />
        <BaseSelect v-model="editForm.status" label="Status" :options="statusOptions" />
        <BaseSelect v-model="editForm.blood_type" label="Blood Type" :options="bloodTypes" />
        <BaseInput v-model="editForm.address" label="Address" class="span-2" />
        <BaseInput v-model="editForm.notes" label="Notes" type="textarea" class="span-2" />
      </form>
      <template #footer>
        <button class="btn btn--ghost" @click="showEditForm = false">Cancel</button>
        <button class="btn btn--primary" @click="saveEdit">Save Changes</button>
      </template>
    </BaseModal>

  </div>

  <div v-else-if="loading" class="loading-full">
    <div class="spinner-lg"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import BaseModal  from '@/components/ui/BaseModal.vue'
import BaseInput  from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import { patientService } from '@/Services/Api.js'

const route = useRoute()
const patient      = ref(null)
const loading      = ref(false)
const treatments   = ref([])
const appointments = ref([])
const documents    = ref([])
const activeTab    = ref('overview')
const showEditForm = ref(false)
const showTreatmentForm  = ref(false)
const showAppointmentForm = ref(false)
const editForm = ref({})

const tabs = [
  { key: 'overview',     label: 'Overview' },
  { key: 'treatments',   label: 'Treatments' },
  { key: 'appointments', label: 'Appointments' },
  { key: 'documents',    label: 'Documents' },
]

const statusOptions = [
  { value: 'Active',    label: 'Active' },
  { value: 'Inactive',  label: 'Inactive' },
  { value: 'Follow-up', label: 'Follow-up' },
]
const bloodTypes = ['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(v => ({ value: v, label: v }))

const quickStats = computed(() => [
  { value: treatments.value.length,   label: 'Treatments' },
  { value: appointments.value.length, label: 'Appointments' },
  { value: documents.value.length,    label: 'Documents' },
  { value: patient.value?.blood_type || '—', label: 'Blood Type' },
])

async function load() {
  loading.value = true
  try {
    const res = await patientService.getById(route.params.id)
    patient.value = { ...res.data, name: `${res.data.first_name} ${res.data.last_name}` }
    // Load sub-resources if your API supports them
    // treatments.value   = (await api.get(`patients/${route.params.id}/treatments/`)).data
    // appointments.value = (await api.get(`patients/${route.params.id}/appointments/`)).data
    // documents.value    = (await api.get(`patients/${route.params.id}/documents/`)).data
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

function openEdit() {
  editForm.value = { ...patient.value }
  showEditForm.value = true
}

async function saveEdit() {
  try {
    await patientService.update(patient.value.id, editForm.value)
    showEditForm.value = false
    await load()
  } catch (e) { console.error(e) }
}

async function uploadDocument(e) {
  const files = e.target.files
  if (!files.length) return
  // Implement file upload to your API here
  console.log('Uploading:', files)
}

function initials(name = '') { return name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() }
const colors = ['#4CB8C4','#3ECFA0','#F4B942','#E05C6B','#A78BFA','#F97316']
function avatarColor(name = '') { return colors[name.charCodeAt(0) % colors.length] }
function statusBadge(s) { return { Active: 'badge--success', Inactive: 'badge--danger', 'Follow-up': 'badge--warn' }[s] || 'badge--accent' }
function apptBadge(s)   { return { Confirmed: 'badge--success', Pending: 'badge--warn', Cancelled: 'badge--danger' }[s] || 'badge--accent' }
function formatDate(d)  { return d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—' }
function formatDateTime(d) { return d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—' }

onMounted(load)
</script>

<style scoped>
.detail-page { display: flex; flex-direction: column; gap: 24px; }

.back-btn { font-size: 13px; padding: 7px 14px; width: fit-content; }

.patient-hero {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
.hero-avatar {
  width: 64px; height: 64px;
  border-radius: 50%;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.patient-hero h1 { font-size: 24px; font-weight: 600; }
.hero-meta { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--muted); margin-top: 4px; flex-wrap: wrap; }
.dot { color: #D5DDE8; }

.tabs { display: flex; gap: 4px; border-bottom: 2px solid #E8EDF3; padding: 0; }
.tab {
  padding: 12px 20px;
  background: none;
  border: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: var(--transition);
}
.tab.active { color: var(--accent); border-bottom-color: var(--accent); }
.tab:hover:not(.active) { color: var(--navy); }

.tab-content { animation: fadeIn 0.2s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

.overview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.span-2 { grid-column: span 2; }

.info-card h3 { font-size: 16px; font-weight: 500; margin-bottom: 16px; }
.info-rows { display: flex; flex-direction: column; gap: 12px; }
.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid #E8EDF330;
}
.info-row span:first-child { color: var(--muted); }
.info-row span:last-child  { font-weight: 500; }

.quick-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 4px; }
.qs { text-align: center; padding: 16px; background: var(--ivory); border-radius: 8px; }
.qs-value { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 600; color: var(--navy); }
.qs-label { font-size: 12px; color: var(--muted); margin-top: 4px; }

.notes-text { font-size: 14px; color: var(--navy); line-height: 1.6; }

.table-card  { padding: 0; overflow: hidden; }
.section-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px; border-bottom: 1px solid #E8EDF3;
}
.section-header h3 { font-size: 16px; font-weight: 500; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th {
  text-align: left; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
  color: var(--muted); padding: 12px 16px; border-bottom: 1px solid #E8EDF3;
}
.data-table td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid #E8EDF308; }
.data-row { transition: background var(--transition); }
.data-row:hover { background: #F7F4EF88; }
.empty-cell { text-align: center; padding: 48px; color: var(--muted); }

.empty-docs { padding: 48px; text-align: center; }
.docs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; padding-top: 16px; }
.doc-card {
  border: 1.5px solid #E8EDF3;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  transition: var(--transition);
}
.doc-card:hover { border-color: var(--accent); }
.doc-icon { font-size: 32px; }
.doc-name { font-size: 13px; font-weight: 500; word-break: break-all; }
.doc-date { font-size: 11px; color: var(--muted); }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-grid .span-2 { grid-column: span 2; }

.loading-full { display: grid; place-items: center; min-height: 300px; }
.spinner-lg {
  width: 40px; height: 40px;
  border: 3px solid #E8EDF3;
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>