import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import RegisterPage from './views/RegisterPage.vue'
import LoginPage from './views/LoginPage.vue'
import LocalRoom from './views/LocalRoom.vue'
import GlobalRoom from './views/GlobalRoom.vue'
import MainPage from './views/MainPage.vue'
import PasswordPage from './views/PasswordPage.vue'
import ProfilePage from './views/ProfilePage.vue'
import AdminPage from './views/AdminPage.vue'
import UsersPage from "./views/UsersPage.vue"
import CreateRooms from "./views/CreateRooms.vue"
import AdminLogin from "./views/AdminLogin.vue"





const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'Register', component: RegisterPage },
  { path: '/localroom', name: 'localroom', component: LocalRoom },
  { path: '/globalroom', name: 'globalroom', component: GlobalRoom },
  { path: '/main', name: 'main', component: MainPage },
  { path: '/password', name: 'password', component: PasswordPage },
  { path: '/profile', name: 'profile', component: ProfilePage },
  { path: '/admin', name: 'admin', component: AdminPage },
  { path: "/admin/users", name: "admin-users",component: UsersPage },
  { path: "/admin/createrooms", name: "Create Rooms",component: CreateRooms },
  { path: "/adminlogin", name: "AdminLogin", component: AdminLogin}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
