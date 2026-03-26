<template>
  <span class="badge" :class="cls">
    <span class="size-1.5 rounded-full shrink-0" :class="dot" />{{ label }}
  </span>
</template>
<script setup lang="ts">
const p = defineProps<{ days: number | null }>()
const cls  = computed(() => { const d = p.days; if (d===null) return 'badge-gray'; if (d<0) return 'badge-red'; if (d<=2) return 'badge-red'; if (d<=7) return 'badge-amber'; return 'badge-green' })
const dot  = computed(() => { const d = p.days; if (d===null) return 'bg-n-300'; if (d<0) return 'bg-danger-500'; if (d<=2) return 'bg-danger-500 animate-pulse-dot'; if (d<=7) return 'bg-warn-400'; return 'bg-g-400' })
const label = computed(() => { const d = p.days; if (d===null) return 'No expiry'; if (d<0) return 'Expired'; if (d===0) return 'Today'; if (d===1) return '1 day'; if (d<=7) return `${d} days`; return `${d}d` })
</script>
