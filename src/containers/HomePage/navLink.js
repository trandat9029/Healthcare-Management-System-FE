// mainNavLinks.js
import { path } from "../../utils";

export const MAIN_NAV_LINKS = [
  {
    key: "specialty",
    to: "/specialties",              // hoặc path.SPECIALTIES nếu bạn đã khai báo
    titleId: "homeHeader.specialty",
    subId: "homeHeader.search-doctor",
    matchPaths: ["/specialties", "/detail-specialty"],
  },
  {
    key: "clinic",
    to: "/clinics",                 // hoặc path.CLINICS
    titleId: "homeHeader.health-facility",
    subId: "homeHeader.select-room",
    matchPaths: ["/clinics", "/detail-clinic"],
  },
  {
    key: "doctor",
    to: "/doctors",                 // hoặc path.DOCTORS
    titleId: "homeHeader.doctor",
    subId: "homeHeader.select-doctor",
    matchPaths: ["/doctors", "/detail-doctor"],
  },
  {
    key: "handbook",
    to: "/handbooks",               // hoặc path.HANDBOOKS
    titleId: "homeHeader.handbook",
    subId: "homeHeader.check-health",
    matchPaths: ["/handbooks", "/detail-handbook"],
  },
];
