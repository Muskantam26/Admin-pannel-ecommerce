import {
  FiHome,
  FiX,
  FiChevronDown,
  FiChevronRight,
  FiCreditCard,
  FiPlus,
  FiUser,
  FiShield,
  FiLock,
  FiCheckCircle,
} from "react-icons/fi";
import { FaBoxOpen } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { TbBrandOffice } from "react-icons/tb";
import { MdEmail } from "react-icons/md";
import { FaMailBulk, FaLayerGroup } from "react-icons/fa";
import { GoBell } from "react-icons/go";
import { RiMailSendLine } from "react-icons/ri";
import { BiCategory, BiLogOut } from "react-icons/bi";
import { PathRoutes } from "./Path";

export const ROLES = ["SUPER-ADMIN", "ADMIN", "MANAGER", "STAFF"];

export const SIDEBAR_ITEMS = [
  {
    label: "MAIN",
  },
  {
    id: PathRoutes.ADMIN_DASHBOARD,
    icon: FiHome,
    label: "Dashboard",
    allowedPermissions: ["MANAGE_DASHBOARD"],
  },
  {
    id: PathRoutes.ADMIN_MANAGEMENT,
    icon: TbBrandOffice,
    label: "Admin Management",
    allowedRoles: ["SUPER-ADMIN", "ADMIN"],
    allowedPermissions: ["MANAGE_ADMIN"],
    subItems: [
      {
        id: PathRoutes.ADMIN_MANAGEMENT,
        label: "All Admins",
        icon: FaUserGroup,
        allowedRoles: ["SUPER-ADMIN", "ADMIN"],
        allowedPermissions: ["VIEW_ADMINS"],
      },
      {
        id: PathRoutes.ADD_ADMIN,
        label: "Add Admin",
        icon: FiPlus,
        allowedRoles: ["SUPER-ADMIN", "ADMIN"],
        allowedPermissions: ["CREATE_ADMIN"],
      },
    ],
  },
  {
    id: PathRoutes.USER_MANAGEMENT,
    icon: TbBrandOffice,
    label: "User Management",
    allowedRoles: ["SUPER-ADMIN", "ADMIN", "MANAGER"],
    allowedPermissions: ["MANAGE_USERS"],
    subItems: [
      {
        id: PathRoutes.USER_MANAGEMENT,
        label: "All Users",
        icon: FaUserGroup,
        allowedPermissions: ["VIEW_USERS"],
      },
      {
        id: PathRoutes.KYC_REQUESTS,
        label: "KYC Requests",
        icon: TbBrandOffice,
        allowedPermissions: ["MANAGE_KYC"],
      },
      {
        id: PathRoutes.BANK_REQUESTS,
        label: "Bank Requests",
        icon: TbBrandOffice,
        allowedPermissions: ["MANAGE_BANK"],
      },
      {
        id: PathRoutes.ADDRESS_REQUESTS,
        label: "Address Requests",
        icon: TbBrandOffice,
        allowedPermissions: ["MANAGE_ADDRESS"],
      },
    ],
  },
  {
    id: PathRoutes.ORDER_MANAGEMENT,
    icon: FaUserGroup,
    label: "Order Management",
    allowedRoles: ["SUPER-ADMIN", "ADMIN", "MANAGER", "STAFF"],
    allowedPermissions: ["MANAGE_ORDERS"],
    subItems: [
      {
        id: PathRoutes.ORDER_MANAGEMENT,
        label: "All Orders",
        icon: FaUserGroup,
        allowedPermissions: ["VIEW_ORDERS"],
      },
      {
        id: PathRoutes.ALL_CARTS,
        label: "All Carts",
        icon: FaBoxOpen,
        allowedPermissions: ["VIEW_CARTS"],
      },
      {
        id: PathRoutes.REVIEWS,
        icon: FiCheckCircle,
        label: "All Reviews",
        allowedRoles: ["SUPER-ADMIN", "ADMIN", "MANAGER"],
        allowedPermissions: ["VIEW_MANAGE_REVIEWS"],

      },
    ],
  },
  {
    id: PathRoutes.BANNER,
    icon: FaLayerGroup,
    label: "Display Management",
    allowedRoles: ["SUPER-ADMIN", "ADMIN", "MANAGER"],
    allowedPermissions: ["MANAGE_DISPLAY"],
    subItems: [
      {
        id: PathRoutes.BANNER,
        label: "Banners",
        icon: FaLayerGroup,
        allowedPermissions: ["VIEW_BANNERS"],
      },
      {
        id: PathRoutes.MARQUEE,
        label: "Marquee",
        icon: FaLayerGroup,
        allowedPermissions: ["VIEW_MARQUEE"],
      },
    ],
  },
  {
    id: PathRoutes.PRODUCT_MANAGEMENT,
    icon: FaBoxOpen,
    label: "Product Management",
    allowedRoles: ["SUPER-ADMIN", "ADMIN", "MANAGER"],
    allowedPermissions: ["MANAGE_PRODUCTS"],
    subItems: [
      {
        id: PathRoutes.PRODUCT_MANAGEMENT,
        label: "All Products",
        icon: FaBoxOpen,
        allowedPermissions: ["VIEW_PRODUCTS"],
      },
      {
        id: PathRoutes.ADD_CATEGORY,
        label: "Categories",
        icon: BiCategory,
        allowedPermissions: ["MANAGE_CATEGORIES"],
      },
      {
        id: PathRoutes.SUB_CATEGORY,
        label: "Sub Category",
        icon: BiCategory,
        allowedPermissions: ["MANAGE_SUB_CATEGORIES"],
      },
    ],
  },
  {
    id: PathRoutes.PACKAGES,
    icon: FaLayerGroup,
    label: "Packages",
    allowedRoles: ["SUPER-ADMIN", "ADMIN", "MANAGER"],
    allowedPermissions: ["MANAGE_PACKAGES"],
    subItems: [
      {
        id: PathRoutes.PACKAGES,
        label: "All Packages",
        icon: FaUserGroup,
        allowedPermissions: ["VIEW_PACKAGES"],
      },
      {
        id: PathRoutes.PURCHASE_PACKAGE,
        label: "Purchase Package",
        icon: FaUserGroup,
        allowedPermissions: ["VIEW_PURCHASE_PACKAGES"],
      },
    ],
  },
  {
    id: PathRoutes.SITE_MANAGER,
    icon: FaMailBulk,
    label: "Site Manager",
    allowedRoles: ["SUPER-ADMIN", "ADMIN"],
    allowedPermissions: ["MANAGE_SIDEBAR"],
  },
  {
    label: "Company Details",
    icon: TbBrandOffice,
    id: PathRoutes.COMPANY_SETTINGS,
    allowedRoles: ["SUPER-ADMIN", "ADMIN"],
    allowedPermissions: ["MANAGE_SETTINGS"],
    subItems: [
      {
        id: PathRoutes.COMPANY_SETTINGS,
        label: "Company Details",
        icon: TbBrandOffice,
        allowedPermissions: ["VIEW_COMPANY_DETAILS"],
      },
      {
        id: PathRoutes.COMPANY_FORM,
        label: "Company Form",
        icon: FiPlus,
        allowedPermissions: ["CREATE_COMPANY"],
      },
    ],
  },

  {
    id: PathRoutes.DEPOSIT_REQUESTS,
    icon: FaBoxOpen,
    label: "Fund Management",
    allowedRoles: ["SUPER-ADMIN", "ADMIN", "MANAGER"],
    allowedPermissions: ["MANAGE_PAYMENTS"],
    subItems: [
      {
        id: PathRoutes.ADD_DEPOSIT,
        label: "Manual Deposit",
        icon: FiCreditCard,
        allowedPermissions: ["CREATE_DEPOSIT"],
      },
      {
        id: PathRoutes.DEPOSIT_REQUESTS,
        label: "Deposit Requests",
        icon: FaBoxOpen,
        allowedPermissions: ["VIEW_DEPOSIT_REQUESTS"],
      },
      {
        id: PathRoutes.WITHDRAWAL_REQUESTS,
        label: "Withdrawal Requests",
        icon: FaBoxOpen,
        allowedPermissions: ["VIEW_WITHDRAWAL_REQUESTS"],
      },
    ],
  },

  {
    id: PathRoutes.REWARDS,
    icon: MdEmail,
    label: "Rewards",
    allowedRoles: ["SUPER-ADMIN", "ADMIN", "MANAGER"],
    allowedPermissions: ["MANAGE_REWARDS"],
    subItems: [
      {
        id: PathRoutes.REWARDS,
        label: "All Rewards",
        icon: FaUserGroup,
        allowedPermissions: ["VIEW_REWARDS"],
      },
      {
        id: PathRoutes.ADD_REWARD,
        label: "Add Reward",
        icon: FaBoxOpen,
        allowedPermissions: ["CREATE_REWARD"],
      },
    ],
  },

  {
    label: "OTHRES",
    icon: FaMailBulk,
    id: PathRoutes.OTHRES,
    allowedRoles: ["SUPER-ADMIN", "ADMIN", "MANAGER"],
    allowedPermissions: ["MANAGE_OTHRES"],
    subItems: [
      {
        id: PathRoutes.NOTIFICATION,
        label: "Notification",
        icon: GoBell,
        allowedPermissions: ["VIEW_NOTIFICATION"],
      },
      {
        id: PathRoutes.MESSAGE,
        label: "Message",
        icon: RiMailSendLine,
        allowedPermissions: ["VIEW_MESSAGE"],
      },
    ],
  },

  {
    id: "logout",
    icon: BiLogOut,
    label: "Logout",
  },
];

// Helper to extract permissions tree from SIDEBAR_ITEMS
export const PERMISSIONS_TREE = SIDEBAR_ITEMS.filter(
  (item) =>
    item.label !== "MAIN" &&
    item.id !== "logout" &&
    (item.allowedPermissions ||
      (item.subItems && item.subItems.some((sub) => sub.allowedPermissions))),
).map((item) => ({
  label: item.label,
  value: item.allowedPermissions
    ? item.allowedPermissions[0]
    : `MANAGE_${item.label.toUpperCase().replace(/ /g, "_")}`, // Fallback if parent has no permission but children do
  children: item.subItems
    ? item.subItems
      .filter((sub) => sub.allowedPermissions)
      .map((sub) => ({
        label: sub.label,
        value: sub.allowedPermissions[0],
      }))
    : [],
}));
