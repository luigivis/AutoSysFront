import { useEffect, useState, useCallback } from "react";
import {
  Unstable_Grid2 as Grid,
  Stack,
  IconButton,
  SvgIcon,
  Button,
  Card,
  Typography,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useAuthContext } from "src/contexts/auth-context";
import { showAlert } from "src/sections/global/alert";
import { useRouter } from "next/router";
import { INVENTORY, BATCH, STORE, PRODUCTS } from "../../service/endpoints";
import { getElements, putElements } from "src/service/api";
import TableCustomCatalog from "src/sections/global/table-custom";
import EditIcon from "@heroicons/react/24/solid/PencilIcon";
import { CollapsibleTable } from "./inventory-modal-product";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export const InventoryNew = (props) => {
  const company = JSON.parse(localStorage.getItem("company"));
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [rowsProduct, setRowsProduct] = useState([]);
  const [store, setStore] = useState([]);
  const [values, setValues] = useState({
    strFrom: "",
    description: "",
    receptionDate: Date.now(),
  });
  const columns = [
    { field: "itdId", headerName: "Lote", type: "number", width: 100 },
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
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuthContext();
  const [rowsDetail, setRowsDetail] = useState([]);
  const [open, setOpen] = useState(false);

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

  const getData = async (pageRow = 0) => {
    var response = await getElements(`${STORE.list}?page=${pageRow}&size=${500}`, {
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
    setStore(
      response.response.body.value.map((item) => ({
        label: item.strName,
        value: item.strId,
      }))
    );
  };
  const getDataProduct = async (pageRow = 0) => {
    let size = localStorage.getItem("rowsPerPage");
    var response = await getElements(`${PRODUCTS.list}?page=${pageRow}&size=${size}`, {
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      setIsShow(0);
      return;
    }
    console.log(response.response.body.value);
    setRowsProduct(response.response.body.value);
    setCount(response.response.body.totalItems);
    setRowsPerPage(Number(size));
  };

  const filterOptions = (options, { inputValue }) =>
    options.filter((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1);

  const handleSelectModel = (event, value) => {
    if (value == null) {
      return;
    }
    setValues((prevState) => ({
      ...prevState,
      strFrom: value.value,
    }));
  };

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    getData(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    localStorage.setItem("rowsPerPage", `${event.target.value}`);
    getData(page);
  }, []);

  useEffect(() => {
    getData();
    localStorage.setItem("rowsPerPage", "5");
    getDataProduct(page);
  }, []);

  return (
    <>
      <Grid xs={12} md={12}>
        <Card sx={{ p: 2 }}>
          <Grid spacing={2}>
            <Grid xs={12} md={12}>
              <Typography variant="h5" gutterBottom>
                Store
              </Typography>
              <Autocomplete
                options={store}
                filterOptions={filterOptions}
                onChange={handleSelectModel}
                renderInput={(params) => <TextField {...params} label="Select Store" />}
              />
            </Grid>
            <Grid container spacing={2}>
              <Grid xs={6} md={6}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  onChange={(e) =>
                    setValues((item) => ({
                      ...item,
                      ...{ description: e.target.value },
                    }))
                  }
                  required
                  value={values.description}
                />
              </Grid>
              <Grid xs={6} md={6}>
                <TextField
                  fullWidth
                  label="Reception Date"
                  name="receptionDate"
                  type="date"
                  onChange={(e) =>
                    setValues((item) => ({
                      ...item,
                      ...{ receptionDate: e.target.value },
                    }))
                  }
                  required
                  value={values.receptionDate}
                />
              </Grid>
            </Grid>
            <Grid xs={2} md={2}>
              <Button
                sx={{
                  backgroundColor: `${company.components.paletteColor.button} !important`,
                  width: "100%",
                }}
                variant="contained"
                onClick={() => {}}
              >
                Search Product
              </Button>
            </Grid>
            <Grid item xs={12} md={12}>
              <TableCustomCatalog rows={rows} columns={columns} />
            </Grid>
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
          </Grid>
        </Card>
        <br />
        <Card sx={{ p: 2 }}>
          <Grid xs={12} md={12}>
            <CollapsibleTable
              count={count}
              rows={rowsProduct}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
            />
          </Grid>
        </Card>
      </Grid>
    </>
  );
};
