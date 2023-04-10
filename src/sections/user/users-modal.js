import * as React from "react";
import Box from "@mui/material/Box";
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
import ModalEmployeeTable from "src/sections/global/employee-table-modal";
import { ButtonCustomSend } from "../global/ButtonCustomSend";
import { STORE, EMPLOYEES } from "src/service/endpoints";
import { getElements } from "src/service/api";
import { useAuthContext } from "src/contexts/auth-context";
import { Fragment } from "react";
import { Search } from "src/sections/global/search";
import { EmployeeTable } from "../employee/employees-table";

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
const rol = [
  {
    value: "1",
    label: "ADMIN",
  },
  {
    value: "2",
    label: "SUPERVISOR",
  },
  {
    value: "3",
    label: "CASHIER",
  },
];

const ChildModal = (props) => {
  const { user } = useAuthContext();
  const [open, setOpen] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [employees, setEmployees] = React.useState([]);
  const [isShow, setIsShow] = React.useState(0);
  const handlePageChange = React.useCallback((event, value) => {
    setPage(value);
    getEmployees(value, rowsPerPage);
  }, []);

  const handleRowsPerPageChange = React.useCallback((event) => {
    setRowsPerPage(event.target.value);
    getEmployees(page, event.target.value);
  }, []);
  const getEmployees = async (pageRow = 0, SizeRow = rowsPerPage) => {
    setIsShow(1);
    var response = await getElements(`${EMPLOYEES.list}?page=${pageRow}&size=${SizeRow}`, {
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      setIsShow(0);
      return;
    }
    setEmployees(response.response.body.value);
    setCount(response.response.body.totalItems);
    setRowsPerPage(SizeRow);
    setIsShow(0);
  };
  const filter = async (value) => {
    setIsShow(1);
    if (value == "") {
      getEmployees(page, rowsPerPage);
      setIsShow(0);
      return;
    }
    var response = await getElements(`${FILTER.list}?search=${value}&location=${"employees"}`, {
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      setIsShow(0);
      return;
    }
    setEmployees(response.response.body);
    setCount(response.response.body.length);
    setIsShow(0);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    getEmployees(page, rowsPerPage);
  }, []);

  return (
    <Fragment>
      <Button onClick={handleOpen}>Search employee</Button>
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
            <CardHeader title="employee" />
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
                  <EmployeeTable
                    isSecondary={1}
                    count={count}
                    items={employees}
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

const UserModal = (props) => {
  const [data, setData] = React.useState(props.data);
  const [stores, setStores] = React.useState(props.store);
  const filterOptions = (options, { inputValue }) =>
    options.filter((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1);

  const handleSelectModel = (event, value) => {
    if (value == null) {
      return;
    }
    setData((prevState) => ({
      ...prevState,
      storeId: value.value,
    }));
  };

  React.useEffect(() => {
    setData(props.data);
    setStores(props.store);
  }, [props.data]);
  return (
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
        <CardHeader subheader={props.edit} title="User" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="User Name"
                  id="usUsername"
                  value={data.usUsername}
                  onChange={(e) =>
                    setData((item) => ({
                      ...item,
                      ...{ usUsername: e.target.value },
                    }))
                  }
                  required
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Password"
                  id="password"
                  value={data.password}
                  type="password"
                  autoComplete="new-password"
                  onChange={(e) =>
                    setData((item) => ({
                      ...item,
                      ...{ password: e.target.value },
                    }))
                  }
                  required
                />
              </Grid>
              <Grid xs={6} md={6}>
                <TextField
                  fullWidth
                  label="Rol"
                  name="usRoleId"
                  required
                  select
                  SelectProps={{ native: true }}
                  value={data.usRoleId}
                  onChange={(e) =>
                    setData((item) => ({
                      ...item,
                      ...{ usRoleId: e.target.value },
                    }))
                  }
                >
                  {rol.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid xs={6} md={6}>
                <Autocomplete
                  options={stores}
                  filterOptions={filterOptions}
                  onChange={handleSelectModel}
                  defaultValue={props.data.store}
                  renderInput={(params) => <TextField {...params} label="Select store" />}
                />
              </Grid>
              {props.edit === "New" ? (
                <Grid xs={12} md={12}>
                  <Grid container>
                    <Grid xs={8} md={8}>
                      <TextField
                        fullWidth
                        label="Employee"
                        id="empName"
                        value={data.empName}
                        disabled={true}
                        required
                      />
                    </Grid>
                    <Grid xs={4} md={4}>
                      <ChildModal
                        OnSee={(res) => {
                          setData((item) => ({
                            ...item,
                            ...{ employeeUuid: res.empUuid, empName: res.empName },
                          }));
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Employee"
                    id="empName"
                    value={data.empName}
                    disabled={true}
                    onChange={(e) =>
                      setData((item) => ({
                        ...item,
                        ...{ empName: e.target.value },
                      }))
                    }
                    required
                  />
                </Grid>
              )}
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
  );
};

export default UserModal;
