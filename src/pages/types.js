import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { TypeTable } from "src/sections/type/types-table";
import { putElements, postElements, getElements, deleteElements } from "src/service/api";
import ModalType from "src/sections/type/modal-types";
import { TYPE } from "../service/endpoints";
import { FILTER } from "../service/endpoints";
import { showAlert } from "src/sections/global/alert";
import { useAuthContext } from "src/contexts/auth-context";
import { Search } from "src/sections/global/search";
import { ButtonCustom } from "src/sections/global/ButtonCustom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const Page = () => {
  const { user } = useAuthContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [isShow, setIsShow] = useState(0);
  const [row, setRow] = useState({
    carTypeId: "",
    carTypeName: "",
    isNew: false,
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
    var response = await getElements(`${TYPE.list}?page=${pageRow}&size=${size}`, {
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
    var response = await getElements(`${FILTER.list}?search=${value}&location=${"types"}`, {
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
  const openModal = (obj, isEdit) => {
    setOpen(true);
    if (isEdit) {
      setEdit("Edit");
      setRow((item) => ({
        ...item,
        ...{
          carTypeId: obj.carTypeId,
          carTypeName: obj.carTypeName,
          isNew: false,
        },
      }));
      return;
    }
    setEdit("New");
    setRow((item) => ({
      ...item,
      ...{
        carTypeId: "",
        carTypeName: "",
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
      `${TYPE.create}`,
      {
        "Content-Type": "application/json",
        jwt: `${user.id}`,
      },
      {
        name: obj.carTypeName,
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
    var response = await putElements(
      `${TYPE.update.replace("{id}", obj.carTypeId)}`,
      {
        "Content-Type": "application/json",
        jwt: `${user.id}`,
      },
      {
        name: obj.carTypeName,
      }
    );
    if (response.status != 200) {
      setOpen(false);
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

  const deleteData = async (obj) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        var response = await deleteElements(`${TYPE.delete.replace("{id}", obj.carTypeId)}`, {
          "Content-Type": "application/json",
          jwt: `${user.id}`,
        });
        if (response.status != 200) {
          setOpen(false);
          showAlert(response.response.status.description, "error", "Error");
          return;
        }
        MySwal.fire("Deleted!", "Your file has been deleted.", "success", "success");
        getData(page);
        setOpen(false);
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
        <title>Types</title>
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
                <Typography variant="h4">Types</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              <div>
                <ButtonCustom
                  openModal={() => {
                    openModal({}, false);
                  }}
                />
                <ModalType
                  data={row}
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
              refresh={() => {
                getData(page);
              }}
            />

            <TypeTable
              isSecondary={0}
              count={count}
              items={rows}
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
              OnDelete={(res) => {
                deleteData(res);
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
