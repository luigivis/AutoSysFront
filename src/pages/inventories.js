import { useCallback, useState, useEffect } from "react";
import Head from "next/head";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { InventoryTable } from "src/sections/inventory/inventory-table";
import { Search } from "src/sections/global/search";
import { deleteElements, getElements, putElements } from "src/service/api";
import { INVENTORY } from "../service/endpoints";
import { FILTER } from "../service/endpoints";
import { showAlert } from "src/sections/global/alert";
import { useAuthContext } from "src/contexts/auth-context";
import { ButtonCustom } from "src/sections/global/ButtonCustom";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Page = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [isShow, setIsShow] = useState(0);
  const [count, setCount] = useState(0);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    getData(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    localStorage.setItem("rowsPerPage", `${event.target.value}`);
    getData(page);
  }, []);

  const getData = async (pageRow = 0) => {
    let size = localStorage.getItem("rowsPerPage");
    var response = await getElements(`${INVENTORY.list}?page=${pageRow}&size=${size}`, {
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      setIsShow(0);
      return;
    }
    setRows(response.response.body.value);
    setCount(response.response.body.totalItems);
    setRowsPerPage(Number(size));
  };

  const filter = async (value) => {
    setIsShow(1);
    if (value == "") {
      getData(page);
      setIsShow(0);
      return;
    }
    var response = await getElements(`${FILTER.list}?search=${value}&location=${"car"}`, {
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      setIsShow(0);
      return;
    }
    setRows(response.response.body);
    setCount(response.response.body.length);
    setIsShow(0);
  };

  const changeStatus = async (obj) => {
    var response = await getElements(`${CARS.changeStatus.replace("{id}", obj.carId)}`, {
      "Content-Type": "application/json",
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.status.description, "error", "Error");
      return;
    }
  };

  const cancelInventory = async (obj) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "Are you sure cancel transfer?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        var response = await deleteElements(
          `${INVENTORY.cancelInventory.replace("{id}", obj.itId)}`,
          {
            "Content-Type": "application/json",
            jwt: `${user.id}`,
          }
        );
        if (response.status != 200) {
          showAlert(response.status.description, "error", "Error");
          return;
        }
        MySwal.fire("Cancel!", "Your transfer has been Cancel.", "success", "success");
        getData(page);
      }
    });
  };

  const confirmInventory = async (obj) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "Are you sure confirm transfer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        var response = await putElements(
          `${INVENTORY.confirmInventory.replace("{id}", obj.itId)}`,
          {
            "Content-Type": "application/json",
            jwt: `${user.id}`,
          },
          {}
        );
        if (response.status != 200) {
          showAlert(response.status.description, "error", "Error");
          return;
        }
        MySwal.fire("Confirmed!", "Your transfer has been Confirmed.", "success", "success");
        getData(page);
      }
    });
  };
  useEffect(() => {
    localStorage.setItem("rowsPerPage", "5");
    getData(page);
  }, []);

  return (
    <>
      <Head>
        <title>Inventory</title>
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
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Inventory</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              <div>
                <ButtonCustom
                  openModal={() => {
                    router.push("/car/new-car");
                  }}
                />
              </div>
            </Stack>
            <Search
              OnSearch={(res) => {
                filter(res);
              }}
              isShow={isShow}
              refresh={() => {
                getData(page);
              }}
            />
            <InventoryTable
              count={count}
              items={rows}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              OnEdit={(res) => {
                router.push({
                  pathname: "/car/new-car",
                  query: { id: res.carId },
                });
              }}
              OnChangeStatus={(res) => {
                changeStatus(res);
              }}
              OnReConfirm={(res) => {
                router.push({
                  pathname: "/inventory/reconfirm-inventory",
                  query: { id: res.itId },
                });
              }}
              OnCancel={(res) => {
                cancelInventory(res);
              }}
              OnConfirm={(res) => {
                confirmInventory(res);
              }}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
