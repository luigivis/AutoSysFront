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
} from "@mui/material";

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

const EmployeeModal = (props) => {
  const [data, setData] = React.useState(props.data);
  React.useEffect(() => {
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
          <CardHeader subheader={props.edit} title="Employee" />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ m: -1.5 }}>
              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="First name"
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
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Last name"
                    id="empLastname"
                    value={data.empLastname}
                    onChange={(e) =>
                      setData((item) => ({
                        ...item,
                        ...{ empLastname: e.target.value },
                      }))
                    }
                    required
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    id="empPhone"
                    value={data.empPhone}
                    onChange={(e) =>
                      setData((item) => ({
                        ...item,
                        ...{ empPhone: e.target.value },
                      }))
                    }
                    required
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="ID"
                    id="empIdentCard"
                    value={data.empIdentCard}
                    onChange={(e) =>
                      setData((item) => ({
                        ...item,
                        ...{ empIdentCard: e.target.value },
                      }))
                    }
                    required
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    id="empEmail"
                    value={data.empEmail}
                    onChange={(e) =>
                      setData((item) => ({
                        ...item,
                        ...{ empEmail: e.target.value },
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
    </div>
  );
};

export default EmployeeModal;
