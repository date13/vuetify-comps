import Vue from 'vue'
import VueRouter from 'vue-router'
import _ from 'lodash';
import {Tools} from "../utils/tools";

Vue.use(VueRouter);
let routers = [];
Tools.importAll(require.context('./', true, /\.router\.js$/), (router) => {
  routers.push(router);
});
console.log(routers);
const routerArray = [
  ...routers,
];
let env = process.env;

const router = new VueRouter({
  mode: 'history',
  base: env.NODE_ENV === 'production' ?
    '/' :
    '/',
  routes: routerArray
});


export default router;
