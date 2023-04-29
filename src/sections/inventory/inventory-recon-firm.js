import { useEffect, useState } from "react";
import { Unstable_Grid2 as Grid, Stack, IconButton, SvgIcon, Button } from "@mui/material";
import { useAuthContext } from "src/contexts/auth-context";
import { showAlert } from "src/sections/global/alert";
import { useRouter } from "next/router";
import { INVENTORY, BATCH } from "../../service/endpoints";
import { getElements, putElements } from "src/service/api";
import TableCustomCatalog from "src/sections/global/table-custom";
import EditIcon from "@heroicons/react/24/solid/PencilIcon";
import ModalInventory from "./inventory-modal";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export const InventoryReconFimr = (props) => {
  const company = JSON.parse(localStorage.getItem("company"));
  const [rows, setRows] = useState([]);
  const columns = [
    { field: "itdId", headerName: "Lote", type: "number", width: 100 },
    { field: "productConfirm", headerName: "Product", width: 200 },
    { field: "itdPrQuantity", headerName: "Quantity", width: 200 },
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
    setRows(response.response.body.transferDetail);
  };

  const getBatchByProductId = async (data) => {
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
    </>
  );
};
