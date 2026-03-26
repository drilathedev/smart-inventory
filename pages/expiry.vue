<template>
  <div class="px-4 md:px-6 pt-5 pb-8 space-y-5">

    <div class="animate-up">
      <h1 class="page-title">Expiry Tracker</h1>
      <p class="page-sub mt-0.5">Discount before you lose. Every day costs money.</p>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 animate-up stagger-1">
      <div class="stat-card border-danger-200 bg-danger-50/40">
        <p class="stat-lbl text-danger-500">Expired</p>
        <p class="stat-num text-danger-700">{{ products.expiredProducts.length }}</p>
        <p class="text-xs text-danger-400">Remove now</p>
      </div>
      <div class="stat-card border-warn-200 bg-warn-50/40">
        <p class="stat-lbl text-warn-600">Critical ≤ 2d</p>
        <p class="stat-num text-warn-700">{{ critical.length }}</p>
        <p class="text-xs text-warn-500">Discount 30–50%</p>
      </div>
      <div class="stat-card">
        <p class="stat-lbl">This week</p>
        <p class="stat-num">{{ products.expiringThisWeek.length }}</p>
        <p class="text-xs text-n-400">€{{ products.expiryValueThisWeek.toFixed(0) }} retail</p>
      </div>
      <div class="stat-card border-g-100 bg-g-25">
        <p class="stat-lbl text-g-600">Recoverable</p>
        <p class="stat-num text-g-700">€{{ recoverable.toFixed(0) }}</p>
        <p class="text-xs text-g-400">with discounts</p>
      </div>
    </div>

    <!-- Expired products -->
    <div v-if="products.expiredProducts.length" class="card overflow-hidden border-danger-200 animate-up stagger-2">
      <div class="px-4 py-3 bg-danger-50 border-b border-danger-100 flex items-center justify-between">
        <h2 class="card-title text-danger-700 flex items-center gap-2">
          <Icon name="lucide:alert-circle" class="size-4" /> Expired — remove immediately
        </h2>
        <span class="badge-red">{{ products.expiredProducts.length }}</span>
      </div>
      <div class="divide-y divide-n-100">
        <div v-for="p in products.expiredProducts" :key="p.id" class="list-row bg-danger-50/20">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-n-800">{{ p.name }}</p>
            <p class="text-xs text-n-400">{{ p.stock }} {{ p.unit }} · {{ p.location }}</p>
          </div>
          <UiExpiryBadge :days="products.daysUntilExpiry(p)" />
          <p class="text-sm font-bold font-mono text-danger-600 shrink-0">−€{{ (p.stock * p.cost).toFixed(2) }}</p>
          <button class="btn text-xs px-3 py-1.5 rounded-lg bg-n-0 border border-danger-200 text-danger-600 hover:bg-danger-50 shrink-0 font-semibold" @click="markWaste(p)">
            <Icon name="lucide:trash-2" class="size-3.5" /> Remove
          </button>
        </div>
      </div>
    </div>

    <!-- Discount recommendations -->
    <div class="card overflow-hidden animate-up stagger-2">
      <div class="px-4 py-3 border-b border-n-100 flex flex-wrap items-center gap-3">
        <h2 class="card-title flex items-center gap-2 flex-1">
          <Icon name="lucide:tag" class="size-4 text-warn-500" />
          Discount recommendations
        </h2>
        <div class="flex items-center gap-2">
          <select v-model="daysFilter" class="input-sm w-auto">
            <option :value="3">Next 3 days</option>
            <option :value="7">Next 7 days</option>
            <option :value="14">Next 14 days</option>
          </select>
          <button v-if="expiringFiltered.length" class="btn-primary text-xs py-2" @click="applyAllDiscounts">
            <Icon name="lucide:zap" class="size-3.5" />
            <span class="hidden sm:inline">Apply all</span>
          </button>
        </div>
      </div>

      <div v-if="!expiringFiltered.length" class="py-14 text-center">
        <Icon name="lucide:check-circle" class="size-12 text-g-200 mx-auto mb-3" />
        <p class="text-sm font-semibold text-n-500">No products expiring in {{ daysFilter }} days</p>
        <p class="text-xs text-n-300 mt-1">Good job keeping fresh stock!</p>
      </div>

      <!-- Mobile cards -->
      <div class="md:hidden divide-y divide-n-100">
        <div v-for="p in expiringFiltered" :key="p.id" class="p-4 space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-n-900">{{ p.name }}</p>
              <p class="text-xs text-n-400">{{ p.stock }} {{ p.unit }} · {{ p.category }}</p>
            </div>
            <UiExpiryBadge :days="products.daysUntilExpiry(p)" />
          </div>
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="text-sm text-n-300 line-through font-mono">€{{ p.price.toFixed(2) }}</span>
              <span class="text-lg font-bold text-g-600 font-mono">€{{ discountedPrice(p).toFixed(2) }}</span>
              <span class="badge-amber">−{{ products.suggestedDiscountPercent(p) }}%</span>
            </div>
            <button class="btn-primary text-xs py-2 shrink-0" @click="applyDiscount(p)">
              <Icon name="lucide:tag" class="size-3.5" /> Apply
            </button>
          </div>
          <div class="rounded-lg bg-g-50 px-3 py-2 flex items-center justify-between text-xs">
            <span class="text-g-600 font-semibold">Recovery</span>
            <span class="font-bold font-mono text-g-700">€{{ (discountedPrice(p) * p.stock).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Desktop table -->
      <div class="hidden md:block divide-y divide-n-100">
        <div v-for="p in expiringFiltered" :key="p.id"
          class="flex items-center gap-4 px-5 py-4 hover:bg-n-25 transition-colors">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="text-sm font-bold text-n-800">{{ p.name }}</p>
              <span class="badge-gray">{{ p.category }}</span>
            </div>
            <p class="text-xs text-n-400 mt-0.5">{{ p.stock }} {{ p.unit }} · {{ p.location }}</p>
          </div>
          <UiExpiryBadge :days="products.daysUntilExpiry(p)" />
          <div class="flex items-center gap-2 shrink-0">
            <span class="text-sm text-n-300 line-through font-mono">€{{ p.price.toFixed(2) }}</span>
            <span class="text-base font-bold text-g-600 font-mono">€{{ discountedPrice(p).toFixed(2) }}</span>
            <span class="badge-amber">−{{ products.suggestedDiscountPercent(p) }}%</span>
          </div>
          <div class="text-right shrink-0 w-28">
            <p class="text-sm font-bold font-mono text-n-700">€{{ (discountedPrice(p) * p.stock).toFixed(2) }}</p>
            <p class="text-2xs text-n-400">recoverable</p>
          </div>
          <button class="btn-primary text-xs py-2 shrink-0" @click="applyDiscount(p)">
            <Icon name="lucide:tag" class="size-3.5" /> Apply
          </button>
        </div>
      </div>
    </div>

    <!-- Over-ordering -->
    <div v-if="products.overorderedRisk.length" class="card p-5 animate-up stagger-3">
      <h2 class="card-title flex items-center gap-2 mb-1">
        <Icon name="lucide:trending-down" class="size-4 text-g-500" /> Stop over-ordering
      </h2>
      <p class="text-sm text-n-400 mb-4">These products expire fast but you're holding too much. Order smaller, more often.</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div v-for="p in products.overorderedRisk" :key="p.id" class="rounded-xl border border-n-200 p-3.5 bg-n-25">
          <p class="text-sm font-bold text-n-800 mb-2">{{ p.name }}</p>
          <div class="flex items-center justify-between">
            <div class="text-xs text-n-400 space-y-0.5">
              <p>{{ p.stock }} {{ p.unit }} in stock</p>
              <p>Min: {{ p.minStock }} {{ p.unit }}</p>
            </div>
            <div class="text-right">
              <UiExpiryBadge :days="products.daysUntilExpiry(p)" />
              <p class="text-2xs text-n-300 mt-1">{{ Math.round(p.stock / p.minStock * 100) }}% over min</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductsStore, type Product } from '~/stores/products'
import { useUIStore } from '~/stores/ui'
import { addDays, isWithinInterval, startOfToday, isPast } from 'date-fns'

const products = useProductsStore()
const ui = useUIStore()
const daysFilter = ref(7)

const critical = computed(() =>
  products.products.filter(p => { const d = products.daysUntilExpiry(p); return d !== null && d >= 0 && d <= 2 })
)

const expiringFiltered = computed(() => {
  const today = startOfToday(), end = addDays(today, daysFilter.value)
  return products.products
    .filter(p => {
      if (!p.expiryDate) return false
      const exp = new Date(p.expiryDate)
      return isWithinInterval(exp, { start: today, end }) && !isPast(exp)
    })
    .sort((a, b) => (products.daysUntilExpiry(a) ?? 999) - (products.daysUntilExpiry(b) ?? 999))
})

const discountedPrice = (p: Product) => p.price * (1 - products.suggestedDiscountPercent(p) / 100)
const recoverable = computed(() => expiringFiltered.value.reduce((s, p) => s + discountedPrice(p) * p.stock, 0))

const applyDiscount = (p: Product) => {
  const disc = products.suggestedDiscountPercent(p)
  const np = +discountedPrice(p).toFixed(2)
  products.updateProduct(p.id, { price: np })
  ui.showToast(`${p.name} discounted −${disc}% → €${np.toFixed(2)}`)
}

const applyAllDiscounts = () => {
  expiringFiltered.value.forEach(applyDiscount)
  ui.showToast(`Discounts applied to ${expiringFiltered.value.length} products`)
}

const markWaste = (p: Product) => {
  products.adjustStock(p.id, p.stock, 'waste', 'Expired — removed from shelf')
  ui.showToast(`${p.name} logged as waste`, 'info')
}
</script>
