import { useCallback, useState, useEffect } from "react";
import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { UserTable } from "src/sections/user/users-table";
import { Search } from "src/sections/global/search";
import { getElements } from "src/service/api";
import { postElements } from "src/service/api";
import { putElements } from "src/service/api";
import UserModal from "src/sections/user/users-modal";
import { USER } from "../service/endpoints";
import { FILTER } from "../service/endpoints";
import { showAlert } from "src/sections/global/alert";
import { useAuthContext } from "src/contexts/auth-context";

const Page = () => {
  const { user } = useAuthContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [isShow, setIsShow] = useState(0);
  const [userBody, setUserBody] = useState({
    usId: "",
    usUsername: "",
    password: "",
    empName: "",
    usRoleId: 1,
    usCreatedAt: "",
    employeeUuid: "",
    isNew: true,
  });
  const [count, setCount] = useState(0);
  const [edit, setEdit] = useState("New");

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    getData(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    localStorage.setItem("rowsPerPage", `${event.target.value}`);
    getData(page);
  }, []);

  const getData = async (pageRow = 0, SizeRow = rowsPerPage) => {
    let size = localStorage.getItem("rowsPerPage");
    var response = await getElements(`${USER.list}?page=${pageRow}&size=${size}`, {
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
    var response = await getElements(`${FILTER.list}?search=${value}&location=${"users"}`, {
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
          password: obj.password,
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

  const SendData = (obj) => {
    if (obj.isNew) {
      create(obj);
      return;
    } else {
      update(obj);
      return;
    }
  };

  const create = async (obj) => {
    var response = await postElements(
      `${USER.create}`,
      {
        "Content-Type": "application/json",
        jwt: `${user.id}`,
      },
      {
        username: obj.usUsername,
        password: obj.password,
        roleId: obj.usRoleId,
        employeeUuid: obj.employeeUuid,
      }
    );
    if (response.status != 201) {
      setOpen(false);
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
    getData(page);
    setOpen(false);
    showAlert("Success", "success", "Success");
  };

  const update = async (obj) => {
    switch (obj.usRoleId) {
      case "1":
        obj.usRoleId = "ADMIN";
        break;
      case "2":
        obj.usRoleId = "SUPERVISOR";
        break;
      case "3":
        obj.usRoleId = "CASHIER";
        break;
    }
    var response = await putElements(
      `${USER.update.replace("{id}", obj.usId).replace("{idrol}", obj.usRoleId)}`,
      {
        "Content-Type": "application/json",
        jwt: `${user.id}`,
      },
      {}
    );
    if (response.status != 200) {
      setOpen(false);
      showAlert(response.status.description, "error", "Error");
      return;
    }
    getData(page);
    setOpen(false);
    showAlert("Success", "success", "Success");
  };

  const changeStatus = async (obj) => {
    var response = await getElements(`${USER.changeStatus.replace("{id}", obj.usId)}`, {
      "Content-Type": "application/json",
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.status.description, "error", "Error");
      return;
    }
  };

  useEffect(() => {
    getData(page);
    localStorage.setItem("rowsPerPage", "5");
  }, []);

  return (
    <>
      <Head>
        <title>Users</title>
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
                <Typography variant="h4">Users</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={() => {
                    openModal({}, false);
                  }}
                  id="modal-button"
                >
                  New
                </Button>
                <UserModal
                  data={userBody}
                  title={"New"}
                  open={open}
                  edit={edit}
                  OnClose={() => {
                    setOpen(false);
                  }}
                  OnSend={(res) => {
                    SendData(res);
                  }}
                />
              </div>
            </Stack>
            <Search
              OnSearch={(res) => {
                filter(res);
              }}
              isShow={isShow}
            />
            <UserTable
              count={count}
              items={users}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              OnEdit={(res) => {
                openModal(res, true);
              }}
              OnChangeStatus={(res) => {
                changeStatus(res);
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
