import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Autocomplete,
  Unstable_Grid2 as Grid,
  Modal,
} from "@mui/material";

import { useAuthContext } from "src/contexts/auth-context";
import { showAlert } from "src/sections/global/alert";
import { useRouter } from "next/navigation";
import { MODEL, TYPE, CARS, CLIENTS, FILTER } from "../../service/endpoints";
import { postElements, getElements } from "src/service/api";
import { CustomersTable } from "src/sections/customer/customers-table";
import { Fragment } from "react";
import { Search } from "src/sections/global/search";

const ChildModal = (props) => {
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [isShow, setIsShow] = useState(0);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    getData(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    localStorage.setItem("rowsPerPage", `${event.target.value}`);
    getData(page);
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const getData = async (pageRow = 0) => {
    let size = localStorage.getItem("rowsPerPage");
    var response = await getElements(`${CLIENTS.list}?page=${pageRow}&size=${size}`, {
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
    var response = await getElements(`${FILTER.list}?search=${value}&location=${"clients"}`, {
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

  useEffect(() => {
    getData(page, rowsPerPage);
  }, []);

  return (
    <Fragment>
      <Button onClick={handleOpen}>Search client</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box
          sx={{
            height: "70%",
            overflow: "auto",
            marginTop: "5%",
            marginLeft: "15%",
            marginRight: "15%",
            borderRadius: "1px",
            boxShadow: 24,
          }}
        >
          <Card>
            <Button
              sx={{
                position: "absolute",
                right: "15%",
                margin: "16px",
              }}
              onClick={handleClose}
            >
              X
            </Button>
            <CardHeader title="Client" />
            <CardContent sx={{ pt: 0 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <Search
                    OnSearch={(res) => {
                      filter(res);
                    }}
                    isShow={isShow}
                    refresh={() => {
                      getData(page);
                    }}
                  />
                </Grid>
                <Grid xs={12} md={12}>
                  <CustomersTable
                    isSecondary={1}
                    count={count}
                    items={rows}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    OnSee={(res) => {
                      handleClose();
                      props.OnSee(res);
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </Fragment>
  );
};

export const CarDetails = () => {
  const company = JSON.parse(localStorage.getItem("company"));
  const router = useRouter();
  const { user } = useAuthContext();
  const [values, setValues] = useState({
    car_number: "",
    car_passenger_quantity: "",
    car_model_id: "",
    car_type_id: "",
    car_year: "",
    car_color: "",
    car_motor: "",
    car_fuel: "GASOLINE",
    car_cylinders: "",
    car_cl_uuid: "",
    car_cl_name: "",
  });
  const [model, setModel] = useState([]);
  const [type, setType] = useState([]);

  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);

  const saveCar = async () => {
    values.car_year = Number(values.car_year);
    values.car_passenger_quantity = Number(values.car_passenger_quantity);
    values.car_cylinders = Number(values.car_cylinders);
    values.car_model_id = Number(values.car_model_id);
    values.car_type_id = Number(values.car_type_id);
    values.car_motor = Number(values.car_motor);

    var response = await postElements(
      `${CARS.create}`,
      {
        "Content-Type": "application/json",
        jwt: `${user.id}`,
      },
      values
    );
    if (response.status != 201) {
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
    showAlert("Car created successfully", "success", "Success");
    router.push("/cars");
  };

  const getModel = async (pageRow = 0) => {
    var response = await getElements(`${MODEL.list}?page=${pageRow}&size=${1000}`, {
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
    setModel(
      response.response.body.value.map((item) => ({ label: item.modelName, value: item.modelId }))
    );
  };

  const getType = async (pageRow = 0) => {
    var response = await getElements(`${TYPE.list}?page=${pageRow}&size=${1000}`, {
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
    setType(
      response.response.body.value.map((item) => ({
        label: item.carTypeName,
        value: item.carTypeId,
      }))
    );
  };

  useEffect(() => {
    getModel();
    getType();
  }, []);

  const filterOptions = (options, { inputValue }) =>
    options.filter((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1);

  const handleSelectModel = (event, value) => {
    if (value == null) {
      return;
    }
    setValues((prevState) => ({
      ...prevState,
      car_model_id: value.value,
    }));
  };

  const handleSelectType = (event, value) => {
    if (value == null) {
      return;
    }
    setValues((prevState) => ({
      ...prevState,
      car_type_id: value.value,
    }));
  };

  return (
    <div>
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Card>
          <CardHeader subheader="" title="" />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ m: -1.5 }}>
              <Grid container spacing={3}>
                <Grid xs={6} md={6}>
                  <TextField
                    fullWidth
                    label="Client"
                    name="car_cl_name"
                    onChange={handleChange}
                    required
                    value={values.car_cl_name}
                  />
                </Grid>
                <Grid xs={6} md={6}>
                  <ChildModal
                    OnSee={(res) => {
                      setValues((item) => ({
                        ...item,
                        ...{ car_cl_uuid: res.clUuid, car_cl_name: res.clName },
                      }));
                    }}
                  />
                </Grid>
                <Grid xs={6} md={6}>
                  <TextField
                    fullWidth
                    label="Number car"
                    name="car_number"
                    onChange={handleChange}
                    required
                    value={values.car_number}
                  />
                </Grid>
                <Grid xs={6} md={6}>
                  <TextField
                    fullWidth
                    type={"number"}
                    label="Passenger quantity"
                    name="car_passenger_quantity"
                    onChange={handleChange}
                    required
                    value={values.car_passenger_quantity}
                  />
                </Grid>
                <Grid xs={6} md={6}>
                  <Autocomplete
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    options={model}
                    filterOptions={filterOptions}
                    onChange={handleSelectModel}
                    renderInput={(params) => <TextField {...params} label="Select Model" />}
                  />
                </Grid>
                <Grid xs={6} md={6}>
                  <Autocomplete
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    options={type}
                    getOptionLabel={(option) => option.label}
                    filterOptions={filterOptions}
                    onChange={handleSelectType}
                    renderInput={(params) => <TextField {...params} label="Select Type" />}
                  />
                </Grid>
                <Grid xs={3} md={3}>
                  <TextField
                    fullWidth
                    label="Cylinders"
                    name="car_cylinders"
                    onChange={handleChange}
                    type={"number"}
                    required
                    value={values.car_cylinders}
                  />
                </Grid>
                <Grid xs={3} md={3}>
                  <TextField
                    fullWidth
                    label="year"
                    name="car_year"
                    onChange={handleChange}
                    type={"number"}
                    required
                    value={values.car_year}
                  />
                </Grid>
                <Grid xs={3} md={3}>
                  <TextField
                    fullWidth
                    label="Color"
                    name="car_color"
                    onChange={handleChange}
                    required
                    value={values.car_color}
                  />
                </Grid>
                <Grid xs={3} md={3}>
                  <TextField
                    fullWidth
                    label="Motor"
                    type={"number"}
                    name="car_motor"
                    onChange={handleChange}
                    required
                    value={values.car_motor}
                  />
                </Grid>
                <Grid xs={3} md={3}>
                  <TextField
                    fullWidth
                    label="Fuel"
                    name="car_fuel"
                    onChange={handleChange}
                    required
                    value={values.car_fuel}
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={saveCar}
              sx={{ backgroundColor: `${company.components.paletteColor.button} !important` }}
            >
              Save
            </Button>
          </CardActions>
        </Card>
      </form>
    </div>
  );
};
