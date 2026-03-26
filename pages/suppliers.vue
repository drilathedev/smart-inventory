<template>
  <div class="px-4 md:px-6 pt-5 pb-8 space-y-5">

    <div class="flex items-center justify-between gap-3 animate-up">
      <div>
        <h1 class="page-title">Suppliers & Reorder</h1>
        <p class="page-sub mt-0.5">AI-powered reorder suggestions based on sales speed.</p>
      </div>
      <button class="btn-primary" @click="showAdd = true">
        <Icon name="lucide:plus" class="size-4" />
        <span class="hidden sm:inline">Add supplier</span>
      </button>
    </div>

    <!-- Reorder suggestions — THE killer feature -->
    <div v-if="products.reorderSuggestions.length" class="card overflow-hidden border-g-200 animate-up stagger-1">
      <div class="px-4 py-3 bg-gradient-to-r from-g-25 to-n-0 border-b border-g-100 flex items-center justify-between">
        <h2 class="card-title text-g-800 flex items-center gap-2">
          <Icon name="lucide:brain" class="size-4 text-g-500" />
          AI Reorder Intelligence
        </h2>
        <span class="badge-red">{{ products.reorderSuggestions.length }} urgent</span>
      </div>

      <!-- Mobile cards -->
      <div class="md:hidden divide-y divide-n-100">
        <div v-for="r in products.reorderSuggestions" :key="r.product.id" class="p-4 space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-n-900">{{ r.product.name }}</p>
              <p class="text-xs text-n-400">{{ r.supplier?.name ?? 'No supplier set' }}</p>
            </div>
            <span class="badge text-2xs shrink-0"
              :class="(r.daysOfStock ?? 99) <= 1 ? 'badge-red' : (r.daysOfStock ?? 99) <= 3 ? 'badge-amber' : 'badge-gray'">
              {{ r.daysOfStock !== null ? `${r.daysOfStock}d left` : 'Low stock' }}
            </span>
          </div>
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="rounded-lg bg-n-50 border border-n-200 p-2">
              <p class="text-2xs text-n-400 font-semibold uppercase">Now</p>
              <p class="text-sm font-bold font-mono text-n-800 mt-0.5">{{ r.product.stock }}</p>
            </div>
            <div class="rounded-lg bg-g-50 border border-g-200 p-2">
              <p class="text-2xs text-g-500 font-semibold uppercase">Order</p>
              <p class="text-sm font-bold font-mono text-g-700 mt-0.5">+{{ r.suggestedQty }}</p>
            </div>
            <div class="rounded-lg bg-n-50 border border-n-200 p-2">
              <p class="text-2xs text-n-400 font-semibold uppercase">Lead</p>
              <p class="text-sm font-bold font-mono text-n-800 mt-0.5">{{ r.leadDays }}d</p>
            </div>
          </div>
          <div class="flex gap-2">
            <a v-if="r.supplier?.phone" :href="`tel:${r.supplier.phone}`" class="btn-secondary text-xs flex-1 py-2">
              <Icon name="lucide:phone" class="size-3.5" /> Call
            </a>
            <button v-if="r.supplier?.email" class="btn-primary text-xs flex-1 py-2" @click="emailOrder(r)">
              <Icon name="lucide:mail" class="size-3.5" /> Email order
            </button>
            <p v-if="!r.supplier" class="text-xs text-n-400 italic py-2 flex-1 text-center">No supplier set</p>
          </div>
        </div>
      </div>

      <!-- Desktop table -->
      <div class="hidden md:block overflow-x-hidden">
        <table class="w-full table-fixed">
          <thead class="bg-n-25 border-b border-n-100">
            <tr>
              <th class="table-th text-left px-5 py-3">Product</th>
              <th class="table-th text-left px-4 py-3">Supplier</th>
              <th class="table-th text-right px-4 py-3">In stock</th>
              <th class="table-th text-right px-4 py-3">Days left</th>
              <th class="table-th text-right px-4 py-3">Order qty</th>
              <th class="table-th text-right px-4 py-3">Lead time</th>
              <th class="table-th text-center px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-n-100">
            <tr v-for="r in products.reorderSuggestions" :key="r.product.id" class="hover:bg-n-25 transition-colors">
              <td class="px-5 py-3">
                <p class="text-sm font-bold text-n-800">{{ r.product.name }}</p>
                <p class="text-2xs text-n-400 font-mono">{{ r.product.sku }}</p>
              </td>
              <td class="px-4 py-3 text-sm text-n-600">{{ r.supplier?.name ?? '—' }}</td>
              <td class="px-4 py-3 text-right">
                <UiStockBadge :stock="r.product.stock" :minStock="r.product.minStock" :unit="r.product.unit" />
              </td>
              <td class="px-4 py-3 text-right">
                <span class="text-sm font-bold font-mono"
                  :class="(r.daysOfStock ?? 99) <= 1 ? 'text-danger-600' : (r.daysOfStock ?? 99) <= 3 ? 'text-warn-600' : 'text-n-600'">
                  {{ r.daysOfStock !== null ? `${r.daysOfStock}d` : '—' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right text-sm font-bold font-mono text-g-600">+{{ r.suggestedQty }}</td>
              <td class="px-4 py-3 text-right text-sm text-n-500">{{ r.leadDays }}d</td>
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <a v-if="r.supplier?.phone" :href="`tel:${r.supplier.phone}`" class="btn-secondary text-xs py-1.5 px-3">
                    <Icon name="lucide:phone" class="size-3.5" /> Call
                  </a>
                  <button v-if="r.supplier?.email" class="btn-primary text-xs py-1.5 px-3" @click="emailOrder(r)">
                    <Icon name="lucide:mail" class="size-3.5" /> Email
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="card p-8 text-center animate-up stagger-1">
      <Icon name="lucide:check-circle" class="size-12 text-g-300 mx-auto mb-3" />
      <p class="text-base font-bold text-n-700">All stock levels healthy</p>
      <p class="text-sm text-n-400 mt-1">No reorders needed based on current sales velocity.</p>
    </div>

    <!-- Supplier list -->
    <div class="card overflow-hidden animate-up stagger-2">
      <div class="px-4 py-3 border-b border-n-100">
        <h2 class="card-title">Your suppliers</h2>
      </div>
      <div class="divide-y divide-n-100">
        <div v-for="s in products.suppliers" :key="s.id" class="list-row">
          <div class="size-9 rounded-xl bg-g-50 border border-g-100 flex items-center justify-center shrink-0">
            <Icon name="lucide:truck" class="size-4 text-g-500" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-n-800">{{ s.name }}</p>
            <p class="text-xs text-n-400">{{ s.leadDays }}d lead time · {{ s.email ?? 'No email' }}</p>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <a v-if="s.phone" :href="`tel:${s.phone}`" class="btn-icon size-8 rounded-lg text-g-500 hover:bg-g-50">
              <Icon name="lucide:phone" class="size-4" />
            </a>
            <a v-if="s.email" :href="`mailto:${s.email}`" class="btn-icon size-8 rounded-lg text-g-500 hover:bg-g-50">
              <Icon name="lucide:mail" class="size-4" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Add supplier modal -->
    <UiModal :show="showAdd" title="Add supplier" @close="showAdd = false">
      <form class="p-5 space-y-3" @submit.prevent="saveSupplier">
        <div>
          <label class="label">Name *</label>
          <input v-model="sf.name" class="input" required placeholder="FreshFarm Co" />
        </div>
        <div>
          <label class="label">Phone</label>
          <input v-model="sf.phone" class="input" type="tel" placeholder="+355 69 000 0000" />
        </div>
        <div>
          <label class="label">Email</label>
          <input v-model="sf.email" class="input" type="email" placeholder="orders@supplier.com" />
        </div>
        <div>
          <label class="label">Lead time (days)</label>
          <input v-model.number="sf.leadDays" class="input" type="number" min="0" max="30" />
        </div>
        <div class="flex gap-2 pt-1">
          <button type="button" class="btn-secondary flex-1" @click="showAdd = false">Cancel</button>
          <button type="submit" class="btn-primary flex-1">
            <Icon name="lucide:check" class="size-4" /> Save supplier
          </button>
        </div>
      </form>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/stores/products'
import { useUIStore } from '~/stores/ui'

const products = useProductsStore()
const ui = useUIStore()
const showAdd = ref(false)
const sf = reactive({ name: '', phone: '', email: '', leadDays: 1 })

const saveSupplier = () => {
  products.addSupplier({ ...sf })
  Object.assign(sf, { name: '', phone: '', email: '', leadDays: 1 })
  showAdd.value = false
  ui.showToast('Supplier added')
}

const emailOrder = (r: any) => {
  const subject = encodeURIComponent(`Reorder: ${r.product.name}`)
  const body = encodeURIComponent(
    `Hi ${r.supplier?.name ?? 'team'},\n\nPlease send us the following:\n\n` +
    `Product: ${r.product.name}\nSKU: ${r.product.sku}\n` +
    `Quantity: ${r.suggestedQty} ${r.product.unit}\n\n` +
    `Current stock: ${r.product.stock} ${r.product.unit}\n\nThank you!`
  )
  window.open(`mailto:${r.supplier?.email}?subject=${subject}&body=${body}`)
}
</script>
