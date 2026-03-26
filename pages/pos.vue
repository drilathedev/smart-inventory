<template>
  <div class="flex flex-col md:flex-row h-full overflow-hidden">

    <!-- Left: products -->
    <div class="flex-1 flex flex-col overflow-hidden">

      <!-- Search + categories -->
      <div class="bg-n-0 border-b border-n-200 px-3 pt-3 pb-2 space-y-2 shrink-0">
        <div class="relative">
          <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-n-300" />
          <input v-model="search" class="input pl-9" placeholder="Search products…" />
        </div>
        <div class="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          <button :class="activeCat==='' ? 'btn-pill-active' : 'btn-pill'" @click="activeCat=''">All</button>
          <button v-for="c in products.categories" :key="c" :class="activeCat===c ? 'btn-pill-active' : 'btn-pill'" @click="activeCat=c">{{ c }}</button>
        </div>
      </div>

      <!-- Product grid -->
      <div class="flex-1 overflow-y-auto p-3">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          <button
            v-for="p in filteredProducts" :key="p.id"
            class="card text-left p-3.5 relative active:scale-[0.97] transition-all duration-100 group"
            :class="p.stock===0 ? 'opacity-40 cursor-not-allowed' : 'hover:border-g-200 hover:shadow-md cursor-pointer'"
            :disabled="p.stock===0"
            @click="addToCart(p)"
          >
            <div class="size-10 rounded-xl mb-2.5 flex items-center justify-center font-bold text-base" :class="catColor(p.category)">
              {{ p.name.charAt(0) }}
            </div>
            <p class="text-[13px] font-semibold text-n-800 leading-snug line-clamp-2 min-h-[36px]">{{ p.name }}</p>
            <p class="text-xs text-n-400 mt-1">{{ p.stock }} left</p>
            <p class="text-base font-bold text-g-600 font-mono mt-1">€{{ p.price.toFixed(2) }}</p>

            <!-- Expiry warning badge -->
            <div v-if="products.daysUntilExpiry(p) !== null && products.daysUntilExpiry(p)! <= 3" class="absolute top-2 right-2">
              <UiExpiryBadge :days="products.daysUntilExpiry(p)" />
            </div>

            <!-- Add indicator on hover -->
            <div class="absolute inset-0 rounded-xl border-2 border-g-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </button>
        </div>
        <div v-if="!filteredProducts.length" class="py-16 text-center">
          <Icon name="lucide:search-x" class="size-10 text-n-200 mx-auto mb-2" />
          <p class="text-sm text-n-300">No products found</p>
        </div>
      </div>
    </div>

    <!-- Mobile: floating cart button -->
    <Transition name="cart-btn">
      <button
        v-if="sales.cartCount > 0"
        class="md:hidden fixed left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-g-500 text-white shadow-float font-bold text-sm"
        style="bottom: calc(var(--nav-h) + 12px)"
        @click="cartOpen=true"
      >
        <Icon name="lucide:shopping-cart" class="size-5" />
        <span>{{ sales.cartCount }} item{{ sales.cartCount > 1 ? 's' : '' }}</span>
        <span class="font-bold font-mono text-g-100">€{{ sales.cartTotal.toFixed(2) }}</span>
        <Icon name="lucide:chevron-up" class="size-4 text-g-300" />
      </button>
    </Transition>

    <!-- Mobile cart sheet -->
    <Transition name="sheet">
      <div v-if="cartOpen" class="md:hidden fixed inset-0 z-50">
        <div class="absolute inset-0 bg-n-900/30 backdrop-blur-[2px]" @click="cartOpen=false" />
        <div class="absolute inset-x-0 bottom-0 bg-n-0 rounded-t-3xl shadow-xl flex flex-col" style="max-height:90dvh">
          <div class="sheet-handle" />
          <PosCartPanel @checkout-done="cartOpen=false" @close="cartOpen=false" />
        </div>
      </div>
    </Transition>

    <!-- Desktop cart sidebar -->
    <div class="hidden md:flex w-80 shrink-0 border-l border-n-200 bg-n-0 flex-col">
      <PosCartPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductsStore, type Product } from '~/stores/products'
import { useSalesStore } from '~/stores/sales'
import { useUIStore } from '~/stores/ui'

const products = useProductsStore()
const sales    = useSalesStore()
const ui       = useUIStore()

const search    = ref('')
const activeCat = ref('')
const cartOpen  = ref(false)

const filteredProducts = computed(() => {
  let l = [...products.products]
  if (search.value)    { const q=search.value.toLowerCase(); l=l.filter(p=>p.name.toLowerCase().includes(q)||p.sku.toLowerCase().includes(q)) }
  if (activeCat.value) l=l.filter(p=>p.category===activeCat.value)
  return l
})

const addToCart = (p: Product) => {
  if (!sales.addToCart(p.id)) ui.showToast('Not enough stock','warning')
}

const catColor = (c: string) => ({ 'Dairy':'bg-blue-50 text-blue-500','Bakery':'bg-warn-50 text-warn-600','Vegetables':'bg-g-50 text-g-600','Fruits':'bg-pink-50 text-pink-500','Meat & Deli':'bg-danger-50 text-danger-500','Fish & Seafood':'bg-cyan-50 text-cyan-600','Beverages':'bg-purple-50 text-purple-500','Pantry':'bg-n-100 text-n-500' }[c] ?? 'bg-n-100 text-n-500')
</script>

<style scoped>
.cart-btn-enter-active,.cart-btn-leave-active { transition: all 0.28s cubic-bezier(0.34,1.56,0.64,1); }
.cart-btn-enter-from,.cart-btn-leave-to { opacity:0; transform: translateX(-50%) translateY(20px) scale(0.9); }
.sheet-enter-active { transition: transform 0.32s cubic-bezier(0.16,1,0.3,1), opacity 0.2s; }
.sheet-leave-active { transition: transform 0.2s ease, opacity 0.15s; }
.sheet-enter-from,.sheet-leave-to { transform:translateY(100%); opacity:0; }
</style>
