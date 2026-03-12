<template>
  <div class="patients-page">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Patients</h1>
        <p class="page-sub">{{ patients.length }} patients registered</p>
      </div>
      <button class="btn btn--primary" @click="openCreate">+ New Patient</button>
    </div>

    <!-- Table -->
    <div class="card table-card">
      <DataTable
        :columns="columns"
        :rows="patients"
        :loading="loading"
        entity="patients"
        @row-click="openDetail"
      >
        <template #actions>
          <BaseSelect v-model="statusFilter" :options="statusOptions" placeholder="All statuses" style="min-width:160px" />
        </template>

        <template #cell-name="{ row }">
          <div class="cell-name">
            <div class="avatar" :style="{ background: avatarColor(row.name) }">{{ initials(row.name) }}</div>
            <div>
              <p class="name-primary">{{ row.name }}</p>
              <p class="name-secondary">{{ row.email }}</p>
            </div>
          </div>
        </template>

        <template #cell-status="{ row }">
          <span :class="['badge', statusBadge(row.status)]">{{ row.status }}</span>
        </template>

        <template #cell-next_appointment="{ row }">
          <span :class="row.next_appointment ? '' : 'muted'">
            {{ row.next_appointment ? formatDate(row.next_appointment) : 'None scheduled' }}
          </span>
        </template>

        <template #rowActions="{ row }">
          <div class="row-actions">
            <button class="icon-btn" title="View" @click="openDetail(row)">👁</button>
            <button class="icon-btn" title="Edit" @click="openEdit(row)">✏️</button>
            <button class="icon-btn icon-btn--danger" title="Delete" @click="confirmDelete(row)">🗑</button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Create / Edit Modal -->
    <BaseModal v-model="showForm" :title="editingPatient ? 'Edit Patient' : 'New Patient'" width="680px">
      <form class="form-grid" @submit.prevent="savePatient">
        <BaseInput v-model="form.first_name" label="First Name" placeholder="Sofia" required />
        <BaseInput v-model="form.last_name"  label="Last Name"  placeholder="Martínez" required />
        <BaseInput v-model="form.email"      label="Email"      type="email" placeholder="sofia@example.com" icon="@" />
        <BaseInput v-model="form.phone"      label="Phone"      placeholder="+1 555 0000" icon="☏" />
        <BaseInput v-model="form.date_of_birth" label="Date of Birth" type="date" />
        <BaseInput v-model="form.nationality" label="Nationality" placeholder="Mexican" />
        <BaseSelect v-model="form.status" label="Status" :options="statusOptions.slice(1)" required />
        <BaseSelect v-model="form.blood_type" label="Blood Type" :options="bloodTypes" />
        <BaseInput v-model="form.address" label="Address" placeholder="123 Main St" class="span-2" />
        <BaseInput v-model="form.notes" label="Notes" type="textarea" placeholder="Additional notes…" class="span-2" />
      </form>
      <template #footer>
        <button type="button" class="btn btn--ghost" @click="showForm = false">Cancel</button>
        <button type="button" class="btn btn--primary" :disabled="saving" @click="savePatient">
          {{ saving ? 'Saving…' : (editingPatient ? 'Save Changes' : 'Create Patient') }}
        </button>
      </template>
    </BaseModal>

    <!-- Delete Confirm Modal -->
    <BaseModal v-model="showDelete" title="Delete Patient" width="420px">
      <p style="color:var(--muted)">Are you sure you want to delete <strong style="color:var(--navy)">{{ deletingPatient?.name }}</strong>? This action cannot be undone.</p>
      <template #footer>
        <button class="btn btn--ghost" @click="showDelete = false">Cancel</button>
        <button class="btn" style="background:var(--danger);color:#fff" @click="deletePatient">Delete</button>
      </template>
    </BaseModal>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from '@/components/ui/DataTable.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import { patientService } from '@/Services/Api.js'

const router = useRouter()
const patients     = ref([])
const loading      = ref(false)
const saving       = ref(false)
const showForm     = ref(false)
const showDelete   = ref(false)
const editingPatient  = ref(null)
const deletingPatient = ref(null)
const statusFilter = ref('')

const emptyForm = () => ({
  first_name: '', last_name: '', email: '', phone: '',
  date_of_birth: '', nationality: '', status: 'Active',
  blood_type: '', address: '', notes: '',
})
const form = ref(emptyForm())

const columns = [
  { key: 'name',             label: 'Patient' },
  { key: 'phone',            label: 'Phone' },
  { key: 'date_of_birth',    label: 'DOB' },
  { key: 'status',           label: 'Status' },
  { key: 'next_appointment', label: 'Next Appointment' },
]

const statusOptions = [
  { value: '',         label: 'All statuses' },
  { value: 'Active',   label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Follow-up',label: 'Follow-up' },
]

const bloodTypes = ['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(v => ({ value: v, label: v }))

async function loadPatients() {
  loading.value = true
  try {
    const params = statusFilter.value ? { status: statusFilter.value } : {}
    const res = await patientService.getAll(params)
    // Normalize: add computed 'name' field
    patients.value = res.data.map(p => ({
      ...p,
      name: `${p.first_name} ${p.last_name}`,
    }))
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingPatient.value = null
  form.value = emptyForm()
  showForm.value = true
}

function openEdit(patient) {
  editingPatient.value = patient
  form.value = { ...patient }
  showForm.value = true
}

function openDetail(patient) {
  router.push(`/patients/${patient.id}`)
}

function confirmDelete(patient) {
  deletingPatient.value = patient
  showDelete.value = true
}

async function savePatient() {
  saving.value = true
  try {
    if (editingPatient.value) {
      await patientService.update(editingPatient.value.id, form.value)
    } else {
      await patientService.create(form.value)
    }
    showForm.value = false
    await loadPatients()
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}

async function deletePatient() {
  try {
    await patientService.remove(deletingPatient.value.id)
    showDelete.value = false
    await loadPatients()
  } catch (e) { console.error(e) }
}

function initials(name = '') {
  return name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()
}
const colors = ['#4CB8C4','#3ECFA0','#F4B942','#E05C6B','#A78BFA','#F97316']
function avatarColor(name = '') {
  return colors[name.charCodeAt(0) % colors.length]
}
function statusBadge(s) {
  return { Active: 'badge--success', Inactive: 'badge--danger', 'Follow-up': 'badge--warn' }[s] || 'badge--accent'
}
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(loadPatients)
</script>

<style scoped>
.patients-page { display: flex; flex-direction: column; gap: 24px; }

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.page-header h1 {
  font-size: 28px;
  font-weight: 600;
}
.page-sub { font-size: 13px; color: var(--muted); margin-top: 4px; }

.table-card { padding: 0; overflow: hidden; }

.cell-name { display: flex; align-items: center; gap: 12px; }
.avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  color: var(--white);
  font-size: 12px;
  font-weight: 700;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.name-primary  { font-size: 14px; font-weight: 500; }
.name-secondary { font-size: 12px; color: var(--muted); }
.muted { color: var(--muted); font-size: 13px; }

.row-actions { display: flex; gap: 4px; }
.icon-btn {
  width: 30px; height: 30px;
  border: none; background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: grid;
  place-items: center;
  transition: var(--transition);
}
.icon-btn:hover { background: var(--ivory); }
.icon-btn--danger:hover { background: #E05C6B15; }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.form-grid .span-2 { grid-column: span 2; }
</style>