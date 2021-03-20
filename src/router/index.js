import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Login-SignUp.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/mail-server",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/MailApp.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
