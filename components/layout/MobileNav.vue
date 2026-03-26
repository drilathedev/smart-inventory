<template>
  <nav
    class="fixed bottom-0 inset-x-0 z-30 bg-n-0 border-t border-n-200"
    style="height: var(--nav-h); padding-bottom: env(safe-area-inset-bottom, 0px)"
  >
    <div class="flex h-full items-stretch">
      <NuxtLink
        v-for="item in items" :key="item.to" :to="item.to"
        class="flex flex-col items-center justify-center gap-1 flex-1 relative transition-colors duration-150"
        :class="isActive(item.to) ? 'text-g-500' : 'text-n-400'"
      >
        <!-- Active indicator -->
        <div
          v-if="isActive(item.to)"
          class="absolute top-0 inset-x-3 h-0.5 rounded-full bg-g-500 animate-pop"
        />
        <!-- Badge -->
        <div class="relative">
          <Icon :name="item.icon" class="size-5" :class="isActive(item.to) ? 'text-g-500' : ''" />
          <span
            v-if="item.count"
            class="absolute -top-1.5 -right-2 min-w-[16px] h-4 rounded-full bg-danger-500 text-white text-2xs font-bold flex items-center justify-center px-1 leading-none"
          >{{ item.count > 9 ? '9+' : item.count }}</span>
        </div>
        <span class="text-2xs font-semibold leading-none">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/stores/products'
const products = useProductsStore()
const route = useRoute()
const isActive = (p: string) => p === '/' ? route.path === '/' : route.path.startsWith(p)

const items = computed(() => [
  { to:'/',          icon:'lucide:layout-dashboard', label:'Home' },
  { to:'/inventory', icon:'lucide:package',           label:'Stock',  count: products.lowStockProducts.length },
  { to:'/expiry',    icon:'lucide:timer',             label:'Expiry', count: products.expiringThisWeek.length },
  { to:'/pos',       icon:'lucide:shopping-cart',     label:'POS' },
  { to:'/sales',     icon:'lucide:bar-chart-2',       label:'Sales' },
])
</script>
