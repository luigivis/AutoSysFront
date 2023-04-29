import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button, Card, CardHeader, CardContent, Unstable_Grid2 as Grid } from "@mui/material";
import TableCustomCatalog from "src/sections/global/table-custom";

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

const ModalInventory = (props) => {
  React.useEffect(() => {}, [props.rows]);
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
          <CardHeader subheader={"Product"} title="Select Lote" />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ m: -1.5 }}>
              <Grid container spacing={3}>
                <Grid xs={12} md={12}>
                  <TableCustomCatalog rows={props.rows} columns={props.columns} />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Modal>
    </div>
  );
};

export default ModalInventory;
