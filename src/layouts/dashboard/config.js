import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import CogIcon from "@heroicons/react/24/solid/Cog6ToothIcon";
import LockClosedIcon from "@heroicons/react/24/solid/CubeIcon";
import ShoppingBagIcon from "@heroicons/react/24/solid/CogIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import UsersIcon from "@heroicons/react/24/solid/IdentificationIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import Cart from "@heroicons/react/24/solid/KeyIcon";
import { SvgIcon } from "@mui/material";
import OpenIcon from "@heroicons/react/24/solid/ChevronRightIcon";
import CloseIcon from "@heroicons/react/24/solid/ChevronDownIcon";

export const items = [
  {
    title: "Users",
    path: "/users",
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
    icon: (
      <SvgIcon fontSize="small">
        <UserPlusIcon />
      </SvgIcon>
    ),
    subNav: null,
  },
  {
    title: "Customers",
    path: "/customers",
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
    subNav: null,
  },
  {
    title: "Cars",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <Cart />
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
        title: "Models",
        path: "/companies",
        icon: (
          <SvgIcon fontSize="small">
            <ShoppingBagIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Types",
        path: "/settings",
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
