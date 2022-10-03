import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import NotFound from '../components/NotFound.vue';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      // if the route contains a public parameter, honor that
      if (to.query.public != undefined) {
        next();
        return
      }

      // otherwise send authenticated users to public=false
      // and unauthenticated users to public=true
      if (store.state.userIsAuthenticated) {
          next({ name: 'Home', query: {...to.query, public: "false"}});
      } else {
          next({ name: 'Home', query: {...to.query, public: "true"}});
      }
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '*',
    name: 'Not Found',
    component: NotFound
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
