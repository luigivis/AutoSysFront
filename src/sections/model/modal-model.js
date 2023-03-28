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

const ChildModal = (props) => {
  const { user } = useAuthContext();
  const [open, setOpen] = React.useState(false);
  const [isShow, setIsShow] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);

  const handlePageChange = React.useCallback((event, value) => {
    setPage(value);
    getData(value);
  }, []);

  const handleRowsPerPageChange = React.useCallback((event) => {
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
    var response = await getElements(`${BRANDS.list}?page=${pageRow}&size=${size}`, {
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

  React.useEffect(() => {
    getData(page, rowsPerPage);
  }, []);

  return (
    <React.Fragment>
      <Button onClick={handleOpen}>Search brand</Button>
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
            <CardHeader title="Brands" />
            <CardContent sx={{ pt: 0 }}>
              <Grid container spacing={3}>
                <Grid xs={12} md={12}>
                  <BrandTable
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
    </React.Fragment>
  );
};

const ModalModel = (props) => {
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
          <CardHeader subheader={props.edit} title="Model" />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ m: -1.5 }}>
              <Grid container spacing={3}>
                <Grid xs={12} md={12}>
                  <TextField
                    fullWidth
                    label="Model"
                    id="modelName"
                    value={data.modelName}
                    onChange={(e) =>
                      setData((item) => ({
                        ...item,
                        ...{ modelName: e.target.value },
                      }))
                    }
                    required
                  />
                </Grid>
                <Grid xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Brands"
                    id="modelBrandName"
                    value={data.modelBrandName}
                    disabled={true}
                    onChange={(e) =>
                      setData((item) => ({
                        ...item,
                        ...{ modelBrandName: e.target.value },
                      }))
                    }
                    required
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <ChildModal
                    OnSee={(res) => {
                      setData((item) => ({
                        ...item,
                        ...{ modelBrandId: res.brandId, modelBrandName: res.brandName },
                      }));
                    }}
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

export default ModalModel;
