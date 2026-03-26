<template>
  <div class="px-4 md:px-6 pt-5 pb-8 space-y-4">

    <div class="flex items-center justify-between animate-up">
      <div>
        <h1 class="page-title">Inventory</h1>
        <p class="page-sub">{{ filtered.length }} products · €{{ products.totalInventoryValue.toFixed(0) }} cost value</p>
      </div>
      <button class="btn-primary" @click="openAdd">
        <Icon name="lucide:plus" class="size-4" />
        <span class="hidden sm:inline">Add product</span>
      </button>
    </div>

    <!-- Filter bar -->
    <div class="card p-3 flex flex-wrap gap-2 animate-up stagger-1">
      <div class="relative flex-1 min-w-44">
        <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-n-300" />
        <input v-model="search" class="input-sm pl-8 pr-3" placeholder="Search products…" />
      </div>
      <select v-model="catFilter"    class="input-sm w-auto"><option value="">All categories</option><option v-for="c in products.categories" :key="c" :value="c">{{ c }}</option></select>
      <select v-model="stockFilter"  class="input-sm w-auto"><option value="">All stock</option><option value="low">Low / out</option><option value="ok">Healthy</option></select>
      <select v-model="expiryFilter" class="input-sm w-auto"><option value="">All expiry</option><option value="expired">Expired</option><option value="critical">≤ 2 days</option><option value="warning">This week</option></select>
    </div>

    <!-- Mobile cards -->
    <div class="md:hidden space-y-2 animate-up stagger-2">
      <div v-for="p in paginated" :key="p.id"
        class="card overflow-hidden"
        :class="products.expiryStatus(p)==='expired' ? 'border-danger-200' : ''">
        <div class="p-4">
          <div class="flex items-start gap-3">
            <div class="size-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0" :class="catColor(p.category)">
              {{ p.name.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <p class="text-sm font-bold text-n-900 leading-snug">{{ p.name }}</p>
                <UiExpiryBadge v-if="p.expiryDate" :days="products.daysUntilExpiry(p)" />
              </div>
              <p class="text-2xs text-n-400 font-mono mt-0.5">{{ p.sku }}</p>
              <div class="flex items-center gap-2 mt-2 flex-wrap">
                <UiStockBadge :stock="p.stock" :minStock="p.minStock" :unit="p.unit" />
                <span class="text-xs font-bold font-mono text-n-700">€{{ p.price.toFixed(2) }}</span>
                <span class="text-xs font-semibold" :class="marginPct(p) >= 20 ? 'text-g-500' : 'text-warn-600'">{{ marginPct(p) }}% margin</span>
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-3 border-t border-n-100 divide-x divide-n-100">
          <button class="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-n-500 hover:bg-n-50 transition-colors" @click="openEdit(p)">
            <Icon name="lucide:pencil" class="size-3.5" /> Edit
          </button>
          <button class="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-g-600 hover:bg-g-25 transition-colors" @click="openStock(p)">
            <Icon name="lucide:layers" class="size-3.5" /> Stock
          </button>
          <button class="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-danger-500 hover:bg-danger-50 transition-colors" @click="confirmDelete(p)">
            <Icon name="lucide:trash-2" class="size-3.5" /> Delete
          </button>
        </div>
      </div>
      <div v-if="!paginated.length" class="py-16 text-center">
        <Icon name="lucide:package-search" class="size-12 text-n-200 mx-auto mb-3" />
        <p class="text-sm text-n-400">No products match your filters</p>
      </div>
    </div>

    <!-- Desktop table -->
    <div class="hidden md:block card overflow-hidden animate-up stagger-2">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-n-25 border-b border-n-200">
            <tr>
              <th class="table-th text-left px-5 py-3">Product</th>
              <th class="table-th text-left px-4 py-3">Category</th>
              <th class="table-th text-right px-4 py-3">Stock</th>
              <th class="table-th text-right px-4 py-3">Price / Cost</th>
              <th class="table-th text-right px-4 py-3">Margin</th>
              <th class="table-th text-right px-4 py-3">Retail value</th>
              <th class="table-th text-left px-4 py-3">Expiry</th>
              <th class="px-4 py-3 w-20" />
            </tr>
          </thead>
          <tbody class="divide-y divide-n-100">
            <tr v-for="p in paginated" :key="p.id"
              class="hover:bg-n-25 transition-colors group"
              :class="products.expiryStatus(p)==='expired' ? 'bg-danger-50/40' : ''">
              <td class="px-5 py-3">
                <div class="flex items-center gap-3">
                  <div class="size-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" :class="catColor(p.category)">
                    {{ p.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-n-800">{{ p.name }}</p>
                    <p class="text-2xs text-n-400 font-mono">{{ p.sku }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3"><span class="badge-gray">{{ p.category }}</span></td>
              <td class="px-4 py-3 text-right"><UiStockBadge :stock="p.stock" :minStock="p.minStock" :unit="p.unit" /></td>
              <td class="px-4 py-3 text-right">
                <p class="text-sm font-mono font-semibold text-n-800">€{{ p.price.toFixed(2) }}</p>
                <p class="text-2xs text-n-400 font-mono">€{{ p.cost.toFixed(2) }}</p>
              </td>
              <td class="px-4 py-3 text-right">
                <span class="text-sm font-bold font-mono" :class="marginPct(p)>=20?'text-g-600':'text-warn-600'">{{ marginPct(p) }}%</span>
              </td>
              <td class="px-4 py-3 text-right text-sm font-mono text-n-600">€{{ (p.stock*p.price).toFixed(2) }}</td>
              <td class="px-4 py-3"><UiExpiryBadge :days="products.daysUntilExpiry(p)" /></td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-0.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <button class="btn-icon size-7 rounded-md" @click="openEdit(p)"><Icon name="lucide:pencil" class="size-3.5" /></button>
                  <button class="btn-icon size-7 rounded-md text-g-500" @click="openStock(p)"><Icon name="lucide:layers" class="size-3.5" /></button>
                  <button class="btn-icon size-7 rounded-md text-danger-400" @click="confirmDelete(p)"><Icon name="lucide:trash-2" class="size-3.5" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!paginated.length" class="py-16 text-center">
          <Icon name="lucide:package-search" class="size-10 text-n-200 mx-auto mb-2" />
          <p class="text-sm text-n-300">No products match your filters</p>
        </div>
      </div>
      <div v-if="totalPages > 1" class="flex items-center justify-between px-5 py-3 border-t border-n-100 bg-n-25">
        <p class="text-xs text-n-400">{{ (page-1)*perPage+1 }}–{{ Math.min(page*perPage, filtered.length) }} of {{ filtered.length }}</p>
        <div class="flex gap-1">
          <button class="btn-icon size-7 rounded-md" :disabled="page===1" @click="page--"><Icon name="lucide:chevron-left" class="size-3.5" /></button>
          <button v-for="n in totalPages" :key="n" class="size-7 rounded-md text-xs font-bold transition-colors"
            :class="n===page?'bg-g-500 text-white':'text-n-400 hover:bg-n-100'" @click="page=n">{{ n }}</button>
          <button class="btn-icon size-7 rounded-md" :disabled="page===totalPages" @click="page++"><Icon name="lucide:chevron-right" class="size-3.5" /></button>
        </div>
      </div>
    </div>

    <!-- Mobile pagination -->
    <div v-if="totalPages > 1" class="flex md:hidden justify-center gap-2 animate-up">
      <button class="btn-secondary py-2 px-3" :disabled="page===1" @click="page--"><Icon name="lucide:chevron-left" class="size-4" /></button>
      <span class="btn-secondary py-2 px-4">{{ page }} / {{ totalPages }}</span>
      <button class="btn-secondary py-2 px-3" :disabled="page===totalPages" @click="page++"><Icon name="lucide:chevron-right" class="size-4" /></button>
    </div>

    <!-- Mobile FAB -->
    <button class="fab md:hidden" @click="openAdd"><Icon name="lucide:plus" class="size-6" /></button>

    <!-- Modals -->
    <UiModal :show="showForm" :title="editing ? 'Edit product' : 'Add product'" subtitle="Keep your inventory accurate" @close="showForm=false">
      <InventoryProductForm :product="editing" @saved="onSaved" @cancel="showForm=false" />
    </UiModal>
    <UiModal :show="showStock" title="Adjust stock" :subtitle="stockProduct?.name" @close="showStock=false">
      <InventoryStockAdjustForm v-if="stockProduct" :product="stockProduct" @saved="showStock=false" />
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { useProductsStore, type Product } from '~/stores/products'
import { useUIStore } from '~/stores/ui'

const products = useProductsStore()
const ui = useUIStore()

const search = ref(''), catFilter = ref(''), stockFilter = ref(''), expiryFilter = ref('')
const page = ref(1), perPage = 15
const showForm = ref(false), showStock = ref(false)
const editing = ref<Product|null>(null), stockProduct = ref<Product|null>(null)

const filtered = computed(() => {
  let l = [...products.products]
  if (search.value)    { const q=search.value.toLowerCase(); l=l.filter(p=>p.name.toLowerCase().includes(q)||p.sku.toLowerCase().includes(q)) }
  if (catFilter.value) l=l.filter(p=>p.category===catFilter.value)
  if (stockFilter.value==='low') l=l.filter(p=>products.stockStatus(p)!=='ok')
  if (stockFilter.value==='ok')  l=l.filter(p=>products.stockStatus(p)==='ok')
  if (expiryFilter.value) l=l.filter(p=>products.expiryStatus(p)===expiryFilter.value)
  return l
})
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length/perPage)))
const paginated  = computed(() => filtered.value.slice((page.value-1)*perPage, page.value*perPage))
watch([search,catFilter,stockFilter,expiryFilter], () => { page.value=1 })

const openAdd   = () => { editing.value=null; showForm.value=true }
const openEdit  = (p: Product) => { editing.value=p; showForm.value=true }
const openStock = (p: Product) => { stockProduct.value=p; showStock.value=true }
const onSaved   = () => { showForm.value=false; ui.showToast(editing.value ? 'Product updated' : 'Product added') }
const confirmDelete = (p: Product) => {
  if (confirm(`Delete "${p.name}"?`)) { products.deleteProduct(p.id); ui.showToast('Product deleted','info') }
}
const marginPct = (p: Product) => p.price>0 ? Math.round((p.price-p.cost)/p.price*100) : 0
const catColor  = (c: string) => ({ 'Dairy':'bg-blue-50 text-blue-500','Bakery':'bg-warn-50 text-warn-600','Vegetables':'bg-g-50 text-g-600','Fruits':'bg-pink-50 text-pink-500','Meat & Deli':'bg-danger-50 text-danger-500','Fish & Seafood':'bg-cyan-50 text-cyan-600','Beverages':'bg-purple-50 text-purple-500','Pantry':'bg-n-100 text-n-500' }[c] ?? 'bg-n-100 text-n-500')
</script>
