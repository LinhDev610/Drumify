import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CampaignIcon from "@mui/icons-material/Campaign";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BadgeIcon from "@mui/icons-material/Badge";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";

export const adminSidebarConfig = [
  {
    title: "sidebar.dashboard",
    path: "/admin",
    icon: DashboardIcon,
    roles: ["ADMIN", "DIRECTOR", "STAFF"],
    groups: ["HR", "WAREHOUSE", "CASHIER", "CS", "MARKETING"],
  },
  {
    title: "sidebar.user_management",
    path: "/admin/users",
    icon: PeopleIcon,
    roles: ["ADMIN"],
    groups: ["HR"],
  },
  {
    title: "sidebar.hr_management",
    path: "/admin/hr",
    icon: BadgeIcon,
    roles: ["ADMIN"],
    groups: ["HR"],
  },
  {
    title: "sidebar.inventory",
    path: "/admin/inventory",
    icon: InventoryIcon,
    roles: ["ADMIN"],
    groups: ["WAREHOUSE"],
  },
  {
    title: "sidebar.orders",
    path: "/admin/orders",
    icon: ShoppingBasketIcon,
    roles: ["ADMIN", "STAFF"],
    groups: ["CASHIER", "WAREHOUSE"],
  },
  {
    title: "sidebar.marketing",
    path: "/admin/marketing",
    icon: CampaignIcon,
    roles: ["ADMIN"],
    groups: ["MARKETING"],
  },
  {
    title: "sidebar.customer_support",
    path: "/admin/support",
    icon: SupportAgentIcon,
    roles: ["ADMIN", "STAFF"],
    groups: ["CS"],
  },
  {
    title: "sidebar.reports",
    path: "/admin/reports",
    icon: AssessmentIcon,
    roles: ["ADMIN", "DIRECTOR"],
  },
  {
    title: "sidebar.finance",
    path: "/admin/finance",
    icon: ReceiptIcon,
    roles: ["ADMIN", "DIRECTOR"],
  },
];
