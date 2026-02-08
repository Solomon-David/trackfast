// File path: /frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { useUserStore } from '@/stores/userStore'

// Public Views
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import ContactView from '@/views/ContactView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

// Auth
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import VerifyAccountView from '@/views/auth/VerifyAccountView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Public routes
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', component: HomeView },
        { path: 'about', component: AboutView },
        { path: 'contact', component: ContactView },
        { path: '/track/:trackingNumber', component: () => import("@/views/shipment/TrackShipmentView.vue") },
        { path: '/track/', component: () => import("@/views/shipment/TrackShipmentView.vue") },
        
      ]
    },

    // Auth routes
    { path: "/auth",
      children: [
          { path: 'login', component: LoginView, meta: { guestOnly: true } },
          { path: 'register', component: RegisterView, meta: { guestOnly: true } },
          { path: 'verify-account', component: VerifyAccountView, meta: { guestOnly: true } },
          { path: "forgot-password", component: () => import("@/views/auth/ForgotPasswordView.vue")},
          { path: "reset-password", component: () => import("@/views/auth/ResetPasswordView.vue")}
        ] 
      },
      
      // User routes
    {
      path: '/user',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        { path: 'dashboard', component: ()=> import('@/views/user/UserDashboardView.vue') },
        { path: 'profile', component: ()=> import('@/views/user/UserProfileView.vue') },
        { path: 'shipments', component: ()=> import('@/views/user/UserMyShipmentsView.vue') },
        { path: 'transactions', component: ()=> import('@/views/user/UserMyTransactionsView.vue') },
        { path: "change-password", component: () => import("@/views/auth/ChangePasswordView.vue")},
      ]
    },

    // Shipment routes
    {
      path: '/shipments',
      component: MainLayout,
      children: [
        { path: 'create', component: ()=> import("@/views/shipment/CreateShipmentView.vue"), meta: { requiresAuth: true } },
        { path: 'details/:trackingNumber', component: ()=> import('@/views/shipment/ShipmentDetailsView.vue'), meta: { requiresAuth: true } },
        { path: 'update-status', component: ()=>import('@/views/staff/StaffUpdateShipmentStatusView.vue'), meta: { requiresAuth: true, staffOnly: true } },
        { path: 'update-status/:trackingNumber', component: ()=>import('@/views/staff/StaffUpdateShipmentStatusView.vue'), meta: { requiresAuth: true, staffOnly: true } },
      ]
    },

    // Staff routes
    {
      path: '/staff',
      component: MainLayout,
      meta: { requiresAuth: true, staffOnly: true },
      children: [
        { path: 'dashboard', component: ()=>import('@/views/staff/StaffDashboardView.vue') },
        { path: 'shipments', component: ()=>import('@/views/staff/StaffShipmentsView.vue') },
        { path: 'create-transaction', component: () => import('@/views/staff/CreateTransactionView.vue')}
      ]
    },

    // Admin routes
    {
      path: '/admin',
      component: MainLayout,
      meta: { requiresAuth: true, adminOnly: true },
      children: [
        {path: 'dashboard',  component: () => import('@/views/admin/AdminDashboardView.vue')},
        {path: 'users',  component: () => import('@/views/admin/AdminUsersView.vue')},
        {path: 'create-staff',  component: () => import('@/views/admin/AdminCreateStaffView.vue')},
        {path: 'activity',  component: () => import('@/views/admin/AdminStaffActivityLogsView.vue')},
        {path: "pricing-settings",  component: () => import("@/views/admin/PricingSettingsView.vue")}
      ]
    },

    // 404 fallback
    { path: '/:pathMatch(.*)*', component: NotFoundView }
  ]
})

// Route Guards
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  userStore.loadUserFromStorage()

  const isLoggedIn = userStore.isLoggedIn
  const role = userStore.user?.role

  // Guest-only
  if (to.meta.guestOnly && isLoggedIn) {
    return next('/user/dashboard')
  }

  // Auth-required
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/auth/login')
  }

  // Staff-only
  if (to.meta.staffOnly && role !== 'staff' && role !== 'admin') {
    return next('/')
  }

  // Admin-only
  if (to.meta.adminOnly && role !== 'admin') {
    return next('/')
  }

  next()
})

export default router