import { useEffect, useState } from "react";
import {
  Unstable_Grid2 as Grid,
  Stack,
  IconButton,
  SvgIcon,
  Button,
  Card,
  Typography,
  TextField,
} from "@mui/material";
import { useAuthContext } from "src/contexts/auth-context";
import { showAlert } from "src/sections/global/alert";
import { useRouter } from "next/router";
import { INVENTORY, BATCH } from "../../service/endpoints";
import { getElements, putElements } from "src/service/api";
import TableCustomCatalog from "src/sections/global/table-custom";
import EditIcon from "@heroicons/react/24/solid/PencilIcon";
import ModalInventory from "./inventory-modal";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { SeverityPill } from "src/components/severity-pill";

export const InventoryReconFimr = (props) => {
  const company = JSON.parse(localStorage.getItem("company"));
  const [rows, setRows] = useState([]);
  const [transfer, setTransfer] = useState({
    itId: 0,
    itDescription: "",
    itCreationDate: "",
    itToStrId: { strName: "" },
    itUsId: { usUsername: "", usEmployeeUuid: { empName: "", empLastname: "" } },
    data: "",
    itReceptionDate: "",
  });
  const columns = [
    { field: "itdIbtIdLote", headerName: "Lote", type: "number", width: 100 },
    { field: "productConfirm", headerName: "Product", width: 200 },
    {
      field: "itdPrQuantity",
      headerName: "Quantity",
      type: "number",
      width: 200,
      renderCell: (params) => {
        return (
          <Stack direction="row" alignItems="center" spacing={0}>
            <TextField
              id="standard-basic"
              variant="standard"
              value={params.row.itdPrQuantity}
              sx={{
                ...{
                  "& .MuiInput-input": {
                    textAlign: "end !important",
                  },
                },
              }}
              onChange={(e) => {
                const updatedRows = rows.map((row) => {
                  if (row.itdId === params.row.itdId) {
                    return { ...row, itdPrQuantity: e.target.value };
                  }
                  return row;
                });
                setRows(updatedRows);
              }}
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
          getBatchByProductId(params.row);
        };
        return (
          <Stack direction="row" alignItems="center" spacing={0}>
            <IconButton
              aria-label="edit"
              title="Edit lote"
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
  const columnsDetails = [
    { field: "ibtId", headerName: "Lote", type: "number", width: 100 },
    { field: "productConfirmDetail", headerName: "Product", width: 200 },
    { field: "ibtPrQuantity", headerName: "Quantity", width: 200 },
    {
      field: "options",
      headerName: "OPTIONS",
      width: 200,
      renderCell: (params) => {
        const handleEditClick = () => {
          var dt = rows.map((row) => {
            if (row.itdIbtId.productsByIbtPrId.prId == params.row.productsByIbtPrId.prId) {
              row.itdId = params.row.ibtId;
            }
            return row;
          });
          setRows(dt);
          setOpen(false);
        };
        return (
          <Stack direction="row" alignItems="center" spacing={0}>
            <IconButton
              aria-label="edit"
              title="Edit lote"
              sx={{ color: company.components.paletteColor.button }}
              onClick={handleEditClick}
            >
              {
                <SvgIcon fontSize="small">
                  <CheckCircleOutlineIcon />
                </SvgIcon>
              }
            </IconButton>
          </Stack>
        );
      },
    },
  ];
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuthContext();
  const [rowsDetail, setRowsDetail] = useState([]);
  const [open, setOpen] = useState(false);
  const getData = async () => {
    var response = await getElements(`${INVENTORY.findById.replace("{id}", id)}`, {
      jwt: `${user.id}`,
    });
    if (response.status == 404) return;
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
    console.log(response.response.body.transferDetail);
    let refactorList = response.response.body.transferDetail.map((item, index) => {
      return {
        ...item,
        id: index,
        productConfirm: item.itdIbtId == null ? "" : item.itdIbtId.productsByIbtPrId.prName,
      };
    });
    setRows(refactorList);
    let res = response.response.body.transfer;
    var data;
    switch (res.itStatus) {
      case 0:
        data = <SeverityPill color={"error"}>Cancel</SeverityPill>;
        break;
      case 1:
        data = <SeverityPill color={"success"}>Confirmed</SeverityPill>;
        break;
      case 2:
        data = <SeverityPill color={"warning"}>Pending</SeverityPill>;
        break;
      case 3:
        data = <SeverityPill color={"warning"}>Pending Str</SeverityPill>;
        break;
      case 4:
        data = <SeverityPill color={"warning"}>Cancel Str</SeverityPill>;
        break;
      case 6:
        data = <SeverityPill color={"error"}>Cancel Expired</SeverityPill>;
        break;
    }
    setTransfer((prevState) => ({
      ...prevState,
      itId: res.itId,
      itDescription: res.itDescription,
      itCreationDate: res.itCreationDate,
      itToStrId: { strName: res.itToStrId.strName },
      itUsId: {
        usUsername: res.itUsId.usUsername,
        usEmployeeUuid: {
          empName: res.itUsId.usEmployeeUuid.empName,
          empLastname: res.itUsId.usEmployeeUuid.empLastname,
        },
      },
      data: data,
      itReceptionDate: res.itReceptionDate,
    }));
  };

  const getBatchByProductId = async (data) => {
    console.log(data);
    var response = await getElements(
      `${BATCH.findByProductId.replace("{id}", data.itdIbtId.productsByIbtPrId.prId)}`,
      {
        jwt: `${user.id}`,
      }
    );
    if (response.status == 404) return;
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
    console.log(response.response.body);
    setRowsDetail(response.response.body);
    setOpen(true);
  };

  const reconFirm = async (data) => {
    var response = await putElements(
      `${INVENTORY.reconFirmInventory.replace("{id}", id)}`,
      {
        "Content-Type": "application/json",
        jwt: `${user.id}`,
      },
      { products: data }
    );
    if (response.status == 404) return;
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
    console.log(response);
    showAlert("Success", "success", "Success");
    props.OnSave();
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Grid xs={12} md={12}>
        <Card sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={8} md={8}>
              <Typography variant="h4" gutterBottom>
                TRF-{transfer.itId}-{transfer.itDescription}
                <br></br>
                <Typography variant="h6" gutterBottom>
                  {transfer.itCreationDate}
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={2} md={2}>
              <Button
                sx={{
                  backgroundColor: `${company.components.paletteColor.button} !important`,
                  width: "100%",
                }}
                variant="contained"
                onClick={() => {
                  var data = rows.map((row) => {
                    return {
                      ibtId: row.itdId,
                      prQuantity: row.itdPrQuantity,
                    };
                  });
                  reconFirm(data);
                }}
              >
                Save
              </Button>
            </Grid>
            <Grid item xs={2} md={2}>
              <Button
                sx={{
                  backgroundColor: `${company.components.paletteColor.button} !important`,
                  width: "100%",
                }}
                variant="contained"
                onClick={() => {}}
              >
                Download
              </Button>
            </Grid>
          </Grid>
        </Card>
        <br />
        <Card sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={3} md={3}>
              <Typography variant="h5" gutterBottom>
                Store
              </Typography>
              <Typography variant="h6" gutterBottom>
                {transfer.itToStrId.strName}
              </Typography>
            </Grid>
            <Grid item xs={3} md={3}>
              <Typography variant="h5" gutterBottom>
                User
              </Typography>
              <Typography variant="h6" gutterBottom>
                {transfer.itUsId.usUsername}
              </Typography>
            </Grid>
            <Grid item xs={3} md={3}>
              <Typography variant="h5" gutterBottom>
                Status
              </Typography>
              <Typography variant="h6" gutterBottom>
                {transfer.data}
              </Typography>
            </Grid>
            <Grid item xs={3} md={3}>
              <Typography variant="h5" gutterBottom>
                Employee
              </Typography>
              <Typography variant="h6" gutterBottom>
                {transfer.itUsId.usEmployeeUuid.empName}{" "}
                {transfer.itUsId.usEmployeeUuid.empLastname}
              </Typography>
            </Grid>
            <Grid item xs={4} md={4}>
              <Typography variant="h5" gutterBottom>
                Reception Date
              </Typography>
              <Typography variant="h6" gutterBottom>
                {transfer.itReceptionDate}
              </Typography>
            </Grid>
            <br />
            <Grid item xs={12} md={12} sx={{ textAlign: "center" }}>
              <Typography variant="h3" gutterBottom>
                Items
              </Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <TableCustomCatalog rows={rows} columns={columns} />
              <ModalInventory
                rows={rowsDetail}
                columns={columnsDetails}
                open={open}
                OnClose={() => {
                  setOpen(false);
                }}
                OnSend={(res) => {
                  SendData(res);
                }}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </>
  );
};
