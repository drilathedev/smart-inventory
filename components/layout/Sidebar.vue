<template>
  <div class="h-full bg-n-0 border-r border-n-200 flex flex-col overflow-hidden">

    <!-- Brand -->
    <div class="px-3 pt-4 pb-3 flex items-center gap-2.5 shrink-0">
      <div class="size-8 rounded-lg bg-g-500 flex items-center justify-center shadow-green shrink-0">
        <Icon name="lucide:leaf" class="size-[15px] text-white" />
      </div>
      <Transition name="fade">
        <div v-if="expanded" class="min-w-0">
          <p class="text-[13px] font-bold text-n-900 leading-none">SmartStock</p>
          <p class="text-2xs text-n-400 mt-0.5">Inventory Intelligence</p>
        </div>
      </Transition>
      <button v-if="mobile" class="btn-icon ml-auto size-8" @click="$emit('close')">
        <Icon name="lucide:x" class="size-4" />
      </button>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-2 py-1 flex flex-col gap-0.5 overflow-y-auto no-scrollbar">
      <NuxtLink
        v-for="item in navItems" :key="item.to" :to="item.to"
        class="flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 group relative"
        :class="isActive(item.to)
          ? 'bg-g-50 text-g-700 font-semibold'
          : 'text-n-500 hover:bg-n-50 hover:text-n-900'"
        @click="mobile && $emit('close')"
      >
        <div class="relative shrink-0">
          <Icon :name="item.icon" class="size-[17px]" />
          <span
            v-if="item.count && !expanded"
            class="absolute -top-1.5 -right-1.5 size-[14px] rounded-full bg-danger-500 text-white text-2xs font-bold flex items-center justify-center leading-none"
          >{{ item.count > 9 ? '9' : item.count }}</span>
        </div>
        <Transition name="fade">
          <span v-if="expanded" class="flex-1 truncate">{{ item.label }}</span>
        </Transition>
        <Transition name="fade">
          <span
            v-if="expanded && item.count"
            class="ml-auto shrink-0 min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center text-2xs font-bold"
            :class="item.countClass"
          >{{ item.count }}</span>
        </Transition>
        <!-- Tooltip when collapsed -->
        <div
          v-if="!expanded && !mobile"
          class="absolute left-full ml-3 px-2.5 py-1.5 bg-n-900 text-white text-xs font-medium rounded-lg
                 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-lg"
        >{{ item.label }}</div>
      </NuxtLink>
    </nav>

    <!-- Footer -->
    <div class="px-2 pb-3 pt-2 border-t border-n-100 shrink-0">
      <NuxtLink
        to="/settings"
        class="flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-medium text-n-400 hover:bg-n-50 hover:text-n-700 transition-all group relative"
        :class="isActive('/settings') ? 'bg-g-50 text-g-700' : ''"
        @click="mobile && $emit('close')"
      >
        <Icon name="lucide:settings" class="size-[17px] shrink-0" />
        <Transition name="fade">
          <span v-if="expanded">Settings</span>
        </Transition>
        <div v-if="!expanded && !mobile" class="absolute left-full ml-3 px-2.5 py-1.5 bg-n-900 text-white text-xs font-medium rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-lg">Settings</div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/stores/products'
import { useUIStore } from '~/stores/ui'

const props = defineProps<{ mobile?: boolean }>()
defineEmits(['close'])

const products = useProductsStore()
const ui = useUIStore()
const route = useRoute()

const expanded = computed(() => props.mobile || ui.sidebarOpen)
const isActive = (p: string) => p === '/' ? route.path === '/' : route.path.startsWith(p)

const navItems = computed(() => [
  { to:'/',          icon:'lucide:layout-dashboard', label:'Dashboard' },
  { to:'/inventory', icon:'lucide:package',           label:'Inventory',
    count: products.lowStockProducts.length || null, countClass:'bg-warn-100 text-warn-700' },
  { to:'/expiry',    icon:'lucide:timer',             label:'Expiry',
    count: products.expiringThisWeek.length || null, countClass:'bg-danger-50 text-danger-600' },
  { to:'/pos',       icon:'lucide:shopping-cart',     label:'Point of Sale' },
  { to:'/sales',     icon:'lucide:bar-chart-2',       label:'Sales' },
  { to:'/suppliers', icon:'lucide:truck',             label:'Suppliers' },
  { to:'/waste',     icon:'lucide:leaf-off',          label:'Waste' },
])
</script>

<style scoped>
.fade-enter-active,.fade-leave-active { transition: opacity 0.12s ease; }
.fade-enter-from,.fade-leave-to { opacity: 0; }
</style>
