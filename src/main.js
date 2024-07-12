import Vue from "vue";
import App from "./App.vue";

import "./assets/main.css";

// createApp(App).mount("#app");

new Vue({
  el: "#app",
  render: h => h(App)
});
