import { useCallback, useState, useEffect } from "react";
import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersTable } from "src/sections/customer/customers-table";
import { Search } from "src/sections/global/search";
import { getElements } from "src/service/api";
import { postElements } from "src/service/api";
import CustomerModal from "src/sections/customer/customers-modal";
import { CLIENTS } from "../service/endpoints";
import { showAlert } from "src/sections/global/alert";
import { useAuthContext } from "src/contexts/auth-context";
import { FILTER } from "../service/endpoints";
const Page = () => {
  const { user } = useAuthContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [isShow, setIsShow] = useState(0);
  const [customer, setCustomer] = useState({
    clUuid: "",
    clName: "",
    clLastName: "",
    clIdentification: "",
    clPhone: "",
    clEmail: "",
    clAddress: "",
    isNew: true,
  });
  const [count, setCount] = useState(0);
  const [edit, setEdit] = useState("New");

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    getCustomers(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    localStorage.setItem("rowsPerPage", `${event.target.value}`);
    getCustomers(page);
  }, []);

  const getCustomers = async (pageRow = 0) => {
    let size = localStorage.getItem("rowsPerPage");
    var response = await getElements(`${CLIENTS.list}?page=${pageRow}&size=${size}`, {
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      setIsShow(0);
      return;
    }
    setCustomers(response.response.body.value);
    setCount(response.response.body.totalItems);
    setRowsPerPage(Number(size));
  };
  const filter = async (value) => {
    setIsShow(1);
    if (value == "") {
      getCustomers(page);
      setIsShow(0);
      return;
    }
    var response = await getElements(`${FILTER.list}?search=${value}&location=${"clients"}`, {
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      setIsShow(0);
      return;
    }
    setCustomers(response.response.body);
    setCount(response.response.body.length);
    setIsShow(0);
  };
  const openModal = (obj, isEdit) => {
    setOpen(true);
    if (isEdit) {
      setEdit("Edit");
      setCustomer((item) => ({
        ...item,
        ...{
          clUuid: obj.clUuid,
          clName: obj.clName,
          clLastName: obj.clLastName,
          clIdentification: obj.clIdentification,
          clPhone: obj.clPhone == null ? "" : obj.clPhone,
          clEmail: obj.clEmail == null ? "" : obj.clEmail,
          clAddress: obj.clAddress == null ? "" : obj.clAddress,
          isNew: false,
        },
      }));
      return;
    }
    setEdit("New");
    setCustomer((item) => ({
      ...item,
      ...{
        clUuid: "",
        clName: "",
        clLastName: "",
        clIdentification: "",
        clPhone: "",
        clEmail: "",
        clAddress: "",
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
      `${CLIENTS.create}`,
      {
        "Content-Type": "application/json",
        jwt: `${user.id}`,
      },
      {
        ident_card: obj.clIdentification,
        name: obj.clName,
        last_name: obj.clLastName,
        phone: obj.clPhone,
        email: obj.clEmail,
        address: obj.clAddress,
      }
    );
    if (response.status != 201) {
      setOpen(false);
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
    getCustomers(page);
    setOpen(false);
    showAlert("Success", "success", "Success");
  };

  const update = async (obj) => {
    var response = await postElements(
      `${CLIENTS.update.replace("{id}", obj.clUuid)}`,
      {
        "Content-Type": "application/json",
        jwt: `${user.id}`,
      },
      {
        ident_card: obj.clIdentification,
        name: obj.clName,
        last_name: obj.clLastName,
        phone: obj.clPhone,
        email: obj.clEmail,
        address: obj.clAddress,
        ident_card: obj.clIdentification,
      }
    );
    if (response.status != 200) {
      setOpen(false);
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
    getCustomers(page);
    setOpen(false);
    showAlert("Success", "success", "Success");
  };

  const changeStatus = async (obj) => {
    var response = await getElements(`${CLIENTS.changeStatus.replace("{id}", obj.clUuid)}`, {
      "Content-Type": "application/json",
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
  };

  useEffect(() => {
    getCustomers(page);
    localStorage.setItem("rowsPerPage", "5");
  }, []);

  return (
    <>
      <Head>
        <title>Customers</title>
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
                <Typography variant="h4">Customers</Typography>
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
                <CustomerModal
                  customer={customer}
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
            <CustomersTable
              count={count}
              items={customers}
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
