import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  Button,
  SvgIcon,
  Card,
  InputAdornment,
  OutlinedInput,
  CardHeader,
  CardContent,
  Unstable_Grid2 as Grid,
  TextField,
  Divider,
  CardActions,
} from "@mui/material";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";

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

const ModalBrand = (props) => {
  const [brand, setBrand] = React.useState(props.brand);
  React.useEffect(() => {
    setBrand(props.brand);
  }, [props.brand]);
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
          <CardHeader subheader={props.edit} title="Marca" />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ m: -1.5 }}>
              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    id="name"
                    value={brand.name}
                    onChange={(e) =>
                      setBrand((item) => ({
                        ...item,
                        ...{ name: e.target.value },
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
            <Button variant="contained">Save details</Button>
          </CardActions>
        </Card>
      </Modal>
    </div>
  );
};

export default ModalBrand;
