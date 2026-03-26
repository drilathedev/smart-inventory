<template>
  <div class="relative">
    <button class="btn-icon relative" @click="open=!open">
      <Icon name="lucide:bell" class="size-[18px]" />
      <span v-if="total>0" class="absolute top-1.5 right-1.5 size-2 rounded-full bg-danger-500 animate-pulse-dot" />
    </button>
    <Transition name="dd">
      <div v-if="open" class="absolute right-0 top-11 w-80 card shadow-lg z-50 overflow-hidden" v-click-outside="()=>open=false">
        <div class="px-4 py-3 border-b border-n-100 flex items-center justify-between">
          <h3 class="card-title">Alerts</h3>
          <span v-if="total" class="badge-red">{{ total }}</span>
        </div>
        <div class="max-h-72 overflow-y-auto">
          <div v-if="!total" class="px-4 py-8 text-center">
            <Icon name="lucide:check-circle" class="size-8 text-g-300 mx-auto mb-2" />
            <p class="text-sm text-n-400">All clear!</p>
          </div>
          <div v-if="products.expiredProducts.length" class="px-4 py-3 bg-danger-50 border-b border-danger-100">
            <p class="text-xs font-bold text-danger-700 flex items-center gap-1.5 mb-1"><Icon name="lucide:alert-circle" class="size-3.5" /> {{ products.expiredProducts.length }} expired</p>
            <p v-for="p in products.expiredProducts.slice(0,2)" :key="p.id" class="text-xs text-danger-600">· {{ p.name }}</p>
          </div>
          <div v-if="products.expiringThisWeek.length" class="px-4 py-3 bg-warn-50 border-b border-warn-100">
            <p class="text-xs font-bold text-warn-700 flex items-center gap-1.5 mb-1"><Icon name="lucide:clock" class="size-3.5" /> {{ products.expiringThisWeek.length }} expiring this week</p>
            <p class="text-xs text-warn-600">€{{ products.expiryValueThisWeek.toFixed(2) }} at risk</p>
          </div>
          <div v-if="products.lowStockProducts.length" class="px-4 py-3">
            <p class="text-xs font-bold text-n-700 flex items-center gap-1.5 mb-1"><Icon name="lucide:package-minus" class="size-3.5" /> {{ products.lowStockProducts.length }} low stock</p>
            <p v-for="p in products.lowStockProducts.slice(0,2)" :key="p.id" class="text-xs text-n-500">· {{ p.name }}</p>
          </div>
        </div>
        <div class="px-4 py-2.5 border-t border-n-100 bg-n-25">
          <NuxtLink to="/expiry" class="text-xs font-bold text-g-500 hover:text-g-600" @click="open=false">View all alerts →</NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { useProductsStore } from '~/stores/products'
const products = useProductsStore()
const open = ref(false)
const total = computed(() => products.expiredProducts.length + products.expiringThisWeek.length + products.lowStockProducts.length)
const vClickOutside = { mounted(el:any,b:any){el._h=(e:Event)=>{if(!el.contains(e.target as Node))b.value(e)};document.addEventListener('click',el._h,true)},unmounted(el:any){document.removeEventListener('click',el._h,true)} }
</script>
<style scoped>
.dd-enter-active,.dd-leave-active{transition:all 0.15s cubic-bezier(0.16,1,0.3,1);}
.dd-enter-from,.dd-leave-to{opacity:0;transform:translateY(-6px) scale(0.97);}
</style>
