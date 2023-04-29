import PropTypes from "prop-types";
import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  SvgIcon,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import IconButton from "@mui/material/IconButton";
import { SeverityPill } from "src/components/severity-pill";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DoneAllIcon from "@mui/icons-material/DoneAll";

export const InventoryTable = (props) => {
  const company = JSON.parse(localStorage.getItem("company"));
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>description</TableCell>
                <TableCell>Store</TableCell>
                <TableCell>User</TableCell>
                <TableCell>status</TableCell>
                <TableCell>Creation Date</TableCell>
                <TableCell>options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const isSelected = selected.includes(item.id);
                // const createdAt = format(customer.clCreatedAt, "dd/MM/yyyy");
                var data;
                switch (item.itStatus) {
                  case 0:
                    data = <SeverityPill color={"error"}>Cancel</SeverityPill>;
                    break;
                  case 1:
                    data = <SeverityPill color={"success"}>Confirmed</SeverityPill>;
                    break;
                  case 2:
                    data = <SeverityPill color={"warning"}>Pending</SeverityPill>;
                    break;
                  case 3:
                    data = <SeverityPill color={"warning"}>Pending Str</SeverityPill>;
                    break;
                  case 4:
                    data = <SeverityPill color={"warning"}>Cancel Str</SeverityPill>;
                    break;
                  case 6:
                    data = <SeverityPill color={"error"}>Cancel Expired</SeverityPill>;
                    break;
                }
                return (
                  <TableRow hover key={item.itId}>
                    <TableCell>{item.itId}</TableCell>
                    <TableCell>{item.itDescription}</TableCell>
                    <TableCell>{item.itToStrId.strName}</TableCell>
                    <TableCell>{item.itUsId.usUsername}</TableCell>
                    <TableCell>{data}</TableCell>
                    <TableCell>{item.itCreationDate}</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={0}>
                        <IconButton
                          title="Reconfirm Transfer"
                          sx={{ color: company.components.paletteColor.button }}
                          onClick={() => props.OnReConfirm(item)}
                        >
                          {
                            <SvgIcon fontSize="small">
                              <DoneAllIcon />
                            </SvgIcon>
                          }
                        </IconButton>
                        <IconButton
                          title="Confirm Transfer"
                          sx={{ color: company.components.paletteColor.button }}
                          onClick={() => props.OnConfirm(item)}
                        >
                          {
                            <SvgIcon fontSize="small">
                              <CheckCircleOutlineIcon />
                            </SvgIcon>
                          }
                        </IconButton>
                        <IconButton
                          title="Cancel Transfer"
                          sx={{ color: company.components.paletteColor.button }}
                          onClick={() => props.OnCancel(item)}
                        >
                          {
                            <SvgIcon fontSize="small">
                              <CancelIcon />
                            </SvgIcon>
                          }
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

InventoryTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
