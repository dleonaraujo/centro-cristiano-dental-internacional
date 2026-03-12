<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
        <div class="modal-box" :style="{ maxWidth: width }">
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button class="modal-close" @click="$emit('update:modelValue', false)">✕</button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: String,
  width: { type: String, default: '560px' },
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(13,27,42,0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}
.modal-box {
  background: var(--white);
  border-radius: 16px;
  width: 100%;
  box-shadow: 0 24px 80px rgba(13,27,42,0.22);
  overflow: hidden;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px 20px;
  border-bottom: 1px solid #E8EDF3;
}
.modal-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px;
  font-weight: 600;
  color: var(--navy);
}
.modal-close {
  background: none;
  border: none;
  color: var(--muted);
  font-size: 16px;
  cursor: pointer;
  width: 32px; height: 32px;
  border-radius: 6px;
  display: grid;
  place-items: center;
  transition: var(--transition);
}
.modal-close:hover { background: var(--ivory); color: var(--navy); }
.modal-body { padding: 24px 28px; }
.modal-footer {
  padding: 16px 28px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #E8EDF3;
}

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-box,
.modal-leave-active .modal-box { transition: transform 0.2s ease; }
.modal-enter-from .modal-box { transform: translateY(16px) scale(0.98); }
.modal-leave-to .modal-box   { transform: translateY(8px)  scale(0.98); }
</style>