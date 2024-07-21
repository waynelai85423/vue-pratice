import "vuetify/dist/vuetify.min.css";
import "./assets/main.css";
// import "~/assets/css/style.css";
// import "~/assets/css/tab.css";
// import "~/assets/css/popover.css";
import Vuetify from "vuetify";

// createApp(App).mount("#app");
export default function(Vue, { appOptions, head }) {
  const opts = {}; //opts includes, vuetify themes, icons, etc.
  Vue.use(Vuetify);

  appOptions.vuetify = new Vuetify(opts);
}
