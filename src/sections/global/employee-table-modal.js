import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Card, CardHeader, CardContent, Unstable_Grid2 as Grid, Button } from "@mui/material";
import { EMPLOYEES } from "src/service/endpoints";
import { EmployeeTable } from "src/sections/employee/employees-table";
import { useCallback, useState, useEffect } from "react";
import { getElements } from "src/service/api";
import { useAuthContext } from "src/contexts/auth-context";
import { FILTER } from "src/service/endpoints";
import { Search } from "src/sections/global/search";
import { showAlert } from "src/sections/global/alert";

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

const ModalEmployeeTable = (props) => {
  const { user } = useAuthContext();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [employees, setEmployees] = useState([]);
  const [isShow, setIsShow] = useState(0);
  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    getEmployees(value, rowsPerPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
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
  React.useEffect(() => {
    getEmployees(page, rowsPerPage);
    const element = document.getElementById("sppps");
    if (element) {
      console.log(element);
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
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
            onClick={() => props.OnClose(true)}
          >
            X
          </Button>
          <CardHeader subheader={props.edit} title="Empleado" />
          <CardContent sx={{ pt: 0 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Search
                  search={"Empleado"}
                  OnSearch={(res) => {
                    filter(res);
                  }}
                  isShow={isShow}
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
                    props.OnSee(res);
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

export default ModalEmployeeTable;
