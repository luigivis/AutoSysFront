import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  SvgIcon,
  Switch,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@heroicons/react/24/solid/PencilIcon";
import DeleteIcon from "@heroicons/react/24/solid/TrashIcon";

export const UserTable = (props) => {
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
                <TableCell>User Name</TableCell>
                <TableCell>Employee</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>status</TableCell>
                <TableCell>Creation Date</TableCell>
                <TableCell>options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const isSelected = selected.includes(item.id);
                let rol = "";
                switch (item.usRoleId) {
                  case 1:
                    rol = "ADMIN";
                    break;
                  case 2:
                    rol = "SUPERVISOR";
                    break;
                  case 3:
                    rol = "CASHIER";
                    break;
                }
                // const createdAt = format(customer.clCreatedAt, "dd/MM/yyyy");
                return (
                  <TableRow hover key={item.usId} selected={isSelected}>
                    <TableCell>{item.usUsername}</TableCell>
                    <TableCell>{item.usEmployeeUuid.empName}</TableCell>
                    <TableCell>{rol}</TableCell>
                    <TableCell>
                      <Switch
                        defaultChecked={item.usStatus === 1 ? true : false}
                        color="secondary"
                        onChange={() => {
                          props.OnChangeStatus(item);
                        }}
                      />
                    </TableCell>
                    <TableCell>{item.usCreatedAt}</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={0}>
                        <IconButton
                          aria-label="delete"
                          color="primary"
                          onClick={() => props.OnEdit(item)}
                        >
                          {
                            <SvgIcon fontSize="small">
                              <EditIcon />
                            </SvgIcon>
                          }
                        </IconButton>
                        <IconButton aria-label="delete" color="error">
                          {
                            <SvgIcon fontSize="small">
                              <DeleteIcon />
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

UserTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
