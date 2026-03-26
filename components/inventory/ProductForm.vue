<template>
  <form class="p-5 space-y-4" @submit.prevent="save">
    <div class="grid grid-cols-2 gap-3">
      <div class="col-span-2">
        <label class="label">Product name *</label>
        <input v-model="f.name" class="input" required placeholder="e.g. Organic Whole Milk" />
      </div>
      <div>
        <label class="label">SKU</label>
        <input v-model="f.sku" class="input" placeholder="DAIRY-001" />
      </div>
      <div>
        <label class="label">Category *</label>
        <input v-model="f.category" class="input" list="cats-list" required />
        <datalist id="cats-list">
          <option v-for="c in store.categories" :key="c" :value="c" />
        </datalist>
      </div>
      <div>
        <label class="label">Cost price (€) *</label>
        <input v-model.number="f.cost" class="input" type="number" step="0.01" min="0" required />
      </div>
      <div>
        <label class="label">Selling price (€) *</label>
        <input v-model.number="f.price" class="input" type="number" step="0.01" min="0" required />
      </div>

      <!-- Live margin preview -->
      <div v-if="f.cost > 0 && f.price > 0" class="col-span-2 rounded-xl bg-g-50 border border-g-100 px-4 py-3 flex items-center justify-between">
        <span class="text-sm font-semibold text-g-700">Gross margin</span>
        <span class="text-sm font-bold text-g-700 font-mono">{{ margin }}% · €{{ marginAbs }}/unit</span>
      </div>

      <div>
        <label class="label">Current stock *</label>
        <input v-model.number="f.stock" class="input" type="number" min="0" required />
      </div>
      <div>
        <label class="label">Low stock alert at</label>
        <input v-model.number="f.minStock" class="input" type="number" min="0" />
      </div>
      <div>
        <label class="label">Max stock</label>
        <input v-model.number="f.maxStock" class="input" type="number" min="0" />
      </div>
      <div>
        <label class="label">Unit</label>
        <input v-model="f.unit" class="input" list="units-list" placeholder="piece, kg, bottle…" />
        <datalist id="units-list">
          <option value="piece"/><option value="kg"/><option value="bottle"/>
          <option value="pack"/><option value="loaf"/><option value="bag"/>
        </datalist>
      </div>
      <div>
        <label class="label">Avg daily sales</label>
        <input v-model.number="f.avgDailySales" class="input" type="number" min="0" step="0.1" placeholder="e.g. 5" />
      </div>
      <div>
        <label class="label">Expiry date</label>
        <input v-model="f.expiryDate" class="input" type="date" />
      </div>
      <div>
        <label class="label">Supplier</label>
        <select v-model="f.supplierId" class="input">
          <option value="">— None —</option>
          <option v-for="s in store.suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>
      <div>
        <label class="label">Location</label>
        <input v-model="f.location" class="input" placeholder="Fridge A1, Shelf B2…" />
      </div>
    </div>

    <div class="flex gap-2 pt-1">
      <button type="button" class="btn-secondary flex-1" @click="$emit('cancel')">Cancel</button>
      <button type="submit" class="btn-primary flex-1">
        <Icon name="lucide:check" class="size-4" />
        {{ product ? 'Save changes' : 'Add product' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useProductsStore, type Product } from '~/stores/products'
const props = defineProps<{ product?: Product | null }>()
const emit  = defineEmits(['saved', 'cancel'])
const store = useProductsStore()

const f = reactive({
  name: '', sku: '', category: '', cost: 0, price: 0,
  stock: 0, minStock: 10, maxStock: 50, unit: 'piece',
  avgDailySales: 0, expiryDate: '', supplierId: '', location: '',
})

onMounted(() => {
  if (props.product) Object.assign(f, {
    ...props.product,
    expiryDate: props.product.expiryDate ?? '',
    supplierId: props.product.supplierId ?? '',
  })
})

const margin    = computed(() => f.price > 0 ? ((f.price - f.cost) / f.price * 100).toFixed(1) : '0')
const marginAbs = computed(() => (f.price - f.cost).toFixed(2))

const save = () => {
  const data = { ...f, expiryDate: f.expiryDate || null, supplierId: f.supplierId || undefined }
  props.product ? store.updateProduct(props.product.id, data) : store.addProduct(data)
  emit('saved')
}
</script>
