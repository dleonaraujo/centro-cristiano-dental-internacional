<template>
  <div class="workers-page">

    <div class="page-header">
      <div>
        <h1>Workers</h1>
        <p class="page-sub">{{ workers.length }} staff members registered</p>
      </div>
      <button class="btn btn--primary" @click="openCreate">+ New Worker</button>
    </div>

    <div class="card table-card">
      <DataTable
        :columns="columns"
        :rows="workers"
        :loading="loading"
        entity="workers"
        @row-click="openDetail"
      >
        <template #actions>
          <BaseSelect v-model="roleFilter" :options="roleOptions" placeholder="All roles" style="min-width:160px" />
        </template>

        <template #cell-name="{ row }">
          <div class="cell-name">
            <div class="avatar navy-av">{{ initials(row.name) }}</div>
            <div>
              <p class="name-primary">{{ row.name }}</p>
              <p class="name-secondary">{{ row.email }}</p>
            </div>
          </div>
        </template>

        <template #cell-available="{ row }">
          <span :class="['badge', row.available ? 'badge--success' : 'badge--warn']">
            {{ row.available ? 'Available' : 'In session' }}
          </span>
        </template>

        <template #cell-schedule="{ row }">
          <span class="muted">{{ row.schedule || 'Not set' }}</span>
        </template>

        <template #rowActions="{ row }">
          <div class="row-actions">
            <button class="icon-btn" title="Edit"   @click="openEdit(row)">✏️</button>
            <button class="icon-btn icon-btn--danger" title="Delete" @click="confirmDelete(row)">🗑</button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Create / Edit Modal -->
    <BaseModal v-model="showForm" :title="editingWorker ? 'Edit Worker' : 'New Worker'" width="680px">
      <form class="form-grid" @submit.prevent="saveWorker">
        <BaseInput v-model="form.first_name" label="First Name" required />
        <BaseInput v-model="form.last_name"  label="Last Name"  required />
        <BaseInput v-model="form.email"      label="Email" type="email" icon="@" />
        <BaseInput v-model="form.phone"      label="Phone" icon="☏" />
        <BaseSelect v-model="form.role"      label="Role" :options="specialtyOptions" required />
        <BaseInput v-model="form.license_number" label="License Number" />
        <BaseSelect v-model="form.available" label="Availability" :options="availOptions" />
        <BaseInput v-model="form.schedule"   label="Schedule" placeholder="Mon–Fri 8am–5pm" />
        <BaseInput v-model="form.start_time" label="Shift Start" type="time" />
        <BaseInput v-model="form.end_time"   label="Shift End"   type="time" />
        <BaseInput v-model="form.notes"      label="Notes" type="textarea" class="span-2" />
      </form>
      <template #footer>
        <button class="btn btn--ghost" @click="showForm = false">Cancel</button>
        <button class="btn btn--primary" :disabled="saving" @click="saveWorker">
          {{ saving ? 'Saving…' : (editingWorker ? 'Save Changes' : 'Create Worker') }}
        </button>
      </template>
    </BaseModal>

    <!-- Delete Confirm -->
    <BaseModal v-model="showDelete" title="Remove Worker" width="420px">
      <p style="color:var(--muted)">Are you sure you want to remove <strong style="color:var(--navy)">{{ deletingWorker?.name }}</strong>?</p>
      <template #footer>
        <button class="btn btn--ghost" @click="showDelete = false">Cancel</button>
        <button class="btn" style="background:var(--danger);color:#fff" @click="deleteWorker">Remove</button>
      </template>
    </BaseModal>

    <!-- Worker Detail Side Panel -->
    <Teleport to="body">
      <Transition name="slide">
        <div v-if="selectedWorker" class="side-panel">
          <div class="side-header">
            <h3>{{ selectedWorker.name }}</h3>
            <button class="modal-close" @click="selectedWorker = null">✕</button>
          </div>
          <div class="side-body">
            <div class="worker-profile">
              <div class="big-avatar">{{ initials(selectedWorker.name) }}</div>
              <p class="worker-role-tag">{{ selectedWorker.role }}</p>
              <span :class="['badge', selectedWorker.available ? 'badge--success' : 'badge--warn']" style="margin-top:4px">
                {{ selectedWorker.available ? 'Available' : 'In session' }}
              </span>
            </div>
            <div class="info-rows" style="margin-top:24px">
              <div class="info-row"><span>Email</span><span>{{ selectedWorker.email || '—' }}</span></div>
              <div class="info-row"><span>Phone</span><span>{{ selectedWorker.phone || '—' }}</span></div>
              <div class="info-row"><span>License</span><span>{{ selectedWorker.license_number || '—' }}</span></div>
              <div class="info-row"><span>Schedule</span><span>{{ selectedWorker.schedule || '—' }}</span></div>
              <div class="info-row"><span>Shift</span><span>{{ selectedWorker.start_time || '—' }} – {{ selectedWorker.end_time || '—' }}</span></div>
            </div>
            <div v-if="selectedWorker.notes" style="margin-top:20px">
              <p style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-bottom:8px">Notes</p>
              <p style="font-size:14px;line-height:1.6">{{ selectedWorker.notes }}</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    <div v-if="selectedWorker" class="overlay" @click="selectedWorker = null"></div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataTable  from '@/components/ui/DataTable.vue'
import BaseModal  from '@/components/ui/BaseModal.vue'
import BaseInput  from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import { workerService } from '@/Services/Api.js'

const workers      = ref([])
const loading      = ref(false)
const saving       = ref(false)
const showForm     = ref(false)
const showDelete   = ref(false)
const editingWorker  = ref(null)
const deletingWorker = ref(null)
const selectedWorker = ref(null)
const roleFilter     = ref('')

const emptyForm = () => ({
  first_name: '', last_name: '', email: '', phone: '',
  role: '', license_number: '', available: true,
  schedule: '', start_time: '', end_time: '', notes: '',
})
const form = ref(emptyForm())

const columns = [
  { key: 'name',      label: 'Worker' },
  { key: 'role',      label: 'Specialty' },
  { key: 'phone',     label: 'Phone' },
  { key: 'schedule',  label: 'Schedule' },
  { key: 'available', label: 'Status' },
]

const roleOptions = [
  { value: '',                  label: 'All roles' },
  { value: 'General Dentist',   label: 'General Dentist' },
  { value: 'Orthodontist',      label: 'Orthodontist' },
  { value: 'Endodontist',       label: 'Endodontist' },
  { value: 'Periodontist',      label: 'Periodontist' },
  { value: 'Oral Surgeon',      label: 'Oral Surgeon' },
  { value: 'Prosthodontist',    label: 'Prosthodontist' },
  { value: 'Hygienist',         label: 'Hygienist' },
  { value: 'Receptionist',      label: 'Receptionist' },
  { value: 'Assistant',         label: 'Assistant' },
]

const specialtyOptions = roleOptions.slice(1)

const availOptions = [
  { value: true,  label: 'Available' },
  { value: false, label: 'In session' },
]

async function loadWorkers() {
  loading.value = true
  try {
    const params = roleFilter.value ? { role: roleFilter.value } : {}
    const res = await workerService.getAll(params)
    workers.value = res.data.map(w => ({
      ...w,
      name: `${w.first_name} ${w.last_name}`,
    }))
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

function openCreate() {
  editingWorker.value = null
  form.value = emptyForm()
  showForm.value = true
}

function openEdit(worker) {
  editingWorker.value = worker
  form.value = { ...worker }
  showForm.value = true
}

function openDetail(worker) {
  selectedWorker.value = worker
}

function confirmDelete(worker) {
  deletingWorker.value = worker
  showDelete.value = true
}

async function saveWorker() {
  saving.value = true
  try {
    if (editingWorker.value) {
      await workerService.update(editingWorker.value.id, form.value)
    } else {
      await workerService.create(form.value)
    }
    showForm.value = false
    await loadWorkers()
  } catch (e) { console.error(e) }
  finally { saving.value = false }
}

async function deleteWorker() {
  try {
    await workerService.remove(deletingWorker.value.id)
    showDelete.value = false
    await loadWorkers()
  } catch (e) { console.error(e) }
}

function initials(name = '') { return name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() }

onMounted(loadWorkers)
</script>

<style scoped>
.workers-page { display: flex; flex-direction: column; gap: 24px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; }
.page-header h1 { font-size: 28px; font-weight: 600; }
.page-sub { font-size: 13px; color: var(--muted); margin-top: 4px; }
.table-card { padding: 0; overflow: hidden; }

.cell-name { display: flex; align-items: center; gap: 12px; }
.avatar {
  width: 36px; height: 36px; border-radius: 50%;
  font-size: 12px; font-weight: 700;
  display: grid; place-items: center; flex-shrink: 0;
}
.navy-av { background: var(--navy); color: var(--accent); }
.name-primary  { font-size: 14px; font-weight: 500; }
.name-secondary { font-size: 12px; color: var(--muted); }
.muted { color: var(--muted); font-size: 13px; }

.row-actions { display: flex; gap: 4px; }
.icon-btn {
  width: 30px; height: 30px; border: none; background: transparent;
  border-radius: 6px; cursor: pointer; font-size: 14px;
  display: grid; place-items: center; transition: var(--transition);
}
.icon-btn:hover { background: var(--ivory); }
.icon-btn--danger:hover { background: #E05C6B15; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-grid .span-2 { grid-column: span 2; }

/* Side panel */
.side-panel {
  position: fixed;
  right: 0; top: 0; bottom: 0;
  width: 360px;
  background: var(--white);
  box-shadow: -8px 0 40px rgba(13,27,42,0.12);
  z-index: 500;
  display: flex;
  flex-direction: column;
}
.side-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 24px 28px 20px;
  border-bottom: 1px solid #E8EDF3;
}
.side-header h3 { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; }
.modal-close {
  background: none; border: none; color: var(--muted); font-size: 16px; cursor: pointer;
  width: 32px; height: 32px; border-radius: 6px; display: grid; place-items: center;
  transition: var(--transition);
}
.modal-close:hover { background: var(--ivory); color: var(--navy); }
.side-body { padding: 24px 28px; flex: 1; overflow-y: auto; }

.worker-profile { display: flex; flex-direction: column; align-items: center; gap: 8px; padding-bottom: 24px; border-bottom: 1px solid #E8EDF3; }
.big-avatar {
  width: 72px; height: 72px; border-radius: 50%;
  background: var(--navy); color: var(--accent);
  font-size: 24px; font-weight: 700;
  display: grid; place-items: center;
}
.worker-role-tag { font-size: 14px; font-weight: 500; color: var(--muted); }

.info-rows { display: flex; flex-direction: column; gap: 12px; }
.info-row {
  display: flex; justify-content: space-between; font-size: 14px;
  padding-bottom: 10px; border-bottom: 1px solid #E8EDF330;
}
.info-row span:first-child { color: var(--muted); }
.info-row span:last-child  { font-weight: 500; }

.overlay {
  position: fixed; inset: 0;
  background: rgba(13,27,42,0.2);
  z-index: 499;
}

.slide-enter-active, .slide-leave-active { transition: transform 0.25s cubic-bezier(0.4,0,0.2,1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>