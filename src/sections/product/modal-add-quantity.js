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
} from "@mui/material";
import { ButtonCustomSend } from "../global/ButtonCustomSend";
import { Search } from "../global/search";
import { BRANDS } from "../../service/endpoints";
import { getElements } from "../../service/api";
import { useAuthContext } from "src/contexts/auth-context";
import { BrandTable } from "../brand/brands-table";

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

const ModalAddQuantity = (props) => {
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
          <CardHeader title="Add Quantity" />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ m: -1.5 }}>
              <Grid container spacing={3}>
                <Grid xs={12} md={12}>
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

export default ModalAddQuantity;
