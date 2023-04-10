import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { withAuthGuard } from "src/hocs/with-auth-guard";
import { SideNav } from "./side-nav";
import { TopNav } from "./top-nav";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  [theme.breakpoints.up("lg")]: {
    paddingLeft: SIDE_NAV_WIDTH,
  },
}));

const LayoutContainer = styled("div")({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  width: "100%",
});

export const Layout = withAuthGuard((props) => {
  const router = useRouter();
  const { children } = props;
  const pathname = usePathname();
  const [openNav, setOpenNav] = useState(false);
  const company = JSON.parse(localStorage.getItem("company"));
  if (company === null) {
    showAlert("Could not get company information", "error", "Error");
    return;
  } else {
    if (company.components.systemStatus.code === 3) {
      router.push("/404");
    }
  }

  useEffect(() => {
    if (openNav) {
      setOpenNav(true);
    }
  }, [pathname, openNav]);

  return (
    <>
      <TopNav onNavOpen={() => setOpenNav(true)} />
      <SideNav onClose={() => setOpenNav(false)} open={openNav} />
      <LayoutRoot>
        <LayoutContainer>{children}</LayoutContainer>
      </LayoutRoot>
    </>
  );
});
