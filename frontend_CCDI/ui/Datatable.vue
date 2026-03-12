<template>
  <div class="table-wrapper">
    <div class="table-toolbar">
      <div class="search-box">
        <span>⌕</span>
        <input v-model="search" type="text" :placeholder="`Search ${entity}…`" />
      </div>
      <slot name="actions" />
    </div>

    <div class="table-scroll">
      <table class="data-table">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key" @click="col.sortable !== false && sort(col.key)" :class="{ sortable: col.sortable !== false }">
              {{ col.label }}
              <span v-if="sortKey === col.key" class="sort-icon">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th v-if="$slots.rowActions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading"><td :colspan="columns.length + 1" class="loading-cell"><div class="spinner"></div></td></tr>
          <tr v-else-if="!paged.length"><td :colspan="columns.length + 1" class="empty-cell">No {{ entity }} found</td></tr>
          <tr v-else v-for="row in paged" :key="row.id" class="data-row" @click="$emit('row-click', row)">
            <td v-for="col in columns" :key="col.key">
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                {{ row[col.key] ?? '—' }}
              </slot>
            </td>
            <td v-if="$slots.rowActions" @click.stop>
              <slot name="rowActions" :row="row" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-footer">
      <p class="table-count">Showing {{ paged.length }} of {{ filtered.length }} {{ entity }}</p>
      <div class="pagination">
        <button class="page-btn" :disabled="page <= 1" @click="page--">‹</button>
        <span class="page-info">{{ page }} / {{ totalPages }}</span>
        <button class="page-btn" :disabled="page >= totalPages" @click="page++">›</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  columns: Array,
  rows: { type: Array, default: () => [] },
  entity: { type: String, default: 'records' },
  loading: Boolean,
  perPage: { type: Number, default: 10 },
})
defineEmits(['row-click'])

const search   = ref('')
const sortKey  = ref('')
const sortDir  = ref('asc')
const page     = ref(1)

function sort(key) {
  if (sortKey.value === key) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  else { sortKey.value = key; sortDir.value = 'asc' }
}

const filtered = computed(() => {
  let data = props.rows
  if (search.value) {
    const q = search.value.toLowerCase()
    data = data.filter(r => Object.values(r).some(v => String(v ?? '').toLowerCase().includes(q)))
  }
  if (sortKey.value) {
    data = [...data].sort((a, b) => {
      const va = a[sortKey.value] ?? '', vb = b[sortKey.value] ?? ''
      return sortDir.value === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })
  }
  return data
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / props.perPage)))
const paged = computed(() => {
  const start = (page.value - 1) * props.perPage
  return filtered.value.slice(start, start + props.perPage)
})
</script>

<style scoped>
.table-wrapper { display: flex; flex-direction: column; gap: 0; }

.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #E8EDF3;
  gap: 12px;
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
  flex: 1;
  max-width: 340px;
}
.search-box:focus-within { border-color: var(--accent); background: var(--white); }
.search-box span { color: var(--muted); }
.search-box input {
  border: none; background: transparent;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px; color: var(--navy); outline: none; width: 100%;
}
.search-box input::placeholder { color: var(--muted); }

.table-scroll { overflow-x: auto; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th {
  text-align: left;
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--muted);
  padding: 12px 16px;
  border-bottom: 1px solid #E8EDF3;
  white-space: nowrap;
  user-select: none;
}
.data-table th.sortable { cursor: pointer; }
.data-table th.sortable:hover { color: var(--navy); }
.sort-icon { margin-left: 4px; }

.data-table td {
  padding: 14px 16px;
  font-size: 14px;
  color: var(--navy);
  border-bottom: 1px solid #E8EDF308;
}
.data-row { cursor: pointer; transition: background var(--transition); }
.data-row:hover { background: #F7F4EF88; }

.loading-cell, .empty-cell {
  text-align: center;
  padding: 48px;
  color: var(--muted);
}
.spinner {
  width: 28px; height: 28px;
  border: 2px solid #E8EDF3;
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin: 0 auto;
}
@keyframes spin { to { transform: rotate(360deg); } }

.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  border-top: 1px solid #E8EDF3;
}
.table-count { font-size: 12px; color: var(--muted); }
.pagination { display: flex; align-items: center; gap: 8px; }
.page-btn {
  width: 30px; height: 30px;
  border: 1.5px solid #D5DDE8;
  border-radius: 6px;
  background: var(--white);
  cursor: pointer;
  font-size: 16px;
  color: var(--navy);
  display: grid;
  place-items: center;
  transition: var(--transition);
}
.page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.page-btn:not(:disabled):hover { border-color: var(--accent); color: var(--accent); }
.page-info { font-size: 13px; color: var(--muted); min-width: 50px; text-align: center; }
</style>