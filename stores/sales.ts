import { defineStore } from 'pinia'
import { useProductsStore } from './products'
import { startOfDay, startOfWeek, startOfMonth, isAfter, subDays, format } from 'date-fns'

export interface SaleItem {
  productId: string
  productName: string
  quantity: number
  price: number
  cost: number
}

export interface Sale {
  id: string
  items: SaleItem[]
  total: number
  profit: number
  paymentMethod: 'cash' | 'card' | 'other'
  date: string
  note?: string
}

export interface CartItem extends SaleItem {
  cartId: string
}

export const useSalesStore = defineStore('sales', () => {
  const productsStore = useProductsStore()
  const sales = ref<Sale[]>([])
  const cart = ref<CartItem[]>([])

  const seedSales = () => {
    if (sales.value.length > 0) return
    const now = new Date()
    const seeded: Sale[] = []
    for (let i = 29; i >= 0; i--) {
      const date = subDays(now, i)
      const numSales = Math.floor(Math.random() * 10) + 4
      for (let s = 0; s < numSales; s++) {
        const numItems = Math.floor(Math.random() * 4) + 1
        const items: SaleItem[] = []
        let total = 0, profit = 0
        for (let j = 0; j < numItems; j++) {
          const product = productsStore.products[Math.floor(Math.random() * productsStore.products.length)]
          const qty = Math.floor(Math.random() * 4) + 1
          items.push({ productId: product.id, productName: product.name, quantity: qty, price: product.price, cost: product.cost })
          total += product.price * qty
          profit += (product.price - product.cost) * qty
        }
        const saleDate = new Date(date)
        saleDate.setHours(Math.floor(Math.random() * 14) + 7)
        seeded.push({ id: crypto.randomUUID(), items, total: +total.toFixed(2), profit: +profit.toFixed(2), paymentMethod: Math.random() > 0.45 ? 'card' : 'cash', date: saleDate.toISOString() })
      }
    }
    sales.value = seeded
  }

  // ── Cart ─────────────────────────────────────────
  const addToCart = (productId: string, qty = 1) => {
    const product = productsStore.getById(productId)
    if (!product || product.stock < qty) return false
    const existing = cart.value.find(i => i.productId === productId)
    if (existing) { existing.quantity += qty } else {
      cart.value.push({ cartId: crypto.randomUUID(), productId, productName: product.name, quantity: qty, price: product.price, cost: product.cost })
    }
    return true
  }

  const removeFromCart = (cartId: string) => { cart.value = cart.value.filter(i => i.cartId !== cartId) }

  const updateCartQty = (cartId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(cartId); return }
    const item = cart.value.find(i => i.cartId === cartId)
    if (item) item.quantity = quantity
  }

  const clearCart = () => { cart.value = [] }

  const cartTotal  = computed(() => cart.value.reduce((s, i) => s + i.price * i.quantity, 0))
  const cartProfit = computed(() => cart.value.reduce((s, i) => s + (i.price - i.cost) * i.quantity, 0))
  const cartCount  = computed(() => cart.value.reduce((s, i) => s + i.quantity, 0))

  const checkout = (paymentMethod: Sale['paymentMethod'] = 'card', note?: string) => {
    if (!cart.value.length) return null
    const sale: Sale = { id: crypto.randomUUID(), items: cart.value.map(i => ({ ...i })), total: +cartTotal.value.toFixed(2), profit: +cartProfit.value.toFixed(2), paymentMethod, date: new Date().toISOString(), note }
    cart.value.forEach(item => productsStore.adjustStock(item.productId, item.quantity, 'sale', 'POS sale'))
    sales.value.unshift(sale)
    clearCart()
    return sale
  }

  // ── Analytics ────────────────────────────────────
  const salesToday      = computed(() => { const s = startOfDay(new Date()); return sales.value.filter(x => isAfter(new Date(x.date), s)) })
  const salesThisWeek   = computed(() => { const s = startOfWeek(new Date(), { weekStartsOn: 1 }); return sales.value.filter(x => isAfter(new Date(x.date), s)) })
  const salesThisMonth  = computed(() => { const s = startOfMonth(new Date()); return sales.value.filter(x => isAfter(new Date(x.date), s)) })

  const revenueToday     = computed(() => salesToday.value.reduce((s, x) => s + x.total, 0))
  const revenueThisWeek  = computed(() => salesThisWeek.value.reduce((s, x) => s + x.total, 0))
  const revenueThisMonth = computed(() => salesThisMonth.value.reduce((s, x) => s + x.total, 0))
  const profitToday      = computed(() => salesToday.value.reduce((s, x) => s + x.profit, 0))
  const profitThisMonth  = computed(() => salesThisMonth.value.reduce((s, x) => s + x.profit, 0))
  const marginThisMonth  = computed(() => revenueThisMonth.value > 0 ? (profitThisMonth.value / revenueThisMonth.value) * 100 : 0)

  const dailyRevenue = computed(() => {
    const days = []
    for (let i = 13; i >= 0; i--) {
      const d = subDays(new Date(), i)
      const ds = startOfDay(d)
      const de = new Date(ds); de.setDate(de.getDate() + 1)
      const daySales = sales.value.filter(x => { const sd = new Date(x.date); return sd >= ds && sd < de })
      days.push({ date: format(d, 'MMM d'), revenue: +daySales.reduce((s, x) => s + x.total, 0).toFixed(2), profit: +daySales.reduce((s, x) => s + x.profit, 0).toFixed(2) })
    }
    return days
  })

  const topProducts = computed(() => {
    const counts: Record<string, { name: string; quantity: number; revenue: number }> = {}
    salesThisMonth.value.forEach(sale => {
      sale.items.forEach(item => {
        if (!counts[item.productId]) counts[item.productId] = { name: item.productName, quantity: 0, revenue: 0 }
        counts[item.productId].quantity += item.quantity
        counts[item.productId].revenue += item.price * item.quantity
      })
    })
    return Object.entries(counts).map(([id, d]) => ({ id, ...d })).sort((a, b) => b.revenue - a.revenue).slice(0, 5)
  })

  // Hour-of-day heatmap for today's peak hours
  const salesByHour = computed(() => {
    const hours = Array.from({ length: 24 }, (_, h) => ({ hour: h, count: 0, revenue: 0 }))
    salesThisWeek.value.forEach(sale => {
      const h = new Date(sale.date).getHours()
      hours[h].count++
      hours[h].revenue += sale.total
    })
    return hours
  })

  return {
    sales, cart, cartTotal, cartProfit, cartCount,
    salesToday, salesThisWeek, salesThisMonth,
    revenueToday, revenueThisWeek, revenueThisMonth,
    profitToday, profitThisMonth, marginThisMonth,
    dailyRevenue, topProducts, salesByHour,
    addToCart, removeFromCart, updateCartQty, clearCart, checkout, seedSales,
  }
})
