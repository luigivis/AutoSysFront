import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import { Box, Container, Stack, Typography, SvgIcon } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ModelTable } from "src/sections/model/models-table";
import { putElements, postElements, getElements } from "src/service/api";
import ModalModel from "src/sections/model/modal-model";
import { MODEL } from "../service/endpoints";
import { FILTER } from "../service/endpoints";
import { showAlert } from "src/sections/global/alert";
import { useAuthContext } from "src/contexts/auth-context";
import { ButtonCustom } from "src/sections/global/ButtonCustom";
import withReactContent from "sweetalert2-react-content";
import TableCustomCatalog from "src/sections/global/table-custom";
import Swal from "sweetalert2";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@heroicons/react/24/solid/PencilIcon";
import DeleteIcon from "@heroicons/react/24/solid/TrashIcon";

const Page = () => {
  const company = JSON.parse(localStorage.getItem("company"));
  const columns = [
    { field: "modelId", headerName: "ID", type: "number", width: 100 },
    { field: "modelName", headerName: "Model", width: 200 },
    { field: "brandName", headerName: "Brand", width: 200 },
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
  const { user } = useAuthContext();
  const [, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState({
    modelId: "",
    modelName: "",
    modelBrandId: "",
    modelBrandName: "",
    isNew: false,
  });
  const [edit, setEdit] = useState("New");

  const getData = async () => {
    var response = await getElements(`${MODEL.list}?page=${0}&size=${1000}`, {
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
          modelId: obj.modelId,
          modelName: obj.modelName,
          modelBrandId: obj.modelBrandId.brandId,
          modelBrandName: obj.modelBrandId.brandName,
          isNew: false,
        },
      }));
      return;
    }
    setEdit("New");
    setRow((item) => ({
      ...item,
      ...{
        modelId: "",
        modelName: "",
        modelBrandId: "",
        modelBrandName: "",
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
      `${MODEL.create}`,
      {
        "Content-Type": "application/json",
        jwt: `${user.id}`,
      },
      {
        name: obj.modelName,
        brand_id: obj.modelBrandId,
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
      `${MODEL.update.replace("{id}", obj.modelId)}`,
      {
        "Content-Type": "application/json",
        jwt: `${user.id}`,
      },
      {
        name: obj.modelName,
        brand_id: obj.modelBrandId,
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
        var response = await getElements(`${MODEL.delete.replace("{id}", obj.modelId)}`, {
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
    localStorage.setItem("rowsPerPage", "5");
    getData();
  }, []);

  return (
    <>
      <Head>
        <title>Models</title>
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
                <Typography variant="h4">Models</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              <div>
                <ButtonCustom
                  openModal={() => {
                    openModal({}, false);
                  }}
                />
                <ModalModel
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
