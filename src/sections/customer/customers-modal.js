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

const CustomerModal = (props) => {
  const [customer, setCustomer] = React.useState(props.customer);
  React.useEffect(() => {
    setCustomer(props.customer);
  }, [props.customer]);
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
        <CardHeader subheader={props.edit} title="Customer" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  id="clName"
                  value={customer.clName}
                  onChange={(e) =>
                    setCustomer((item) => ({
                      ...item,
                      ...{ clName: e.target.value },
                    }))
                  }
                  required
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  id="clLastName"
                  value={customer.clLastName}
                  onChange={(e) =>
                    setCustomer((item) => ({
                      ...item,
                      ...{ clLastName: e.target.value },
                    }))
                  }
                  required
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  id="clPhone"
                  value={customer.clPhone}
                  onChange={(e) =>
                    setCustomer((item) => ({
                      ...item,
                      ...{ clPhone: e.target.value },
                    }))
                  }
                  required
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ID"
                  id="clIdentification"
                  value={customer.clIdentification}
                  onChange={(e) =>
                    setCustomer((item) => ({
                      ...item,
                      ...{ clIdentification: e.target.value },
                    }))
                  }
                  required
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  id="clEmail"
                  value={customer.clEmail}
                  onChange={(e) =>
                    setCustomer((item) => ({
                      ...item,
                      ...{ clEmail: e.target.value },
                    }))
                  }
                  required
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Address"
                  id="clAddress"
                  value={customer.clAddress}
                  onChange={(e) =>
                    setCustomer((item) => ({
                      ...item,
                      ...{ clAddress: e.target.value },
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
              props.OnSend(customer);
            }}
          >
            Save
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
};

export default CustomerModal;
