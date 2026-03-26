<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="ui.toast"
        :key="ui.toast.id"
        class="fixed z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold max-w-sm"
        :class="[cls, 'bottom-[calc(var(--nav-h)+12px)] md:bottom-5 right-4']"
      >
        <Icon :name="icon" class="size-4 shrink-0" />
        {{ ui.toast.message }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useUIStore } from '~/stores/ui'
const ui = useUIStore()
const cls  = computed(() => ({ success:'bg-g-500 text-white', error:'bg-danger-500 text-white', warning:'bg-warn-500 text-white', info:'bg-n-900 text-white' }[ui.toast?.type ?? 'info']))
const icon = computed(() => ({ success:'lucide:check-circle', error:'lucide:x-circle', warning:'lucide:alert-triangle', info:'lucide:info' }[ui.toast?.type ?? 'info']))
</script>

<style scoped>
.toast-enter-active { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.toast-leave-active { transition: all 0.18s ease; }
.toast-enter-from   { transform: translateY(16px) scale(0.92); opacity: 0; }
.toast-leave-to     { transform: translateY(6px); opacity: 0; }
</style>
