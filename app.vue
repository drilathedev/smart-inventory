<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useSalesStore } from '~/stores/sales'
import { useUIStore } from '~/stores/ui'

const sales = useSalesStore()
const ui    = useUIStore()

onMounted(() => {
  sales.seedSales()
  ui.checkMobile()
  window.addEventListener('resize', ui.checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', ui.checkMobile)
})
</script>
