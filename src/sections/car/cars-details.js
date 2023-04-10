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
import { MODEL, TYPE, CARS, CLIENTS, FILTER, LOGIN } from "../../service/endpoints";
import { postElements, getElements, putElements } from "src/service/api";
import { CustomersTable } from "src/sections/customer/customers-table";
import { Fragment } from "react";
import { Search } from "src/sections/global/search";
import { useRouter as useRouterQuery } from "next/router";
const fuel = [
  { value: "GASOLINE", label: "GASOLINE" },
  { value: "DIESEL", label: "DIESEL" },
  { value: "BIO-DIESEL", label: "BIO-DIESEL" },
  { value: "Ethanol", label: "Ethanol" },
  { value: "HYBRID", label: "HYBRID" },
  { value: "ELECT", label: "ELECT" },
];

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
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            maxHeight: "80vh",
            overflow: "auto",
          }}
        >
          <Card>
            <Grid container>
              <Grid xs={6} md={6}>
                <CardHeader title="Client" />
              </Grid>
              <Grid xs={6} md={6} sx={{ textAlign: "end" }}>
                <Button onClick={handleClose}>X</Button>
              </Grid>
            </Grid>
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
  const routerQuery = useRouterQuery();
  const { id } = routerQuery.query;
  const { user } = useAuthContext();
  const [values, setValues] = useState({
    car_number: "",
    car_passenger_quantity: "",
    car_model_id: "",
    car_type_id: "",
    car_year: "",
    car_color: "",
    car_motor: "",
    car_fuel: "",
    car_cylinders: "",
    car_cl_uuid: "",
    car_cl_name: "",
    car_mileage: "",
    tire_mileage: "",
    model: "",
    type: "",
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
    if (id == undefined) {
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
    } else {
      var body = values;
      delete body.car_cl_name;
      delete body.model;
      delete body.type;
      var response = await putElements(
        `${CARS.update.replace("{id}", id)}`,
        {
          "Content-Type": "application/json",
          jwt: `${user.id}`,
        },
        values
      );
      if (response.status != 200) {
        showAlert(response.response.status.description, "error", "Error");
        return;
      }
    }
    showAlert("Successfully", "success", "Success");
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

  const getCar = async (id) => {
    var response = await getElements(`${CARS.findByCarId.replace("{id}", id)}`, {
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
    setValues((prevState) => ({
      ...prevState,
      car_number: response.response.body.carNumber,
      car_passenger_quantity: response.response.body.carPassengerQuantity,
      car_model_id: response.response.body.carModelId.modelId,
      car_type_id: response.response.body.carTypeId.carTypeId,
      car_year: response.response.body.carYear,
      car_color: response.response.body.carColor,
      car_motor: response.response.body.carMotor,
      car_fuel: response.response.body.carFuel.toUpperCase(),
      car_cylinders: response.response.body.carCylinders,
      car_cl_uuid: response.response.body.carClUuid.clUuid,
      car_cl_name: response.response.body.carClUuid.clName,
      car_mileage: response.response.body.carMileage,
      tire_mileage: response.response.body.carTireMileage,
      model: {
        label: response.response.body.carModelId.modelName,
        value: response.response.body.carModelId.modelId,
      },
      type: {
        label: response.response.body.carTypeId.carTypeName,
        value: response.response.body.carTypeId.carTypeId,
      },
    }));
  };

  useEffect(() => {
    getModel();
    getType();
    if (id != undefined) {
      getCar(id);
    }
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
      model: { label: value.label, value: value.value },
    }));
  };

  const handleSelectType = (event, value) => {
    if (value == null) {
      return;
    }
    setValues((prevState) => ({
      ...prevState,
      car_type_id: value.value,
      type: { label: value.label, value: value.value },
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
                    disabled={true}
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
                {id == undefined ? (
                  <>
                    <Grid xs={6} md={6}>
                      <Autocomplete
                        options={model}
                        filterOptions={filterOptions}
                        onChange={handleSelectModel}
                        renderInput={(params) => <TextField {...params} label="Select Model" />}
                      />
                    </Grid>
                    <Grid xs={6} md={6}>
                      <Autocomplete
                        options={type}
                        getOptionLabel={(option) => option.label}
                        filterOptions={filterOptions}
                        onChange={handleSelectType}
                        renderInput={(params) => <TextField {...params} label="Select Type" />}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid xs={6} md={6}>
                      <Autocomplete
                        options={model}
                        filterOptions={filterOptions}
                        onChange={handleSelectModel}
                        value={values.model}
                        renderInput={(params) => <TextField {...params} label="Select Model" />}
                      />
                    </Grid>
                    <Grid xs={6} md={6}>
                      <Autocomplete
                        options={type}
                        filterOptions={filterOptions}
                        onChange={handleSelectType}
                        value={values.type}
                        renderInput={(params) => <TextField {...params} label="Select Type" />}
                      />
                    </Grid>
                  </>
                )}

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
                    name="car_motor"
                    onChange={handleChange}
                    required
                    value={values.car_motor}
                  />
                </Grid>

                <Grid xs={4} md={4}>
                  <TextField
                    fullWidth
                    label="Car Mileage"
                    name="car_mileage"
                    onChange={handleChange}
                    required
                    value={values.car_mileage}
                  />
                </Grid>
                <Grid xs={4} md={4}>
                  <TextField
                    fullWidth
                    label="Tire Mileage"
                    name="tire_mileage"
                    onChange={handleChange}
                    required
                    value={values.tire_mileage}
                  />
                </Grid>
                <Grid xs={4} md={4}>
                  <TextField
                    fullWidth
                    label="Fuel"
                    name="car_fuel"
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values.car_fuel}
                    onChange={handleChange}
                  >
                    {fuel.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
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
