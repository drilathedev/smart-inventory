<template>
  <span class="badge" :class="props.stock===0?'badge-red':props.stock<=props.minStock?'badge-amber':'badge-gray'">
    {{ props.stock }} {{ props.unit }}
  </span>
</template>
<script setup lang="ts">
const props = defineProps<{ stock: number; minStock: number; unit: string }>()
</script>
