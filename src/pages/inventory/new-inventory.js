import Head from "next/head";
import { Box, Button, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { InventoryNew } from "src/sections/inventory/inventory-new";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const company = JSON.parse(localStorage.getItem("company"));
  return (
    <>
      <Head>
        <title>New Transference</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Grid container>
              <Grid xs={6} md={6}>
                <Typography variant="h4">New Transference</Typography>
              </Grid>

              <Grid xs={6} md={6} sx={{ textAlign: "end" }}>
                <Button
                  sx={{ backgroundColor: `${company.components.paletteColor.button} !important` }}
                  variant="contained"
                  onClick={() => {
                    router.push({
                      pathname: "/inventories",
                    });
                  }}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
            <div>
              <Grid container spacing={3}>
                <Grid xs={12} md={12} lg={12}>
                  <InventoryNew
                    OnSave={() => {
                      router.push({
                        pathname: "/inventories",
                      });
                    }}
                  />
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
