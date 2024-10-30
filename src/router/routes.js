const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        beforeEnter: (to, from, next) => {
          const timekeeperServerApi = localStorage.getItem(
            "timekeeper_server_api"
          );
          if (!timekeeperServerApi || timekeeperServerApi.trim() === "") {
            next({ path: "server" });
          } else {
            next();
          }
        },
      },
      {
        path: "server",
        component: () => import("pages/ServerPage.vue"),
      },
      {
        path: "location",
        component: () => import("pages/LocationPage.vue"),
      },
      {
        path: "type",
        component: () => import("pages/TypePage.vue"),
      },
      {
        path: "sound",
        component: () => import("src/pages/SoundPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
