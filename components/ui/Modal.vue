<template>
  <Teleport to="body">
    <Transition :name="isMobile ? 'sheet' : 'modal'">
      <div v-if="show" class="fixed inset-0 z-50 flex" :class="isMobile ? 'items-end' : 'items-center justify-center p-4'">
        <div class="absolute inset-0 bg-n-900/30 backdrop-blur-[3px]" @click="$emit('close')" />
        <div
          class="relative bg-n-0 w-full flex flex-col overflow-hidden"
          :class="isMobile
            ? 'rounded-t-3xl max-h-[92vh] shadow-xl'
            : 'rounded-2xl shadow-xl max-w-lg max-h-[90vh]'"
        >
          <div v-if="isMobile" class="sheet-handle" />
          <div class="flex items-start justify-between px-5 py-4 border-b border-n-100 shrink-0">
            <div>
              <h2 class="text-base font-bold text-n-900">{{ title }}</h2>
              <p v-if="subtitle" class="text-sm text-n-400 mt-0.5">{{ subtitle }}</p>
            </div>
            <button class="btn-icon size-8 -mr-1 -mt-1 shrink-0" @click="$emit('close')">
              <Icon name="lucide:x" class="size-4" />
            </button>
          </div>
          <div class="overflow-y-auto overflow-x-hidden flex-1"><slot /></div>
          <div v-if="$slots.footer" class="border-t border-n-100 px-5 py-4 bg-n-25 shrink-0 pb-safe">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useUIStore } from '~/stores/ui'
defineProps<{ show: boolean; title: string; subtitle?: string }>()
defineEmits(['close'])
const { isMobile } = useUIStore()
</script>

<style scoped>
.modal-enter-active,.modal-leave-active { transition: opacity 0.18s ease; }
.modal-enter-from,.modal-leave-to { opacity: 0; }
.sheet-enter-active { transition: transform 0.32s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease; }
.sheet-leave-active { transition: transform 0.2s ease, opacity 0.15s ease; }
.sheet-enter-from,.sheet-leave-to { transform: translateY(100%); opacity: 0; }
</style>
