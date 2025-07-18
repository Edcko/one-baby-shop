import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Home from '@/pages/Home.vue'
import Catalog from '@/pages/Catalog.vue'
import Contact from '@/pages/Contact.vue'
import Register from '@/pages/Register.vue'
import Login from '@/pages/Login.vue'
import Profile from '@/pages/Profile.vue'
import ForgotPassword from '@/pages/ForgotPassword.vue'
import Checkout from '@/pages/Checkout.vue'
import OrderHistory from '@/pages/OrderHistory.vue'
import AdminLogin from '@/pages/AdminLogin.vue'
import AdminDashboard from '@/pages/AdminDashboard.vue'
import AdminProducts from '@/pages/AdminProducts.vue'
import AdminOrders from '@/pages/AdminOrders.vue'
import AdminUsers from '@/pages/AdminUsers.vue'
import ProductDetail from '@/pages/ProductDetail.vue'
import Wishlist from '@/pages/Wishlist.vue'
import { useUserStore } from '@/store/user'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'catalog', name: 'Catalog', component: Catalog },
      { path: 'product/:id', name: 'ProductDetail', component: ProductDetail },
      { path: 'contact', name: 'Contact', component: Contact },
      { path: 'register', name: 'Register', component: Register, meta: { requiresGuest: true } },
      { path: 'login', name: 'Login', component: Login, meta: { requiresGuest: true } },
      { path: 'forgot-password', name: 'ForgotPassword', component: ForgotPassword, meta: { requiresGuest: true } },
      { path: 'profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } },
      { path: 'checkout', name: 'Checkout', component: Checkout, meta: { requiresAuth: true } },
      { path: 'orders', name: 'OrderHistory', component: OrderHistory, meta: { requiresAuth: true } },
      { path: 'wishlist', name: 'Wishlist', component: Wishlist, meta: { requiresAuth: true } },
    ],
  },
  {
    path: '/direct',
    component: Home,
  },
  {
    path: '/admin',
    children: [
      { path: 'login', name: 'AdminLogin', component: AdminLogin },
      { path: 'dashboard', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAdmin: true } },
      { path: 'products', name: 'AdminProducts', component: AdminProducts, meta: { requiresAdmin: true } },
      { path: 'orders', name: 'AdminOrders', component: AdminOrders, meta: { requiresAdmin: true } },
      { path: 'users', name: 'AdminUsers', component: AdminUsers, meta: { requiresAdmin: true } },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Protección de rutas
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const isAuth = !!userStore.user
  const isAdmin = userStore.user && userStore.user.role === 'admin'
  if (to.meta.requiresAuth && !isAuth) {
    next({ name: 'Login' })
  } else if (to.meta.requiresGuest && isAuth) {
    next({ name: 'Profile' })
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next({ name: 'AdminLogin' })
  } else {
    next()
  }
})

export default router
