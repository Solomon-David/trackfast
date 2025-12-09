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

// User Views
import UserDashboardView from '@/views/user/UserDashboardView.vue'
import UserProfileView from '@/views/user/UserProfileView.vue'
import UserMyShipmentsView from '@/views/user/UserMyShipmentsView.vue'
import UserMyTransactionsView from '@/views/user/UserMyTransactionsView.vue'

// Shipment Views
import CreateShipmentView from '@/views/shipment/CreateShipmentView.vue'
import TrackShipmentView from '@/views/shipment/TrackShipmentView.vue'
import ShipmentDetailsView from '@/views/shipment/ShipmentDetailsView.vue'

// Staff Views
import StaffDashboardView from '@/views/staff/StaffDashboardView.vue'
import StaffPickupRequestsView from '@/views/staff/StaffPickupRequestsView.vue'
import StaffUpdateShipmentStatusView from '@/views/staff/StaffUpdateShipmentStatusView.vue'

// Admin Views
import AdminDashboardView from '@/views/admin/AdminDashboardView.vue'
import AdminUsersView from '@/views/admin/AdminUsersView.vue'
import AdminCreateStaffView from '@/views/admin/AdminCreateStaffView.vue'
import AdminStaffActivityLogsView from '@/views/admin/AdminStaffActivityLogsView.vue'

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
        { path: 'track', component: TrackShipmentView }
      ]
    },

    // Auth routes
    { path: '/auth/login', component: LoginView, meta: { guestOnly: true } },
    { path: '/auth/register', component: RegisterView, meta: { guestOnly: true } },
    { path: '/auth/verify-account', component: VerifyAccountView, meta: { guestOnly: true } },

    // User routes
    {
      path: '/user',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        { path: 'dashboard', component: UserDashboardView },
        { path: 'profile', component: UserProfileView },
        { path: 'shipments', component: UserMyShipmentsView },
        { path: 'transactions', component: UserMyTransactionsView }
      ]
    },

    // Shipment routes
    {
      path: '/shipments',
      component: MainLayout,
      children: [
        { path: 'create', component: CreateShipmentView, meta: { requiresAuth: true } },
        { path: 'details/:id', component: ShipmentDetailsView, meta: { requiresAuth: true } }
      ]
    },

    // Staff routes
    {
      path: '/staff',
      component: MainLayout,
      meta: { requiresAuth: true, staffOnly: true },
      children: [
        { path: 'dashboard', component: StaffDashboardView },
        { path: 'pickups', component: StaffPickupRequestsView },
        { path: 'update-status', component: StaffUpdateShipmentStatusView }
      ]
    },

    // Admin routes
    {
      path: '/admin',
      component: MainLayout,
      meta: { requiresAuth: true, adminOnly: true },
      children: [
        { path: 'dashboard', component: AdminDashboardView },
        { path: 'users', component: AdminUsersView },
        { path: 'create-staff', component: AdminCreateStaffView },
        { path: 'activity', component: AdminStaffActivityLogsView }
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