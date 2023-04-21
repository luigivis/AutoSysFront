import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Unstable_Grid2 as Grid,
  TextField,
  Divider,
  CardActions,
  Autocomplete,
} from "@mui/material";

import { ButtonCustomSend } from "../global/ButtonCustomSend";
import { BRANDS_PRODUCT, CATEGORY_PRODUCT } from "src/service/endpoints";
import { getElements } from "src/service/api";
import { useAuthContext } from "src/contexts/auth-context";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "55%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 5,
};

const ProductModal = (props) => {
  const [data, setData] = React.useState(props.data);
  const { user } = useAuthContext();
  const [brands, SetBrands] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const getBrands = async (pageRow = 0) => {
    var response = await getElements(`${BRANDS_PRODUCT.list}?page=${pageRow}&size=${1000}`, {
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
    SetBrands(
      response.response.body.value.map((item) => ({ label: item.prBrName, value: item.prBrId }))
    );
  };

  const getType = async (pageRow = 0) => {
    var response = await getElements(`${CATEGORY_PRODUCT.list}?page=${pageRow}&size=${1000}`, {
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
    setCategories(
      response.response.body.value.map((item) => ({
        label: item.prcName,
        value: item.prcId,
      }))
    );
  };
  const filterOptions = (options, { inputValue }) =>
    options.filter((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1);

  const handleSelectBrand = (event, value) => {
    if (value == null) {
      return;
    }
    setData((prevState) => ({
      ...prevState,
      productBrandByPrBrandId: value.value,
      brand: { label: value.label, value: value.value },
    }));
  };

  const handleSelectCategory = (event, value) => {
    if (value == null) {
      return;
    }
    setData((prevState) => ({
      ...prevState,
      productCategoryByPrCategoryId: value.value,
      category: { label: value.label, value: value.value },
    }));
  };
  React.useEffect(() => {
    getBrands();
    getType();
    setData(props.data);
  }, [props.data]);
  return (
    <div>
      <Modal
        open={props.open}
        onClose={() => {
          props.OnClose(true);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        id="modal-modal"
      >
        <Card sx={style}>
          <Button
            sx={{
              position: "absolute",
              top: "0",
              right: "0",
              margin: "16px",
            }}
            onClick={() => props.OnClose(true)}
          >
            X
          </Button>
          <CardHeader subheader={props.edit} title="Product" />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ m: -1.5 }}>
              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    id="prName"
                    value={data.prName}
                    onChange={(e) =>
                      setData((item) => ({
                        ...item,
                        ...{ prName: e.target.value },
                      }))
                    }
                    required
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Description"
                    id="prDescription"
                    value={data.prDescription}
                    onChange={(e) =>
                      setData((item) => ({
                        ...item,
                        ...{ prDescription: e.target.value },
                      }))
                    }
                    required
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="BarCode"
                    id="prBarCode"
                    value={data.prBarCode}
                    onChange={(e) =>
                      setData((item) => ({
                        ...item,
                        ...{ prBarCode: e.target.value },
                      }))
                    }
                    required
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Prices"
                    id="prPrices"
                    value={data.prPrices}
                    onChange={(e) =>
                      setData((item) => ({
                        ...item,
                        ...{ prPrices: e.target.value },
                      }))
                    }
                    required
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <Autocomplete
                    options={brands}
                    filterOptions={filterOptions}
                    onChange={handleSelectBrand}
                    value={data.brand}
                    renderInput={(params) => <TextField {...params} label="Select Brand" />}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <Autocomplete
                    options={categories}
                    filterOptions={filterOptions}
                    onChange={handleSelectCategory}
                    value={data.category}
                    renderInput={(params) => <TextField {...params} label="Select Category" />}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    id="prQuantity"
                    value={data.prQuantity}
                    onChange={(e) =>
                      setData((item) => ({
                        ...item,
                        ...{ prQuantity: e.target.value },
                      }))
                    }
                    required
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="AvgCost"
                    id="prAvgCost"
                    value={data.prAvgCost}
                    onChange={(e) =>
                      setData((item) => ({
                        ...item,
                        ...{ prAvgCost: e.target.value },
                      }))
                    }
                    required
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="StockSecurity"
                    id="prStockSecurity"
                    value={data.prStockSecurity}
                    onChange={(e) =>
                      setData((item) => ({
                        ...item,
                        ...{ prStockSecurity: e.target.value },
                      }))
                    }
                    required
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <ButtonCustomSend
              OnSend={() => {
                props.OnSend(data);
              }}
            ></ButtonCustomSend>
          </CardActions>
        </Card>
      </Modal>
    </div>
  );
};

export default ProductModal;
