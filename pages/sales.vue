<template>
  <div class="px-4 md:px-6 pt-5 pb-8 space-y-5">

    <div class="flex items-center justify-between gap-3 animate-up">
      <div>
        <h1 class="page-title">Sales & Analytics</h1>
        <p class="page-sub mt-0.5">Track performance, understand revenue.</p>
      </div>
      <button class="btn-secondary text-xs" @click="showExport = true">
        <Icon name="lucide:download" class="size-3.5" /> PDF Report
      </button>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 animate-up stagger-1">
      <div class="stat-card">
        <p class="stat-lbl">Today</p>
        <p class="stat-num">€{{ sales.revenueToday.toFixed(2) }}</p>
        <p class="text-xs text-n-400">{{ sales.salesToday.length }} sales</p>
      </div>
      <div class="stat-card">
        <p class="stat-lbl">This week</p>
        <p class="stat-num">€{{ sales.revenueThisWeek.toFixed(2) }}</p>
        <p class="text-xs text-n-400">{{ sales.salesThisWeek.length }} sales</p>
      </div>
      <div class="stat-card">
        <p class="stat-lbl">This month</p>
        <p class="stat-num">€{{ sales.revenueThisMonth.toFixed(2) }}</p>
        <p class="text-xs text-n-400">{{ sales.salesThisMonth.length }} sales</p>
      </div>
      <div class="stat-card border-g-100">
        <p class="stat-lbl text-g-500">Margin</p>
        <p class="stat-num text-g-700">{{ sales.marginThisMonth.toFixed(1) }}%</p>
        <p class="text-xs text-n-400">€{{ sales.profitThisMonth.toFixed(0) }} profit</p>
      </div>
    </div>

    <!-- Chart + peak hours -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 animate-up stagger-2">
      <div class="card p-4 md:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h2 class="card-title">Revenue — last 14 days</h2>
        </div>
        <div class="h-48">
          <DashboardRevenueChart :data="sales.dailyRevenue" />
        </div>
      </div>

      <div class="card p-4">
        <h2 class="card-title mb-3">Peak hours this week</h2>
        <div class="space-y-1.5">
          <div v-for="slot in peakHours" :key="slot.label" class="flex items-center gap-2">
            <span class="text-2xs font-mono text-n-400 w-10 shrink-0">{{ slot.label }}</span>
            <div class="flex-1 h-2 bg-n-100 rounded-full overflow-hidden">
              <div class="h-full bg-g-400 rounded-full transition-all duration-700"
                :style="{ width: slot.pct + '%', opacity: slot.pct > 0 ? Math.max(0.3, slot.pct / 100) + 0.3 : 0 }" />
            </div>
            <span class="text-2xs font-mono text-n-400 w-6 text-right shrink-0">{{ slot.count }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Top products + recent sales -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 animate-up stagger-3">
      <div class="card p-4">
        <h2 class="card-title mb-4">Top sellers this month</h2>
        <div v-if="!sales.topProducts.length" class="py-6 text-center text-sm text-n-300">No sales yet</div>
        <div class="space-y-3">
          <div v-for="(item, i) in sales.topProducts" :key="item.id" class="flex items-center gap-2.5">
            <span class="text-xs font-mono text-n-200 w-4 shrink-0">{{ i + 1 }}</span>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-n-800 truncate">{{ item.name }}</p>
              <div class="h-1.5 bg-n-100 rounded-full mt-1 overflow-hidden">
                <div class="h-full bg-g-400 rounded-full transition-all duration-700"
                  :style="{ width: `${(item.revenue / (sales.topProducts[0]?.revenue || 1)) * 100}%` }" />
              </div>
              <p class="text-2xs text-n-400 mt-0.5">{{ item.quantity }} units</p>
            </div>
            <span class="text-xs font-bold font-mono text-n-600 shrink-0">€{{ item.revenue.toFixed(0) }}</span>
          </div>
        </div>
      </div>

      <div class="card overflow-hidden md:col-span-2">
        <div class="px-4 py-3 border-b border-n-100 flex items-center justify-between">
          <h2 class="card-title">Recent transactions</h2>
          <span class="badge-gray">{{ sales.sales.length }} total</span>
        </div>
        <div class="overflow-x-hidden">
          <table class="w-full table-fixed">
            <thead class="bg-n-25 border-b border-n-100">
              <tr>
                <th class="table-th text-left px-4 py-2.5">Time</th>
                <th class="table-th text-left px-4 py-2.5">Items</th>
                <th class="table-th text-left px-4 py-2.5">Method</th>
                <th class="table-th text-right px-4 py-2.5">Total</th>
                <th class="table-th text-right px-4 py-2.5">Profit</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-n-100">
              <tr v-for="sale in recentSales" :key="sale.id" class="hover:bg-n-25 transition-colors">
                <td class="px-4 py-2.5">
                  <p class="text-xs font-semibold text-n-700">{{ fDate(sale.date) }}</p>
                  <p class="text-2xs text-n-400">{{ fTime(sale.date) }}</p>
                </td>
                <td class="px-4 py-2.5 text-xs text-n-600">{{ sale.items.length }} item(s)</td>
                <td class="px-4 py-2.5">
                  <span class="badge-gray">{{ sale.paymentMethod }}</span>
                </td>
                <td class="px-4 py-2.5 text-right text-sm font-bold font-mono text-n-800">€{{ sale.total.toFixed(2) }}</td>
                <td class="px-4 py-2.5 text-right text-sm font-semibold font-mono text-g-600">€{{ sale.profit.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- PDF Export modal -->
    <UiModal :show="showExport" title="Export P&L Report" subtitle="Generate a printable daily summary" @close="showExport = false">
      <div class="p-5 space-y-4">
        <div>
          <label class="label">Report period</label>
          <select class="input">
            <option>This month</option>
            <option>This week</option>
            <option>Today</option>
          </select>
        </div>
        <div class="card-flush divide-y divide-n-100 overflow-hidden text-sm">
          <div class="flex justify-between px-4 py-3"><span class="text-n-500">Revenue</span><span class="font-mono font-bold">€{{ sales.revenueThisMonth.toFixed(2) }}</span></div>
          <div class="flex justify-between px-4 py-3"><span class="text-n-500">Cost of goods</span><span class="font-mono text-danger-600">−€{{ (sales.revenueThisMonth - sales.profitThisMonth).toFixed(2) }}</span></div>
          <div class="flex justify-between px-4 py-3 font-bold"><span>Gross profit</span><span class="font-mono text-g-600">€{{ sales.profitThisMonth.toFixed(2) }}</span></div>
          <div class="flex justify-between px-4 py-3 text-xs text-n-400"><span>Margin</span><span class="font-mono">{{ sales.marginThisMonth.toFixed(1) }}%</span></div>
        </div>
        <div class="flex gap-2">
          <button class="btn-secondary flex-1" @click="showExport = false">Cancel</button>
          <button class="btn-primary flex-1" @click="downloadReport">
            <Icon name="lucide:printer" class="size-4" /> Print / Save PDF
          </button>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { useSalesStore } from '~/stores/sales'
import { useProductsStore } from '~/stores/products'
import { useUIStore } from '~/stores/ui'
import { format } from 'date-fns'

const sales    = useSalesStore()
const products = useProductsStore()
const ui       = useUIStore()

const showExport  = ref(false)
const recentSales = computed(() => sales.sales.slice(0, 20))
const fDate = (d: string) => format(new Date(d), 'd MMM')
const fTime = (d: string) => format(new Date(d), 'HH:mm')

const peakHours = computed(() => {
  const hrs = sales.salesByHour
  const max = Math.max(...hrs.map(h => h.count), 1)
  return [8,9,10,11,12,13,14,15,16,17,18,19,20].map(h => ({
    label: `${h}:00`,
    count: hrs[h].count,
    pct: Math.round((hrs[h].count / max) * 100),
  }))
})

const downloadReport = () => {
  const html = `<!DOCTYPE html><html><head><title>SmartStock P&L</title>
<style>body{font-family:system-ui,sans-serif;max-width:600px;margin:40px auto;color:#1a1714}
h1{color:#2F6B3F;font-size:22px;margin-bottom:4px}
.meta{color:#857d72;font-size:13px;margin-bottom:28px}
.row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f2efec;font-size:14px}
.row.total{font-weight:700;font-size:16px;border-top:2px solid #1a1714;border-bottom:none;margin-top:8px;padding-top:12px}
.green{color:#2F6B3F}.red{color:#ef4444}
h2{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#857d72;margin:24px 0 8px}
</style></head><body>
<h1>SmartStock — Profit & Loss</h1>
<p class="meta">Generated ${format(new Date(), 'd MMMM yyyy, HH:mm')} · This month</p>
<h2>Revenue Summary</h2>
<div class="row"><span>Gross Revenue</span><span>€${sales.revenueThisMonth.toFixed(2)}</span></div>
<div class="row"><span>Cost of Goods Sold</span><span class="red">−€${(sales.revenueThisMonth - sales.profitThisMonth).toFixed(2)}</span></div>
<div class="row total"><span>Gross Profit</span><span class="green">€${sales.profitThisMonth.toFixed(2)}</span></div>
<div class="row"><span>Gross Margin</span><span>${sales.marginThisMonth.toFixed(1)}%</span></div>
<div class="row"><span>Transactions</span><span>${sales.salesThisMonth.length}</span></div>
<h2>Top Products</h2>
${sales.topProducts.map((p, i) => `<div class="row"><span>${i+1}. ${p.name}</span><span>€${p.revenue.toFixed(2)}</span></div>`).join('')}
<h2>Inventory Alerts</h2>
<div class="row"><span>Expiring this week</span><span class="red">${products.expiringThisWeek.length} products · €${products.expiryValueThisWeek.toFixed(2)}</span></div>
<div class="row"><span>Low stock items</span><span>${products.lowStockProducts.length}</span></div>
</body></html>`
  const w = window.open('', '_blank')
  if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 400) }
  showExport.value = false
  ui.showToast('Report ready to print')
}
</script>
