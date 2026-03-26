<template>
  <div class="px-4 md:px-6 pt-5 pb-8 space-y-5">

    <!-- Header row -->
    <div class="flex items-start justify-between gap-2">
      <div class="animate-up">
        <p class="text-xs font-semibold text-n-400 uppercase tracking-wider">{{ today }}</p>
        <h1 class="page-title mt-0.5">Good {{ greeting }}</h1>
      </div>
      <div class="text-right animate-up stagger-1 shrink-0">
        <p class="text-2xl font-bold font-mono text-n-900">€{{ sales.revenueToday.toFixed(2) }}</p>
        <p class="text-xs text-n-400 font-medium">earned today</p>
      </div>
    </div>

    <!-- ════════════════════════════════════════
         HERO ALERT — Expiry / money at risk
         ════════════════════════════════════════ -->
    <div v-if="products.expiringThisWeek.length" class="alert-amber animate-up stagger-1">
      <div class="flex items-start gap-3">
        <div class="size-10 rounded-xl bg-warn-400 flex items-center justify-center shrink-0 shadow-md">
          <Icon name="lucide:zap" class="size-5 text-white" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-bold text-n-900 text-[15px] leading-snug">
            €{{ products.expiryValueThisWeek.toFixed(2) }} expiring this week
          </p>
          <p class="text-sm text-n-600 mt-0.5">
            Discount {{ products.expiringThisWeek.length }} products now → recover
            <strong class="text-g-600">€{{ potentialRecovery.toFixed(2) }}</strong>
          </p>
          <div class="flex flex-wrap gap-1.5 mt-2.5">
            <span v-for="p in products.expiringThisWeek.slice(0,3)" :key="p.id"
              class="text-2xs bg-n-0/80 border border-warn-200 text-warn-700 rounded-lg px-2 py-1 font-semibold">
              {{ p.name }}
            </span>
            <span v-if="products.expiringThisWeek.length > 3" class="text-2xs text-warn-600 font-medium py-1">
              +{{ products.expiringThisWeek.length - 3 }} more
            </span>
          </div>
        </div>
      </div>
      <div class="flex gap-2 mt-3.5">
        <NuxtLink to="/expiry"
          class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-warn-500 text-white text-sm font-bold hover:bg-warn-600 active:scale-[0.98] transition-all shadow-md">
          <Icon name="lucide:tag" class="size-4" /> Discount now
        </NuxtLink>
        <NuxtLink to="/waste"
          class="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-n-0/70 border border-warn-200 text-warn-700 text-sm font-semibold hover:bg-n-0 transition-all">
          <Icon name="lucide:trending-down" class="size-4" />
          <span class="hidden sm:inline">Waste report</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Reorder pill -->
    <div v-if="products.reorderSuggestions.length"
      class="flex items-center gap-3 p-3.5 rounded-xl bg-n-0 border border-n-200 shadow-card animate-up stagger-2">
      <div class="size-8 rounded-lg bg-g-50 border border-g-100 flex items-center justify-center shrink-0">
        <Icon name="lucide:truck" class="size-4 text-g-500" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-bold text-n-900">{{ products.reorderSuggestions.length }} reorder{{ products.reorderSuggestions.length > 1 ? 's' : '' }} needed</p>
        <p class="text-xs text-n-400">Based on your sales speed</p>
      </div>
      <NuxtLink to="/suppliers" class="btn-secondary py-1.5 text-xs shrink-0">Order now</NuxtLink>
    </div>

    <!-- KPIs — 2x2 grid -->
    <div class="grid grid-cols-2 gap-3">
      <div class="stat-card animate-up stagger-1">
        <div class="flex items-center justify-between mb-0.5">
          <span class="stat-lbl">Month revenue</span>
          <div class="size-6 rounded-md bg-g-50 flex items-center justify-center">
            <Icon name="lucide:trending-up" class="size-3 text-g-500" />
          </div>
        </div>
        <p class="stat-num">€{{ sales.revenueThisMonth.toFixed(0) }}</p>
        <p class="text-xs font-semibold text-g-500 mt-0.5">€{{ sales.profitThisMonth.toFixed(0) }} profit · {{ sales.marginThisMonth.toFixed(0) }}%</p>
      </div>

      <div class="stat-card animate-up stagger-2" :class="products.expiryValueThisWeek > 0 ? 'border-warn-200 bg-warn-50/30' : ''">
        <div class="flex items-center justify-between mb-0.5">
          <span class="stat-lbl">At risk</span>
          <div class="size-6 rounded-md flex items-center justify-center" :class="products.expiryValueThisWeek > 0 ? 'bg-warn-100' : 'bg-n-100'">
            <Icon name="lucide:timer" class="size-3" :class="products.expiryValueThisWeek > 0 ? 'text-warn-500' : 'text-n-400'" />
          </div>
        </div>
        <p class="stat-num" :class="products.expiryValueThisWeek > 0 ? 'text-warn-700' : ''">
          €{{ products.expiryValueThisWeek.toFixed(0) }}
        </p>
        <p class="text-xs text-n-400 mt-0.5">{{ products.expiringThisWeek.length }} products expiring</p>
      </div>

      <div class="stat-card animate-up stagger-3">
        <div class="flex items-center justify-between mb-0.5">
          <span class="stat-lbl">Stock value</span>
          <div class="size-6 rounded-md bg-n-100 flex items-center justify-center">
            <Icon name="lucide:package" class="size-3 text-n-400" />
          </div>
        </div>
        <p class="stat-num">€{{ products.totalInventoryValue.toFixed(0) }}</p>
        <p class="text-xs text-n-400 mt-0.5">{{ products.products.length }} products</p>
      </div>

      <div class="stat-card animate-up stagger-4" :class="products.lowStockProducts.length > 0 ? 'border-danger-200 bg-danger-50/20' : ''">
        <div class="flex items-center justify-between mb-0.5">
          <span class="stat-lbl">Low stock</span>
          <div class="size-6 rounded-md flex items-center justify-center" :class="products.lowStockProducts.length ? 'bg-danger-50' : 'bg-n-100'">
            <Icon name="lucide:package-minus" class="size-3" :class="products.lowStockProducts.length ? 'text-danger-500' : 'text-n-400'" />
          </div>
        </div>
        <p class="stat-num" :class="products.lowStockProducts.length ? 'text-danger-600' : ''">
          {{ products.lowStockProducts.length }}
        </p>
        <p class="text-xs text-n-400 mt-0.5">item{{ products.lowStockProducts.length !== 1 ? 's' : '' }} to restock</p>
      </div>
    </div>

    <!-- Revenue chart -->
    <div class="card p-4 animate-up stagger-2">
      <div class="flex items-center justify-between mb-4">
        <h2 class="card-title">Revenue — last 14 days</h2>
        <NuxtLink to="/sales" class="text-xs font-bold text-g-500 hover:text-g-600">Full report →</NuxtLink>
      </div>
      <div class="h-40">
        <DashboardRevenueChart :data="sales.dailyRevenue" />
      </div>
    </div>

    <!-- Two-column: expiring + low stock -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="card overflow-hidden animate-up stagger-3">
        <div class="px-4 py-3 border-b border-n-100 flex items-center justify-between">
          <h2 class="card-title flex items-center gap-2">
            <span class="size-2 rounded-full bg-warn-400 animate-pulse-dot inline-block" />
            Expiring soon
          </h2>
          <NuxtLink to="/expiry" class="text-xs font-bold text-g-500">All →</NuxtLink>
        </div>
        <div v-if="!products.expiringThisWeek.length" class="px-4 py-8 text-center">
          <Icon name="lucide:check-circle" class="size-8 text-g-300 mx-auto mb-2" />
          <p class="text-sm text-n-400">Nothing expiring this week 🎉</p>
        </div>
        <div v-else class="divide-y divide-n-100">
          <div v-for="p in products.expiringThisWeek.slice(0,5)" :key="p.id" class="list-row">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-n-800 truncate">{{ p.name }}</p>
              <p class="text-xs text-n-400">{{ p.stock }} {{ p.unit }} · €{{ (p.stock*p.price).toFixed(2) }}</p>
            </div>
            <UiExpiryBadge :days="products.daysUntilExpiry(p)" />
          </div>
        </div>
      </div>

      <div class="card overflow-hidden animate-up stagger-4">
        <div class="px-4 py-3 border-b border-n-100 flex items-center justify-between">
          <h2 class="card-title flex items-center gap-2">
            <span class="size-2 rounded-full bg-danger-400 inline-block" />
            Low stock
          </h2>
          <NuxtLink to="/inventory" class="text-xs font-bold text-g-500">Manage →</NuxtLink>
        </div>
        <div v-if="!products.lowStockProducts.length" class="px-4 py-8 text-center">
          <Icon name="lucide:check-circle" class="size-8 text-g-300 mx-auto mb-2" />
          <p class="text-sm font-semibold text-g-600">All levels healthy ✓</p>
        </div>
        <div v-else class="divide-y divide-n-100">
          <div v-for="p in products.lowStockProducts.slice(0,5)" :key="p.id" class="list-row">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-n-800 truncate">{{ p.name }}</p>
              <p class="text-xs text-n-400">Min: {{ p.minStock }} {{ p.unit }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold font-mono text-danger-600">{{ p.stock }}</p>
              <p class="text-2xs text-n-400">{{ p.unit }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Insight -->
    <div class="card p-4 border-g-100 bg-gradient-to-br from-g-25 to-n-0 animate-up stagger-4">
      <div class="flex items-start gap-3">
        <div class="size-9 rounded-xl bg-g-100 flex items-center justify-center shrink-0">
          <Icon name="lucide:brain" class="size-4 text-g-600" />
        </div>
        <div>
          <p class="text-sm font-bold text-n-900">Smart insight</p>
          <p class="text-sm text-n-500 mt-0.5 leading-relaxed">{{ aiInsight }}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/stores/products'
import { useSalesStore } from '~/stores/sales'
import { format } from 'date-fns'

const products = useProductsStore()
const sales    = useSalesStore()

const today    = format(new Date(), 'EEE, d MMMM yyyy')
const greeting = computed(() => { const h = new Date().getHours(); return h < 12 ? 'morning ☀️' : h < 18 ? 'afternoon' : 'evening 🌙' })

const potentialRecovery = computed(() =>
  products.expiringThisWeek.reduce((s, p) => s + p.stock * p.price * (1 - products.suggestedDiscountPercent(p)/100), 0)
)

const aiInsight = computed(() => {
  if (products.expiredProducts.length)
    return `${products.expiredProducts.length} expired product(s) still on record. Remove them and log as waste to keep numbers clean.`
  if (products.reorderSuggestions.length) {
    const r = products.reorderSuggestions[0]
    return `${r.product.name} has ~${r.daysOfStock ?? '?'} days of stock left. Order ${r.suggestedQty} units from ${r.supplier?.name ?? 'supplier'} now — they need ${r.leadDays}d lead time.`
  }
  if (products.overorderedRisk.length) {
    const p = products.overorderedRisk[0]
    return `You're over-stocked on ${p.name} (${p.stock} units expiring in ${products.daysUntilExpiry(p)}d). Order less next time.`
  }
  const m = sales.marginThisMonth
  if (m > 0) return `Gross margin this month: ${m.toFixed(1)}%. ${m < 20 ? 'Industry avg is 20–25% — consider adjusting prices.' : 'Solid. Keep it up!'}`
  return 'Start recording sales to unlock AI-powered insights about your business.'
})
</script>
