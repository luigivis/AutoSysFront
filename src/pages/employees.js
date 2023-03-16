import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { EmployeeTable } from "src/sections/employee/employees-table";
import { getElements } from "src/service/api";
import { postElements } from "src/service/api";
import EmployeeModal from "src/sections/employee/employees-modal";
import { EMPLOYEES } from "../service/endpoints";
import { FILTER } from "../service/endpoints";
import { showAlert } from "src/sections/global/alert";
import { useAuthContext } from "src/contexts/auth-context";
import { Search } from "src/sections/global/search";
const Page = () => {
  const { user } = useAuthContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [isShow, setIsShow] = useState(0);
  const [employee, setEmployee] = useState({
    empUuid: "",
    empName: "",
    empLastname: "",
    empIdentCard: "",
    empPhone: "",
    empEmail: "",
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

  const getData = async (pageRow = 0) => {
    let size = localStorage.getItem("rowsPerPage");
    var response = await getElements(`${EMPLOYEES.list}?page=${pageRow}&size=${size}`, {
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      setIsShow(0);
      return;
    }
    setEmployees(response.response.body.value);
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
    var response = await getElements(`${FILTER.list}?search=${value}&location=${"employees"}`, {
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      setIsShow(0);
      return;
    }
    setEmployees(response.response.body);
    setCount(response.response.body.length);
    setIsShow(0);
  };
  const openModal = (obj, isEdit) => {
    setOpen(true);
    if (isEdit) {
      setEdit("Edit");
      setEmployee((item) => ({
        ...item,
        ...{
          empUuid: obj.empUuid,
          empName: obj.empName,
          empLastname: obj.empLastname,
          empIdentCard: obj.empIdentCard,
          empPhone: obj.empPhone == null ? "" : obj.empPhone,
          empEmail: obj.empEmail == null ? "" : obj.empEmail,
          isNew: false,
        },
      }));
      return;
    }
    setEdit("New");
    setEmployee((item) => ({
      ...item,
      ...{
        empUuid: "",
        empName: "",
        empLastname: "",
        empIdentCard: "",
        empPhone: "",
        empEmail: "",
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
      `${EMPLOYEES.create}`,
      {
        "Content-Type": "application/json",
        jwt: `${user.id}`,
      },
      {
        ident_card: obj.empIdentCard,
        name: obj.empName,
        lastname: obj.empLastname,
        phone: obj.empPhone,
        email: obj.empEmail,
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
    var response = await postElements(
      `${EMPLOYEES.update.replace("{id}", obj.empUuid)}`,
      {
        "Content-Type": "application/json",
        jwt: `${user.id}`,
      },
      {
        ident_card: obj.empIdentCard,
        name: obj.empName,
        lastname: obj.empLastname,
        phone: obj.empPhone,
        email: obj.empEmail,
      }
    );
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
    getData(page);
    setOpen(false);
    showAlert("Success", "success", "Success");
  };

  const changeStatus = async (obj) => {
    var response = await getElements(`${EMPLOYEES.changeStatus.replace("{id}", obj.empUuid)}`, {
      "Content-Type": "application/json",
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
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
        <title>Employees</title>
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
                <Typography variant="h4">Employees</Typography>
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
                <EmployeeModal
                  data={employee}
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

            <EmployeeTable
              isSecondary={0}
              count={count}
              items={employees}
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
