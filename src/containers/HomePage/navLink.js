export const MAIN_NAV_LINKS = [
  {
    key: "home",
    to: "/home",
    titleId: "homeHeader.homepage",
    subId: "homeHeader.select-doctor",
    matchPaths: ["/", "/home"],        // ✅ thêm "/" vào đây
  },
  {
    key: "specialty",
    to: "/specialties",
    titleId: "homeHeader.specialty",
    subId: "homeHeader.search-doctor",
    matchPaths: ["/specialties", "/detail-specialty"],
  },
  {
    key: "clinic",
    to: "/clinics",
    titleId: "homeHeader.health-facility",
    subId: "homeHeader.select-room",
    matchPaths: ["/clinics", "/detail-clinic"],
  },
  {
    key: "history",
    to: "/histories",
    titleId: "homeHeader.history",
    subId: "homeHeader.check-history",
    matchPaths: ["/histories"],
  },
];
