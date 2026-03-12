<template>
  <div class="field">
    <label v-if="label" class="field-label">{{ label }} <span v-if="required" class="req">*</span></label>
    <div class="select-wrap" :class="{ 'select-wrap--error': error }">
      <select
        :value="modelValue"
        class="select"
        v-bind="$attrs"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <option value="" disabled>{{ placeholder || 'Select…' }}</option>
        <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
      <span class="select-arrow">▾</span>
    </div>
    <p v-if="error" class="field-error">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  options: Array,   // [{ value, label }]
  error: String,
  required: Boolean,
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.field { display: flex; flex-direction: column; gap: 6px; }
.field-label {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: var(--navy);
  text-transform: uppercase;
}
.req { color: var(--danger); }
.select-wrap {
  position: relative;
  border: 1.5px solid #D5DDE8;
  border-radius: 8px;
  background: var(--white);
  transition: var(--transition);
}
.select-wrap:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
.select-wrap--error { border-color: var(--danger); }
.select {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: var(--navy);
  padding: 10px 36px 10px 14px;
  appearance: none;
  cursor: pointer;
}
.select-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
  pointer-events: none;
  font-size: 12px;
}
.field-error { font-size: 12px; color: var(--danger); }
</style>