<template>
  <div class="px-4 md:px-6 pt-5 pb-8 max-w-2xl space-y-5">

    <div class="animate-up">
      <h1 class="page-title">Settings</h1>
      <p class="page-sub mt-0.5">Configure your SmartStock experience.</p>
    </div>

    <div class="card p-5 space-y-4 animate-up stagger-1">
      <h2 class="card-title border-b border-n-100 pb-3">Store</h2>
      <div class="grid grid-cols-2 gap-3">
        <div class="col-span-2">
          <label class="label">Store name</label>
          <input v-model="s.name" class="input" placeholder="My Market" />
        </div>
        <div>
          <label class="label">Currency</label>
          <select v-model="s.currency" class="input">
            <option value="EUR">€ Euro</option>
            <option value="USD">$ US Dollar</option>
            <option value="GBP">£ British Pound</option>
            <option value="ALL">L Albanian Lek</option>
          </select>
        </div>
        <div>
          <label class="label">Language</label>
          <select v-model="s.lang" class="input">
            <option value="en">English</option>
            <option value="sq">Albanian (Shqip)</option>
          </select>
        </div>
      </div>
    </div>

    <div class="card p-5 space-y-1 animate-up stagger-2">
      <h2 class="card-title border-b border-n-100 pb-3 mb-3">Alerts & notifications</h2>
      <div v-for="t in toggles" :key="t.key" class="flex items-center justify-between py-3 border-b border-n-50 last:border-0">
        <div class="flex-1 min-w-0 pr-4">
          <p class="text-sm font-semibold text-n-800">{{ t.label }}</p>
          <p class="text-xs text-n-400 mt-0.5">{{ t.desc }}</p>
        </div>
        <button
          class="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 focus:outline-none focus:ring-2 focus:ring-g-400 focus:ring-offset-2"
          :class="alerts[t.key] ? 'bg-g-500' : 'bg-n-200'"
          @click="alerts[t.key] = !alerts[t.key]"
        >
          <span class="absolute top-0.5 size-5 rounded-full bg-white shadow-md transition-transform duration-200"
            :class="alerts[t.key] ? 'translate-x-5' : 'translate-x-0.5'" />
        </button>
      </div>
    </div>

    <div class="card p-5 space-y-3 animate-up stagger-3">
      <h2 class="card-title border-b border-n-100 pb-3">Expiry thresholds</h2>
      <div class="grid grid-cols-3 gap-3">
        <div>
          <label class="label">Critical (days)</label>
          <input v-model.number="thresh.critical" class="input" type="number" min="1" />
        </div>
        <div>
          <label class="label">Warning (days)</label>
          <input v-model.number="thresh.warning" class="input" type="number" min="1" />
        </div>
        <div>
          <label class="label">Max discount %</label>
          <input v-model.number="thresh.maxDiscount" class="input" type="number" min="1" max="100" />
        </div>
      </div>
    </div>

    <!-- PWA install card -->
    <div class="card p-5 border-g-100 bg-g-25 animate-up stagger-4">
      <div class="flex items-start gap-3">
        <div class="size-10 rounded-xl bg-g-100 flex items-center justify-center shrink-0">
          <Icon name="lucide:smartphone" class="size-5 text-g-600" />
        </div>
        <div>
          <p class="text-sm font-bold text-n-900">Install SmartStock on your phone</p>
          <p class="text-sm text-n-500 mt-0.5">Add to home screen for the full native app experience — works offline.</p>
          <div class="mt-3 space-y-1.5 text-xs text-n-500">
            <p><strong class="text-n-700">iPhone/iPad:</strong> Tap <Icon name="lucide:share" class="size-3 inline" /> Share → Add to Home Screen</p>
            <p><strong class="text-n-700">Android:</strong> Tap ⋮ menu → Install app / Add to Home Screen</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-2 animate-up stagger-4">
      <button class="btn-secondary" @click="reset">Reset defaults</button>
      <button class="btn-primary" @click="save">
        <Icon name="lucide:check" class="size-4" /> Save settings
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '~/stores/ui'
const ui = useUIStore()

const s = reactive({ name: 'My Market', currency: 'EUR', lang: 'en' })
const alerts = reactive<Record<string, boolean>>({
  lowStock: true, expiry: true, autoDiscount: true, whatsapp: false,
})
const thresh = reactive({ critical: 2, warning: 7, maxDiscount: 50 })

const toggles = [
  { key: 'lowStock',     label: 'Low stock alerts',     desc: 'Notify when stock drops below minimum threshold' },
  { key: 'expiry',       label: 'Expiry alerts',        desc: 'Notify when products are about to expire' },
  { key: 'autoDiscount', label: 'Discount suggestions', desc: 'Show recommended discounts on the Expiry Tracker' },
  { key: 'whatsapp',     label: 'WhatsApp alerts',      desc: 'Receive urgent alerts on WhatsApp (Pro feature)' },
]

const save  = () => ui.showToast('Settings saved')
const reset = () => { s.name = 'My Market'; s.currency = 'EUR'; thresh.critical = 2; thresh.warning = 7; thresh.maxDiscount = 50 }
</script>
