import { useState, useEffect } from "react";
import Head from "next/head";
import { Box, Container, Stack, Typography, SvgIcon, Switch } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { putElements, postElements, getElements, deleteElements } from "src/service/api";
import ModalStore from "src/sections/store/modal-store";
import ModalStoreConfirm from "src/sections/store/modal-confirm-store";
import { STORE } from "../service/endpoints";
import { showAlert } from "src/sections/global/alert";
import { useAuthContext } from "src/contexts/auth-context";
import { ButtonCustom } from "src/sections/global/ButtonCustom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import TableCustomCatalog from "src/sections/global/table-custom";
import EditIcon from "@heroicons/react/24/solid/PencilIcon";
import { SeverityPill } from "src/components/severity-pill";
import IconButton from "@mui/material/IconButton";
import EmailIcon from "@mui/icons-material/Email";

const Page = () => {
  const company = JSON.parse(localStorage.getItem("company"));
  const { user } = useAuthContext();
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isShow, setIsShow] = useState(0);
  const [row, setRow] = useState({
    strId: "",
    name: "",
    details: "",
    phone: "",
    email: "",
    address: "",
    code: "",
    isNew: false,
  });
  const columns = [
    { field: "strId", headerName: "ID", type: "number", width: 100 },
    { field: "strName", headerName: "NAME", width: 200 },
    { field: "strDetails", headerName: "Details", width: 200 },
    { field: "strPhone", headerName: "Phone", width: 200 },
    { field: "strEmail", headerName: "Email", width: 200 },
    {
      field: "aaa",
      headerName: "Store Status",
      width: 200,
      renderCell: (params) => {
        const handleClick = () => {
          openModalConfirm(params.row);
        };
        switch (params.row.strStatus) {
          case 1:
            return <SeverityPill color={"success"}>Actived</SeverityPill>;
          case 0:
            return <SeverityPill color={"error"}>Disable</SeverityPill>;
          case 3:
            return (
              <Stack direction="row" alignItems="center" spacing={0}>
                <SeverityPill color={"warning"}>Pending</SeverityPill>
                <IconButton onClick={handleClick}>
                  <EmailIcon />
                </IconButton>
              </Stack>
            );
        }
      },
    },
    {
      field: "strStatus",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        const handleClick = () => {
          changeStatus(params.row);
        };
        return (
          <Stack direction="row" alignItems="center" spacing={0}>
            <Switch
              defaultChecked={params.row.strStatus === 1 ? true : false}
              color={company.components.paletteColor.toggle}
              onChange={handleClick}
            />
          </Stack>
        );
      },
    },
    {
      field: "options",
      headerName: "OPTIONS",
      width: 200,
      renderCell: (params) => {
        const handleEditClick = () => {
          openModal(params.row, true);
        };
        const handlDeleteClick = () => {
          deleteData(params.row);
        };
        return (
          <Stack direction="row" alignItems="center" spacing={0}>
            <IconButton
              aria-label="edit"
              sx={{ color: company.components.paletteColor.button }}
              onClick={handleEditClick}
            >
              {
                <SvgIcon fontSize="small">
                  <EditIcon />
                </SvgIcon>
              }
            </IconButton>
          </Stack>
        );
      },
    },
  ];
  const [edit, setEdit] = useState("New");

  const getData = async (pageRow = 0) => {
    var response = await getElements(`${STORE.list}?page=${pageRow}&size=${500}`, {
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      setIsShow(0);
      return;
    }
    setRows(response.response.body.value);
  };

  const openModal = (obj, isEdit) => {
    setOpen(true);
    if (isEdit) {
      setEdit("Edit");
      setRow((item) => ({
        ...item,
        ...{
          strId: obj.strId,
          name: obj.strName,
          details: obj.strDetails,
          phone: obj.strPhone,
          email: obj.strEmail,
          address: obj.strAddress,
          isNew: false,
        },
      }));
      return;
    }
    setEdit("New");
    setRow((item) => ({
      ...item,
      ...{
        strId: "",
        name: "",
        details: "",
        phone: "",
        email: "",
        address: "",
        isNew: true,
      },
    }));
  };

  const openModalConfirm = (obj) => {
    setOpenConfirm(true);
    setRow((item) => ({
      ...item,
      ...{
        email: obj.strEmail,
        code: "",
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
      `${STORE.create}`,
      {
        "Content-Type": "application/json",
        jwt: `${user.id}`,
      },
      obj
    );
    if (response.status != 201) {
      setOpen(false);
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
    getData();
    setOpen(false);
    showAlert("Success", "success", "Success");
  };

  const update = async (obj) => {
    var response = await putElements(
      `${STORE.update.replace("{id}", obj.strId)}`,
      {
        "Content-Type": "application/json",
        jwt: `${user.id}`,
      },
      obj
    );
    if (response.status != 200) {
      setOpen(false);
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
    getData();
    setOpen(false);
    showAlert("Success", "success", "Success");
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
        getData();
        setOpen(false);
      }
    });
  };

  const changeStatus = async (obj) => {
    var response = await putElements(`${STORE.changeStatus.replace("{id}", obj.strId)}`, {
      "Content-Type": "application/json",
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
  };

  const confirmStore = async (obj) => {
    var response = await postElements(
      `${STORE.confirm}`,
      {
        "Content-Type": "application/json",
        jwt: `${user.id}`,
      },
      {
        email: obj.email,
        code: obj.code,
      }
    );
    if (response.status != 200) {
      setOpenConfirm(false);
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
    getData();
    setOpenConfirm(false);
    showAlert("Success", "success", "Success");
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Head>
        <title>Stores</title>
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
                <Typography variant="h4">Stores</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              <div>
                <ButtonCustom
                  openModal={() => {
                    openModal({}, false);
                  }}
                />
                <ModalStore
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
                <ModalStoreConfirm
                  data={row}
                  open={openConfirm}
                  OnClose={() => {
                    setOpenConfirm(false);
                  }}
                  OnSend={(res) => {
                    confirmStore(res);
                  }}
                />
              </div>
            </Stack>
            <TableCustomCatalog rows={rows} columns={columns} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
