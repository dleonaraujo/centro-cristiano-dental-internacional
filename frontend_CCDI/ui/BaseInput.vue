<template>
  <div class="field">
    <label v-if="label" class="field-label">{{ label }} <span v-if="required" class="req">*</span></label>
    <div class="input-wrap" :class="{ 'input-wrap--error': error }">
      <span v-if="icon" class="input-icon">{{ icon }}</span>
      <component
        :is="type === 'textarea' ? 'textarea' : 'input'"
        v-bind="$attrs"
        :type="type !== 'textarea' ? type : undefined"
        :value="modelValue"
        :placeholder="placeholder"
        :rows="rows"
        class="input"
        :class="{ 'has-icon': icon, 'is-textarea': type === 'textarea' }"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
    <p v-if="error" class="field-error">{{ error }}</p>
    <p v-else-if="hint" class="field-hint">{{ hint }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  icon: String,
  error: String,
  hint: String,
  required: Boolean,
  rows: { type: Number, default: 3 },
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
.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  border: 1.5px solid #D5DDE8;
  border-radius: 8px;
  background: var(--white);
  transition: var(--transition);
}
.input-wrap:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
.input-wrap--error { border-color: var(--danger); }
.input-icon {
  padding: 0 0 0 12px;
  font-size: 15px;
  color: var(--muted);
  pointer-events: none;
  flex-shrink: 0;
}
.input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: var(--navy);
  padding: 10px 14px;
}
.input.has-icon { padding-left: 8px; }
.input.is-textarea { resize: vertical; min-height: 80px; padding: 10px 14px; }
.input::placeholder { color: var(--muted); }
.field-error { font-size: 12px; color: var(--danger); }
.field-hint  { font-size: 12px; color: var(--muted); }
</style>