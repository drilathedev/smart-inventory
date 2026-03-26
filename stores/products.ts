import { defineStore } from 'pinia'
import { addDays, differenceInDays, isPast, isWithinInterval, startOfToday, subDays, format } from 'date-fns'

export interface Supplier {
  id: string
  name: string
  contact?: string
  phone?: string
  email?: string
  leadDays: number // typical delivery lead time in days
}

export interface Product {
  id: string
  name: string
  sku: string
  category: string
  barcode?: string
  cost: number
  price: number
  stock: number
  minStock: number
  maxStock: number
  unit: string
  expiryDate?: string | null
  supplierId?: string
  location?: string
  avgDailySales?: number // calculated from sales history
  createdAt: string
  updatedAt: string
}

export interface StockMovement {
  id: string
  productId: string
  type: 'in' | 'out' | 'adjustment' | 'waste' | 'sale'
  quantity: number
  note?: string
  date: string
}

export const SUPPLIERS: Supplier[] = [
  { id: 's1', name: 'FreshFarm Co',  phone: '+355 69 123 4567', email: 'orders@freshfarm.co',  leadDays: 1 },
  { id: 's2', name: 'GreenGrow',     phone: '+355 69 234 5678', email: 'supply@greengrow.al',  leadDays: 2 },
  { id: 's3', name: 'Local Bakery',  phone: '+355 69 345 6789', email: 'hello@localbakery.al', leadDays: 0 },
  { id: 's4', name: 'MeatMasters',   phone: '+355 69 456 7890', email: 'orders@meatmasters.al',leadDays: 1 },
  { id: 's5', name: 'DrinksCo',      phone: '+355 69 567 8901', email: 'sales@drinksco.al',    leadDays: 2 },
  { id: 's6', name: 'OceanFresh',    phone: '+355 69 678 9012', email: 'fish@oceanfresh.al',   leadDays: 1 },
  { id: 's7', name: 'PantryPlus',    phone: '+355 69 789 0123', email: 'orders@pantryplus.al', leadDays: 3 },
]

const SAMPLE_PRODUCTS: Product[] = [
  { id:'p1',  name:'Organic Whole Milk',    sku:'DAIRY-001', category:'Dairy',         cost:0.80, price:1.49, stock:48, minStock:20, maxStock:100, unit:'bottle', expiryDate:addDays(new Date(),3).toISOString().split('T')[0],  supplierId:'s1', location:'Fridge A1', avgDailySales:8,  createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
  { id:'p2',  name:'Greek Yogurt 500g',     sku:'DAIRY-002', category:'Dairy',         cost:1.20, price:2.39, stock:30, minStock:15, maxStock:60,  unit:'piece',  expiryDate:addDays(new Date(),5).toISOString().split('T')[0],  supplierId:'s1', location:'Fridge A2', avgDailySales:5,  createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
  { id:'p3',  name:'Sourdough Bread',       sku:'BAKE-001',  category:'Bakery',        cost:1.50, price:3.20, stock:12, minStock:8,  maxStock:30,  unit:'loaf',   expiryDate:addDays(new Date(),2).toISOString().split('T')[0],  supplierId:'s3', location:'Shelf B1',  avgDailySales:6,  createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
  { id:'p4',  name:'Free Range Eggs 12pk',  sku:'DAIRY-003', category:'Dairy',         cost:2.10, price:3.99, stock:6,  minStock:12, maxStock:48,  unit:'pack',   expiryDate:addDays(new Date(),18).toISOString().split('T')[0], supplierId:'s1', location:'Fridge A3', avgDailySales:3,  createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
  { id:'p5',  name:'Tomatoes 500g',         sku:'VEG-001',   category:'Vegetables',    cost:0.60, price:1.29, stock:40, minStock:20, maxStock:80,  unit:'pack',   expiryDate:addDays(new Date(),4).toISOString().split('T')[0],  supplierId:'s2', location:'Shelf C1',  avgDailySales:10, createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
  { id:'p6',  name:'Avocados (each)',        sku:'VEG-002',   category:'Vegetables',    cost:0.50, price:1.10, stock:35, minStock:10, maxStock:50,  unit:'piece',  expiryDate:addDays(new Date(),6).toISOString().split('T')[0],  supplierId:'s2', location:'Shelf C2',  avgDailySales:7,  createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
  { id:'p7',  name:'Orange Juice 1L',       sku:'BEVE-001',  category:'Beverages',     cost:1.40, price:2.79, stock:22, minStock:12, maxStock:60,  unit:'bottle', expiryDate:addDays(new Date(),14).toISOString().split('T')[0], supplierId:'s5', location:'Fridge B1', avgDailySales:4,  createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
  { id:'p8',  name:'Sliced Turkey 200g',    sku:'MEAT-001',  category:'Meat & Deli',   cost:2.00, price:3.79, stock:18, minStock:10, maxStock:40,  unit:'pack',   expiryDate:addDays(new Date(),1).toISOString().split('T')[0],  supplierId:'s4', location:'Fridge C1', avgDailySales:5,  createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
  { id:'p9',  name:'Cheddar Cheese 250g',   sku:'DAIRY-004', category:'Dairy',         cost:2.30, price:4.29, stock:25, minStock:8,  maxStock:40,  unit:'piece',  expiryDate:addDays(new Date(),22).toISOString().split('T')[0], supplierId:'s1', location:'Fridge A4', avgDailySales:3,  createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
  { id:'p10', name:'Pasta 500g',            sku:'PANT-001',  category:'Pantry',        cost:0.60, price:1.49, stock:80, minStock:20, maxStock:120, unit:'pack',   expiryDate:addDays(new Date(),365).toISOString().split('T')[0],supplierId:'s7', location:'Shelf D1',  avgDailySales:5,  createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
  { id:'p11', name:'Blueberries 125g',      sku:'FRUIT-001', category:'Fruits',        cost:1.80, price:3.49, stock:20, minStock:10, maxStock:40,  unit:'pack',   expiryDate:addDays(new Date(),3).toISOString().split('T')[0],  supplierId:'s2', location:'Shelf C3',  avgDailySales:4,  createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
  { id:'p12', name:'Salmon Fillet 300g',    sku:'FISH-001',  category:'Fish & Seafood',cost:5.50, price:8.99, stock:8,  minStock:6,  maxStock:24,  unit:'piece',  expiryDate:addDays(new Date(),2).toISOString().split('T')[0],  supplierId:'s6', location:'Fridge D1', avgDailySales:2,  createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
  { id:'p13', name:'Butter 250g',           sku:'DAIRY-005', category:'Dairy',         cost:1.60, price:2.99, stock:32, minStock:12, maxStock:60,  unit:'piece',  expiryDate:addDays(new Date(),30).toISOString().split('T')[0], supplierId:'s1', location:'Fridge A5', avgDailySales:3,  createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
  { id:'p14', name:'Spinach 200g',          sku:'VEG-003',   category:'Vegetables',    cost:0.90, price:1.79, stock:15, minStock:10, maxStock:40,  unit:'bag',    expiryDate:addDays(new Date(),5).toISOString().split('T')[0],  supplierId:'s2', location:'Shelf C4',  avgDailySales:4,  createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
  { id:'p15', name:'Whole Chicken 1.5kg',   sku:'MEAT-002',  category:'Meat & Deli',   cost:4.20, price:7.49, stock:10, minStock:5,  maxStock:25,  unit:'piece',  expiryDate:addDays(new Date(),3).toISOString().split('T')[0],  supplierId:'s4', location:'Fridge C2', avgDailySales:2,  createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
]

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([...SAMPLE_PRODUCTS])
  const movements = ref<StockMovement[]>([])
  const suppliers = ref<Supplier[]>([...SUPPLIERS])

  // ── Getters ──────────────────────────────────────────────
  const getById = (id: string) => products.value.find(p => p.id === id)
  const getSupplier = (id?: string) => suppliers.value.find(s => s.id === id)

  const categories = computed(() => [...new Set(products.value.map(p => p.category))].sort())

  const lowStockProducts = computed(() =>
    products.value.filter(p => p.stock <= p.minStock)
  )

  const expiringThisWeek = computed(() => {
    const today = startOfToday()
    const weekEnd = addDays(today, 7)
    return products.value.filter(p => {
      if (!p.expiryDate) return false
      const exp = new Date(p.expiryDate)
      return isWithinInterval(exp, { start: today, end: weekEnd }) || isPast(exp)
    })
  })

  const expiredProducts = computed(() =>
    products.value.filter(p => p.expiryDate && isPast(new Date(p.expiryDate + 'T23:59:59')))
  )

  const expiryValueThisWeek = computed(() =>
    expiringThisWeek.value.reduce((s, p) => s + p.stock * p.price, 0)
  )

  const totalInventoryValue = computed(() =>
    products.value.reduce((s, p) => s + p.stock * p.cost, 0)
  )

  const totalRetailValue = computed(() =>
    products.value.reduce((s, p) => s + p.stock * p.price, 0)
  )

  const daysUntilExpiry = (product: Product) => {
    if (!product.expiryDate) return null
    return differenceInDays(new Date(product.expiryDate), startOfToday())
  }

  const expiryStatus = (p: Product): 'expired' | 'critical' | 'warning' | 'ok' => {
    const d = daysUntilExpiry(p)
    if (d === null) return 'ok'
    if (d < 0) return 'expired'
    if (d <= 2) return 'critical'
    if (d <= 7) return 'warning'
    return 'ok'
  }

  const stockStatus = (p: Product): 'out' | 'low' | 'ok' => {
    if (p.stock === 0) return 'out'
    if (p.stock <= p.minStock) return 'low'
    return 'ok'
  }

  // ── Smart reorder suggestions ─────────────────────────────
  const reorderSuggestions = computed(() =>
    products.value
      .filter(p => {
        const supplier = getSupplier(p.supplierId)
        const leadDays = supplier?.leadDays ?? 1
        const daysOfStock = p.avgDailySales ? p.stock / p.avgDailySales : Infinity
        // Suggest reorder if stock covers less than (leadDays + 3 buffer days)
        return daysOfStock < (leadDays + 3)
      })
      .map(p => {
        const supplier = getSupplier(p.supplierId)
        const leadDays = supplier?.leadDays ?? 1
        const daysOfStock = p.avgDailySales ? Math.round(p.stock / p.avgDailySales) : null
        const suggestedQty = Math.max(0, p.maxStock - p.stock)
        return { product: p, supplier, leadDays, daysOfStock, suggestedQty }
      })
      .sort((a, b) => (a.daysOfStock ?? 999) - (b.daysOfStock ?? 999))
  )

  // ── Demand forecast: days of stock remaining ──────────────
  const daysOfStockRemaining = (p: Product) => {
    if (!p.avgDailySales || p.avgDailySales === 0) return null
    return Math.round(p.stock / p.avgDailySales)
  }

  const forecastStockout = (p: Product) => {
    const days = daysOfStockRemaining(p)
    if (days === null) return null
    return addDays(startOfToday(), days)
  }

  // ── Over-order risk ───────────────────────────────────────
  const overorderedRisk = computed(() =>
    products.value
      .filter(p => p.expiryDate && daysUntilExpiry(p)! < 30 && p.stock > p.minStock * 2)
      .sort((a, b) => (daysUntilExpiry(a) ?? 999) - (daysUntilExpiry(b) ?? 999))
      .slice(0, 5)
  )

  // ── Actions ───────────────────────────────────────────────
  const addProduct = (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const product: Product = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    products.value.unshift(product)
    return product
  }

  const updateProduct = (id: string, data: Partial<Product>) => {
    const idx = products.value.findIndex(p => p.id === id)
    if (idx !== -1) products.value[idx] = { ...products.value[idx], ...data, updatedAt: new Date().toISOString() }
  }

  const deleteProduct = (id: string) => {
    products.value = products.value.filter(p => p.id !== id)
  }

  const adjustStock = (productId: string, quantity: number, type: StockMovement['type'], note?: string) => {
    const product = products.value.find(p => p.id === productId)
    if (!product) return
    movements.value.unshift({ id: crypto.randomUUID(), productId, type, quantity, note, date: new Date().toISOString() })
    if (type === 'in') {
      product.stock += quantity
    } else {
      product.stock = Math.max(0, product.stock - quantity)
    }
    product.updatedAt = new Date().toISOString()
  }

  const suggestedDiscountPercent = (product: Product): number => {
    const d = daysUntilExpiry(product)
    if (d === null) return 0
    if (d <= 1) return 50
    if (d <= 2) return 40
    if (d <= 3) return 30
    if (d <= 5) return 20
    if (d <= 7) return 15
    return 0
  }

  const getMovementsForProduct = (productId: string) =>
    movements.value.filter(m => m.productId === productId)

  const addSupplier = (data: Omit<Supplier, 'id'>) => {
    const s: Supplier = { ...data, id: crypto.randomUUID() }
    suppliers.value.push(s)
    return s
  }

  return {
    products, movements, suppliers, categories,
    lowStockProducts, expiringThisWeek, expiredProducts,
    expiryValueThisWeek, totalInventoryValue, totalRetailValue,
    overorderedRisk, reorderSuggestions,
    getById, getSupplier, daysUntilExpiry, expiryStatus, stockStatus,
    daysOfStockRemaining, forecastStockout,
    addProduct, updateProduct, deleteProduct, adjustStock,
    suggestedDiscountPercent, getMovementsForProduct, addSupplier,
  }
})
