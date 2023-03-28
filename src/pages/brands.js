import { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { BRANDS } from "../service/endpoints";
import { putElements, postElements, getElements, deleteElements } from "src/service/api";
import { useAuthContext } from "src/contexts/auth-context";
import TableCustomCatalog from "src/sections/global/table-custom";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@heroicons/react/24/solid/PencilIcon";
import DeleteIcon from "@heroicons/react/24/solid/TrashIcon";
import { ButtonCustom } from "src/sections/global/ButtonCustom";
import ModalBrand from "src/sections/brand/modal-brand";
import { showAlert } from "src/sections/global/alert";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const Page = () => {
  const company = JSON.parse(localStorage.getItem("company"));
  const { user } = useAuthContext();
  const [rows, setRows] = useState([]);
  const [edit, setEdit] = useState("New");
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState({
    brandId: "",
    brandName: "",
    isNew: false,
  });
  const columns = [
    { field: "brandId", headerName: "ID", type: "number", width: 100 },
    { field: "brandName", headerName: "NAME", width: 200 },
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
            <IconButton aria-label="delete" color="error" onClick={handlDeleteClick}>
              {
                <SvgIcon fontSize="small">
                  <DeleteIcon />
                </SvgIcon>
              }
            </IconButton>
          </Stack>
        );
      },
    },
  ];

  const openModal = (obj, isEdit) => {
    setOpen(true);
    if (isEdit) {
      setEdit("Edit");
      setRow((item) => ({
        ...item,
        ...{
          brandId: obj.brandId,
          brandName: obj.brandName,
          isNew: false,
        },
      }));
      return;
    }
    setEdit("New");
    setRow((item) => ({
      ...item,
      ...{
        brandId: "",
        brandName: "",
        isNew: true,
      },
    }));
  };

  const getData = async () => {
    var response = await getElements(`${BRANDS.list}?page=${0}&size=${500}`, {
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
    setRows(response.response.body.value);
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
      `${BRANDS.create}`,
      {
        "Content-Type": "application/json",
        jwt: `${user.id}`,
      },
      {
        name: obj.brandName,
      }
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
      `${BRANDS.update.replace("{id}", obj.brandId)}`,
      {
        "Content-Type": "application/json",
        jwt: `${user.id}`,
      },
      {
        name: obj.brandName,
      }
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
        var response = await deleteElements(`${BRANDS.delete.replace("{id}", obj.brandId)}`, {
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

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Head>
        <title>Customers | Devias Kit</title>
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
                <Typography variant="h4">BRANDS</Typography>
              </Stack>
              <div>
                <ButtonCustom
                  openModal={() => {
                    openModal({}, false);
                  }}
                />
                <ModalBrand
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
            <TableCustomCatalog rows={rows} columns={columns} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
