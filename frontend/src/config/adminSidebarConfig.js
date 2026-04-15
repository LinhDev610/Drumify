import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CampaignIcon from "@mui/icons-material/Campaign";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BadgeIcon from "@mui/icons-material/Badge";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import DescriptionIcon from "@mui/icons-material/Description";
import PaymentsIcon from "@mui/icons-material/Payments";
import InsightsIcon from "@mui/icons-material/Insights";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InputIcon from "@mui/icons-material/Input";
import StorefrontIcon from "@mui/icons-material/Storefront";

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
    title: "sidebar.hr_recruitment",
    path: "/admin/hr/recruitment",
    icon: WorkHistoryIcon,
    roles: ["ADMIN"],
    groups: ["HR"],
  },
  {
    title: "sidebar.hr_attendance",
    path: "/admin/hr/attendance",
    icon: FactCheckIcon,
    roles: ["ADMIN"],
    groups: ["HR"],
  },
  {
    title: "sidebar.hr_contracts",
    path: "/admin/hr/contracts",
    icon: DescriptionIcon,
    roles: ["ADMIN"],
    groups: ["HR"],
  },
  {
    title: "sidebar.hr_payroll",
    path: "/admin/hr/payroll",
    icon: PaymentsIcon,
    roles: ["ADMIN"],
    groups: ["HR"],
  },
  {
    title: "sidebar.hr_reports",
    path: "/admin/hr/reports",
    icon: InsightsIcon,
    roles: ["ADMIN"],
    groups: ["HR"],
  },
  {
    title: "sidebar.products",
    path: "/admin/products",
    icon: InventoryIcon,
    roles: ["ADMIN"],
    groups: ["WAREHOUSE"],
  },
  {
    title: "sidebar.categories",
    path: "/admin/categories",
    icon: CategoryIcon,
    roles: ["ADMIN"],
    groups: ["WAREHOUSE"],
  },
  {
    title: "sidebar.wh_stock",
    path: "/admin/inventory",
    icon: InventoryIcon,
    roles: ["ADMIN"],
    groups: ["WAREHOUSE"],
  },
  {
    title: "sidebar.wh_import",
    path: "/admin/inventory/import",
    icon: InputIcon,
    roles: ["ADMIN"],
    groups: ["WAREHOUSE"],
  },
  {
    title: "sidebar.orders",
    path: "/admin/orders",
    icon: ShoppingBasketIcon,
    roles: ["ADMIN"],
    groups: ["CASHIER", "WAREHOUSE"],
  },
  {
    title: "sidebar.wh_suppliers",
    path: "/admin/inventory/suppliers",
    icon: StorefrontIcon,
    roles: ["ADMIN"],
    groups: ["WAREHOUSE"],
  },
  {
    title: "sidebar.wh_reports",
    path: "/admin/inventory/reports",
    icon: AssessmentIcon,
    roles: ["ADMIN"],
    groups: ["WAREHOUSE"],
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
    roles: ["ADMIN"],
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
  {
    title: "sidebar.my_account",
    path: "/admin/profile",
    icon: AccountCircleIcon,
    roles: ["ADMIN", "DIRECTOR", "STAFF"],
    groups: ["HR", "WAREHOUSE", "CASHIER", "CS", "MARKETING"],
  },
];
