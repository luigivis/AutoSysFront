import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import CogIcon from "@heroicons/react/24/solid/Cog6ToothIcon";
import LockClosedIcon from "@heroicons/react/24/solid/CubeIcon";
import ShoppingBagIcon from "@heroicons/react/24/solid/CogIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import UsersIcon from "@heroicons/react/24/solid/IdentificationIcon";
import GarageIcon from "@mui/icons-material/Garage";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import StoreIcon from "@mui/icons-material/Store";
import { SvgIcon } from "@mui/material";
import OpenIcon from "@heroicons/react/24/solid/ChevronRightIcon";
import CloseIcon from "@heroicons/react/24/solid/ChevronDownIcon";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import FolderIcon from "@mui/icons-material/Folder";

export const items = [
  {
    title: "Users",
    path: "/users",
    microserviceName: "users",
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    ),
    subNav: null,
  },
  {
    title: "Employees",
    path: "/employees",
    microserviceName: "employees",
    icon: (
      <SvgIcon fontSize="small">
        <UserPlusIcon />
      </SvgIcon>
    ),
    subNav: null,
  },
  {
    title: "Clients",
    path: "/customers",
    microserviceName: "client",
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
    subNav: null,
  },
  {
    title: "Stores",
    path: "/stores",
    microserviceName: "client",
    icon: (
      <SvgIcon fontSize="small">
        <StoreIcon />
      </SvgIcon>
    ),
    subNav: null,
  },
  {
    title: "Products",
    microserviceName: "car",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <InventoryIcon />
      </SvgIcon>
    ),
    iconClosed: (
      <SvgIcon fontSize="small">
        <CloseIcon />
      </SvgIcon>
    ),
    iconOpened: (
      <SvgIcon fontSize="small">
        <OpenIcon />
      </SvgIcon>
    ),
    subNav: [
      {
        title: "Products",
        path: "/products",
        icon: (
          <SvgIcon fontSize="small">
            <InventoryIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Brands",
        path: "/brands-product",
        icon: (
          <SvgIcon fontSize="small">
            <FolderIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Categories",
        path: "/categories-product",
        icon: (
          <SvgIcon fontSize="small">
            <FolderIcon />
          </SvgIcon>
        ),
      },
    ],
  },
  {
    title: "Cars",
    microserviceName: "car",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <TimeToLeaveIcon />
      </SvgIcon>
    ),
    iconClosed: (
      <SvgIcon fontSize="small">
        <CloseIcon />
      </SvgIcon>
    ),
    iconOpened: (
      <SvgIcon fontSize="small">
        <OpenIcon />
      </SvgIcon>
    ),
    subNav: [
      {
        title: "Cars",
        path: "/cars",
        icon: (
          <SvgIcon fontSize="small">
            <GarageIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Models",
        path: "/models",
        icon: (
          <SvgIcon fontSize="small">
            <ShoppingBagIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Types",
        path: "/types",
        icon: (
          <SvgIcon fontSize="small">
            <CogIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Brands",
        path: "/brands",
        icon: (
          <SvgIcon fontSize="small">
            <LockClosedIcon />
          </SvgIcon>
        ),
      },
    ],
  },
];
