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
  Fab,
} from "@mui/material";
import Icon from "@heroicons/react/24/solid/MagnifyingGlassCircleIcon";
import ModalEmployeeTable from "src/sections/global/employee-table-modal";

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

const UserModal = (props) => {
  const [data, setData] = React.useState(props.data);
  const [openTable, setOpenTable] = React.useState(false);
  React.useEffect(() => {
    setData(props.data);
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
              {props.edit === "New" ? (
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    id="password"
                    value={data.password}
                    type="password"
                    onChange={(e) =>
                      setData((item) => ({
                        ...item,
                        ...{ password: e.target.value },
                      }))
                    }
                    required
                  />
                </Grid>
              ) : null}

              <Grid xs={12} md={12}>
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
              {props.edit === "New" ? (
                <Grid xs={12} md={12}>
                  <Grid container>
                    <Grid xs={12} md={10}>
                      <TextField
                        fullWidth
                        label="Employee"
                        id="empName"
                        value={data.empName}
                        enabled={false}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={2}>
                      <Fab
                        color="primary"
                        aria-label="add"
                        size="small"
                        onClick={() => {
                          setOpenTable(true);
                        }}
                      >
                        <Icon />
                      </Fab>
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
          <ModalEmployeeTable
            open={openTable}
            OnSee={(res) => {
              setOpenTable(false);
              setData((item) => ({
                ...item,
                ...{ empName: res.empName, employeeUuid: res.empUuid },
              }));
            }}
            OnClose={() => {
              setOpenTable(false);
            }}
          />
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={() => {
              props.OnSend(data);
            }}
          >
            Save
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
};

export default UserModal;
