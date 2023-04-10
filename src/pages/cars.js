import { useCallback, useState, useEffect } from "react";
import Head from "next/head";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CarTable } from "src/sections/car/cars-table";
import { Search } from "src/sections/global/search";
import { getElements } from "src/service/api";
import { postElements } from "src/service/api";
import { putElements } from "src/service/api";
import UserModal from "src/sections/user/users-modal";
import { CARS } from "../service/endpoints";
import { FILTER } from "../service/endpoints";
import { showAlert } from "src/sections/global/alert";
import { useAuthContext } from "src/contexts/auth-context";
import { ButtonCustom } from "src/sections/global/ButtonCustom";
import { useRouter } from "next/navigation";

const Page = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users, setUsers] = useState([]);
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
    var response = await getElements(`${CARS.list}?page=${pageRow}&size=${size}`, {
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      setIsShow(0);
      return;
    }
    setUsers(response.response.body.value);
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
    setUsers(response.response.body);
    setCount(response.response.body.length);
    setIsShow(0);
  };

  const openModal = (obj, isEdit) => {
    setOpen(true);
    if (isEdit) {
      setEdit("Edit");
      setUserBody((item) => ({
        ...item,
        ...{
          usId: obj.usId,
          usUsername: obj.usUsername,
          password: "",
          empName: obj.usEmployeeUuid.empName,
          usRoleId: obj.usRoleId,
          usCreatedAt: obj.usCreatedAt,
          employeeUuid: "",
          isNew: false,
        },
      }));
      return;
    }
    setEdit("New");
    setUserBody((item) => ({
      ...item,
      ...{
        usId: "",
        usUsername: "",
        password: "",
        empName: "",
        usRoleId: 1,
        usCreatedAt: "",
        employeeUuid: "",
        isNew: true,
      },
    }));
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

  useEffect(() => {
    localStorage.setItem("rowsPerPage", "5");
    getData(page);
  }, []);

  return (
    <>
      <Head>
        <title>Cars</title>
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
                <Typography variant="h4">Cars</Typography>
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
            <CarTable
              count={count}
              items={users}
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
              OnSee={(res) => {
                router.push({
                  pathname: "/car/see-car",
                  query: { id: res.carClUuid.clUuid },
                });
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
