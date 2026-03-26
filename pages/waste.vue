<template>
  <div class="px-4 md:px-6 pt-5 pb-8 space-y-5">

    <div class="animate-up">
      <h1 class="page-title">Waste Reduction</h1>
      <p class="page-sub mt-0.5">Every euro of waste is a euro off your profit.</p>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3 animate-up stagger-1">
      <div class="stat-card border-danger-200 bg-danger-50/30">
        <div class="size-8 rounded-lg bg-danger-100 flex items-center justify-center mb-1">
          <Icon name="lucide:trash-2" class="size-4 text-danger-500" />
        </div>
        <p class="stat-lbl text-danger-500">Total waste</p>
        <p class="stat-num text-danger-700">€{{ totalWasteValue.toFixed(0) }}</p>
        <p class="text-xs text-danger-400">{{ totalWasteUnits }} units lost</p>
      </div>
      <div class="stat-card border-warn-200 bg-warn-50/30">
        <div class="size-8 rounded-lg bg-warn-100 flex items-center justify-center mb-1">
          <Icon name="lucide:timer" class="size-4 text-warn-500" />
        </div>
        <p class="stat-lbl text-warn-600">At risk this week</p>
        <p class="stat-num text-warn-700">€{{ products.expiryValueThisWeek.toFixed(0) }}</p>
        <p class="text-xs text-warn-500">{{ products.expiringThisWeek.length }} products</p>
      </div>
      <div class="stat-card border-g-100 bg-g-25 col-span-2 md:col-span-1">
        <div class="size-8 rounded-lg bg-g-100 flex items-center justify-center mb-1">
          <Icon name="lucide:piggy-bank" class="size-4 text-g-500" />
        </div>
        <p class="stat-lbl text-g-600">Saveable now</p>
        <p class="stat-num text-g-700">€{{ saveable.toFixed(0) }}</p>
        <p class="text-xs text-g-400">apply discounts today</p>
      </div>
    </div>

    <!-- Smart recommendations -->
    <div class="card p-5 space-y-3 animate-up stagger-2">
      <h2 class="card-title flex items-center gap-2">
        <Icon name="lucide:lightbulb" class="size-4 text-g-500" /> Smart recommendations
      </h2>

      <div v-if="products.expiringThisWeek.length" class="alert-amber">
        <div class="flex items-start gap-3">
          <Icon name="lucide:zap" class="size-5 text-warn-500 mt-0.5 shrink-0" />
          <div>
            <p class="text-sm font-bold text-n-900">
              €{{ products.expiryValueThisWeek.toFixed(2) }} expiring this week
            </p>
            <p class="text-sm text-n-600 mt-0.5">
              Apply discounts now to recover <strong class="text-g-600">€{{ saveable.toFixed(2) }}</strong> instead of losing it.
            </p>
            <NuxtLink to="/expiry" class="inline-flex items-center gap-1.5 mt-2.5 text-xs font-bold text-warn-700 hover:text-warn-800">
              <Icon name="lucide:tag" class="size-3.5" /> Go to Expiry Tracker →
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-if="products.overorderedRisk.length" class="rounded-xl border border-n-200 bg-n-25 p-4">
        <div class="flex items-start gap-3">
          <Icon name="lucide:trending-down" class="size-5 text-g-500 mt-0.5 shrink-0" />
          <div>
            <p class="text-sm font-bold text-n-800">Stop over-ordering these products</p>
            <p class="text-sm text-n-500 mt-0.5 mb-2.5">High stock + fast expiry = guaranteed future waste.</p>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="p in products.overorderedRisk" :key="p.id" class="badge-gray">{{ p.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="alert-green">
        <div class="flex items-start gap-3">
          <Icon name="lucide:refresh-cw" class="size-5 text-g-500 mt-0.5 shrink-0" />
          <div>
            <p class="text-sm font-bold text-n-800">Rotate stock (FIFO)</p>
            <p class="text-sm text-n-500 mt-0.5">Always sell oldest stock first. This one habit cuts waste by 20–30%.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- WhatsApp alerts -->
    <div class="card p-5 border-green-200 bg-gradient-to-br from-green-50 to-n-0 animate-up stagger-3">
      <div class="flex items-start gap-3">
        <div class="size-10 rounded-xl bg-green-100 border border-green-200 flex items-center justify-center shrink-0">
          <Icon name="lucide:message-circle" class="size-5 text-green-600" />
        </div>
        <div class="flex-1">
          <p class="text-sm font-bold text-n-900">WhatsApp alerts</p>
          <p class="text-sm text-n-500 mt-0.5">Get notified when products are about to expire or run out.</p>
          <div class="flex gap-2 mt-3">
            <input v-model="waPhone" class="input-sm flex-1" type="tel" placeholder="+355 69 000 0000" />
            <button class="btn-primary text-xs py-2 px-4 shrink-0" @click="saveWA">Save</button>
          </div>
          <p class="text-2xs text-n-400 mt-2">
            Daily digest + urgent alerts via WhatsApp.
            <span class="text-g-600 font-semibold">Coming soon — save your number to be first.</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Waste log -->
    <div class="card overflow-hidden animate-up stagger-4">
      <div class="px-4 py-3 border-b border-n-100 flex items-center justify-between">
        <h2 class="card-title">Waste log</h2>
        <span class="badge-gray">{{ wasteMovements.length }} entries</span>
      </div>
      <div v-if="!wasteMovements.length" class="py-14 text-center">
        <Icon name="lucide:check-circle" class="size-12 text-g-200 mx-auto mb-3" />
        <p class="text-sm font-semibold text-n-500">No waste recorded yet</p>
        <p class="text-2xs text-n-300 mt-1">Use "Waste/expired" in stock adjustments to log losses</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-n-25 border-b border-n-100">
            <tr>
              <th class="table-th text-left px-4 py-2.5">Product</th>
              <th class="table-th text-right px-4 py-2.5">Qty</th>
              <th class="table-th text-right px-4 py-2.5">Cost lost</th>
              <th class="table-th text-left px-4 py-2.5">Note</th>
              <th class="table-th text-left px-4 py-2.5">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-n-100">
            <tr v-for="m in wasteMovements" :key="m.id" class="hover:bg-n-25 transition-colors">
              <td class="px-4 py-2.5 text-sm font-semibold text-n-800">{{ getName(m.productId) }}</td>
              <td class="px-4 py-2.5 text-right text-sm font-mono font-bold text-danger-600">−{{ m.quantity }}</td>
              <td class="px-4 py-2.5 text-right text-sm font-mono text-danger-500">€{{ getCost(m.productId, m.quantity).toFixed(2) }}</td>
              <td class="px-4 py-2.5 text-xs text-n-400">{{ m.note || '—' }}</td>
              <td class="px-4 py-2.5 text-xs text-n-400">{{ fDate(m.date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/stores/products'
import { useUIStore } from '~/stores/ui'
import { format } from 'date-fns'

const products = useProductsStore()
const ui = useUIStore()
const waPhone = ref('')

const wasteMovements = computed(() => products.movements.filter(m => m.type === 'waste'))
const totalWasteUnits = computed(() => wasteMovements.value.reduce((s, m) => s + m.quantity, 0))
const totalWasteValue = computed(() =>
  wasteMovements.value.reduce((sum, m) => {
    const p = products.getById(m.productId)
    return sum + (p ? p.cost * m.quantity : 0)
  }, 0)
)
const saveable = computed(() =>
  products.expiringThisWeek.reduce((sum, p) => {
    const d = products.suggestedDiscountPercent(p)
    return sum + p.stock * p.price * (1 - d / 100)
  }, 0)
)

const getName  = (id: string) => products.getById(id)?.name ?? 'Unknown'
const getCost  = (id: string, qty: number) => (products.getById(id)?.cost ?? 0) * qty
const fDate    = (d: string) => format(new Date(d), 'd MMM yyyy, HH:mm')
const saveWA   = () => { if (!waPhone.value) return; ui.showToast('Number saved — alerts coming soon!', 'info') }
</script>
