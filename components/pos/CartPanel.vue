<template>
  <div class="flex flex-col h-full">

    <!-- Header -->
    <div class="px-4 py-3.5 border-b border-n-100 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2">
        <h2 class="card-title">Cart</h2>
        <span v-if="sales.cartCount" class="badge-green">{{ sales.cartCount }}</span>
      </div>
      <div class="flex items-center gap-1">
        <button v-if="sales.cart.length" class="btn-ghost text-xs py-1.5 text-danger-500 hover:bg-danger-50" @click="sales.clearCart()">
          Clear all
        </button>
        <button v-if="$attrs.onClose" class="btn-icon size-8" @click="$emit('close')">
          <Icon name="lucide:x" class="size-4" />
        </button>
      </div>
    </div>

    <!-- Items -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="!sales.cart.length" class="flex flex-col items-center justify-center h-full py-12 text-center">
        <div class="size-16 rounded-2xl bg-n-100 flex items-center justify-center mb-3">
          <Icon name="lucide:shopping-cart" class="size-7 text-n-300" />
        </div>
        <p class="text-sm font-semibold text-n-500">Cart is empty</p>
        <p class="text-xs text-n-300 mt-1">Tap a product to add it</p>
      </div>

      <TransitionGroup name="item" tag="div" class="divide-y divide-n-100">
        <div v-for="item in sales.cart" :key="item.cartId" class="flex items-center gap-3 px-4 py-3">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-n-800 truncate">{{ item.productName }}</p>
            <p class="text-xs text-n-400 font-mono">€{{ item.price.toFixed(2) }} each</p>
          </div>
          <!-- Qty stepper -->
          <div class="flex items-center rounded-lg bg-n-100 overflow-hidden shrink-0">
            <button class="size-8 flex items-center justify-center hover:bg-n-200 transition-colors active:bg-n-300"
              @click="sales.updateCartQty(item.cartId, item.quantity-1)">
              <Icon name="lucide:minus" class="size-3" />
            </button>
            <span class="w-8 text-center text-sm font-bold font-mono">{{ item.quantity }}</span>
            <button class="size-8 flex items-center justify-center hover:bg-n-200 transition-colors active:bg-n-300"
              @click="sales.updateCartQty(item.cartId, item.quantity+1)">
              <Icon name="lucide:plus" class="size-3" />
            </button>
          </div>
          <p class="w-14 text-right text-sm font-bold font-mono text-n-800 shrink-0">
            €{{ (item.price*item.quantity).toFixed(2) }}
          </p>
        </div>
      </TransitionGroup>
    </div>

    <!-- Checkout area -->
    <div class="border-t border-n-100 px-4 pt-3 pb-4 pb-safe space-y-3 shrink-0 bg-n-25">
      <!-- Totals -->
      <div class="space-y-1.5">
        <div class="flex justify-between text-sm text-n-500"><span>Subtotal</span><span class="font-mono">€{{ sales.cartTotal.toFixed(2) }}</span></div>
        <div class="flex justify-between text-sm font-semibold text-g-600"><span>Profit</span><span class="font-mono">€{{ sales.cartProfit.toFixed(2) }}</span></div>
        <div class="flex justify-between text-lg font-bold text-n-900 pt-1.5 border-t border-n-200">
          <span>Total</span><span class="font-mono">€{{ sales.cartTotal.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Payment method -->
      <div class="grid grid-cols-2 gap-2">
        <button
          class="flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-sm font-bold transition-all"
          :class="method==='cash' ? 'border-g-400 bg-g-50 text-g-700' : 'border-n-200 text-n-500 hover:border-n-300 bg-n-0'"
          @click="method='cash'"
        >
          <Icon name="lucide:banknote" class="size-5" /> Cash
        </button>
        <button
          class="flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-sm font-bold transition-all"
          :class="method==='card' ? 'border-g-400 bg-g-50 text-g-700' : 'border-n-200 text-n-500 hover:border-n-300 bg-n-0'"
          @click="method='card'"
        >
          <Icon name="lucide:credit-card" class="size-5" /> Card
        </button>
      </div>

      <button
        class="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-g-500 text-white font-bold text-base shadow-green hover:bg-g-600 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none"
        :disabled="!sales.cart.length"
        @click="checkout"
      >
        <Icon name="lucide:check-circle" class="size-5" />
        Charge €{{ sales.cartTotal.toFixed(2) }}
      </button>
    </div>

    <!-- Receipt modal -->
    <UiModal :show="showReceipt" title="Payment received ✓" @close="closeReceipt">
      <div class="p-5 space-y-4">
        <div class="flex justify-center">
          <div class="size-20 rounded-3xl bg-g-50 border-2 border-g-200 flex items-center justify-center animate-pop">
            <Icon name="lucide:check" class="size-9 text-g-500" />
          </div>
        </div>
        <div v-if="lastSale" class="card-flush divide-y divide-n-100 overflow-hidden">
          <div v-for="item in lastSale.items" :key="item.productId" class="flex justify-between px-4 py-2.5 text-sm">
            <span class="text-n-600">{{ item.productName }} ×{{ item.quantity }}</span>
            <span class="font-mono font-semibold">€{{ (item.price*item.quantity).toFixed(2) }}</span>
          </div>
          <div class="flex justify-between px-4 py-3 font-bold text-base">
            <span>Total</span><span class="font-mono">€{{ lastSale.total.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between px-4 py-2.5 text-sm font-semibold text-g-600">
            <span>Profit on this sale</span><span class="font-mono">€{{ lastSale.profit.toFixed(2) }}</span>
          </div>
        </div>
        <button class="btn-primary w-full py-3.5 text-base" @click="closeReceipt">
          <Icon name="lucide:plus" class="size-5" /> New sale
        </button>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { useSalesStore, type Sale } from '~/stores/sales'
import { useUIStore } from '~/stores/ui'

const emit = defineEmits(['checkout-done','close'])
const sales = useSalesStore()
const ui    = useUIStore()

const method      = ref<'cash'|'card'>('card')
const showReceipt = ref(false)
const lastSale    = ref<Sale|null>(null)

const checkout = () => {
  const s = sales.checkout(method.value)
  if (s) { lastSale.value = s; showReceipt.value = true; ui.showToast(`€${s.total.toFixed(2)} charged!`) }
}
const closeReceipt = () => { showReceipt.value = false; emit('checkout-done') }
</script>

<style scoped>
.item-enter-active,.item-leave-active { transition: all 0.2s ease; }
.item-enter-from { opacity:0; transform:translateX(-8px); }
.item-leave-to   { opacity:0; transform:translateX(8px); }
</style>
