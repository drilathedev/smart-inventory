<template>
  <div class="p-5 space-y-4">
    <!-- Product info -->
    <div class="rounded-xl bg-n-50 border border-n-200 p-3.5 flex items-center justify-between">
      <div>
        <p class="text-sm font-bold text-n-900">{{ product.name }}</p>
        <p class="text-xs text-n-400 mt-0.5">Current: <span class="font-mono font-bold text-n-700">{{ product.stock }} {{ product.unit }}</span></p>
      </div>
      <UiStockBadge :stock="product.stock" :minStock="product.minStock" :unit="product.unit" />
    </div>

    <!-- Type selector -->
    <div class="grid grid-cols-2 gap-2">
      <button
        v-for="t in types" :key="t.value" type="button"
        class="flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 text-sm font-semibold transition-all"
        :class="type === t.value
          ? 'border-g-400 bg-g-50 text-g-700'
          : 'border-n-200 text-n-500 hover:border-n-300 bg-n-0'"
        @click="type = t.value"
      >
        <Icon :name="t.icon" class="size-5" />
        {{ t.label }}
      </button>
    </div>

    <div>
      <label class="label">Quantity ({{ product.unit }})</label>
      <input v-model.number="qty" class="input text-center text-lg font-bold font-mono" type="number" min="1" />
    </div>

    <div>
      <label class="label">Note (optional)</label>
      <input v-model="note" class="input" placeholder="Reason for adjustment…" />
    </div>

    <!-- Preview -->
    <div class="rounded-xl bg-n-50 border border-n-200 px-4 py-3 flex items-center justify-between">
      <span class="text-sm text-n-500">New stock level</span>
      <span class="text-lg font-bold font-mono" :class="newStock < product.minStock ? 'text-danger-600' : 'text-n-900'">
        {{ newStock }} {{ product.unit }}
      </span>
    </div>

    <div class="flex gap-2">
      <button class="btn-secondary flex-1" @click="$emit('saved')">Cancel</button>
      <button class="btn-primary flex-1" :disabled="qty <= 0" @click="save">
        <Icon name="lucide:check" class="size-4" /> Apply
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductsStore, type Product } from '~/stores/products'
import { useUIStore } from '~/stores/ui'

const props = defineProps<{ product: Product }>()
const emit  = defineEmits(['saved'])
const store = useProductsStore()
const ui    = useUIStore()

const type = ref<'in' | 'out' | 'adjustment' | 'waste'>('in')
const qty  = ref(1)
const note = ref('')

const types = [
  { value: 'in',         label: 'Stock in',      icon: 'lucide:package-plus' },
  { value: 'out',        label: 'Stock out',     icon: 'lucide:package-minus' },
  { value: 'waste',      label: 'Waste/expired', icon: 'lucide:trash-2' },
  { value: 'adjustment', label: 'Adjustment',    icon: 'lucide:sliders-horizontal' },
]

const newStock = computed(() =>
  type.value === 'in' ? props.product.stock + qty.value : Math.max(0, props.product.stock - qty.value)
)

const save = () => {
  store.adjustStock(props.product.id, qty.value, type.value, note.value)
  ui.showToast('Stock updated')
  emit('saved')
}
</script>
