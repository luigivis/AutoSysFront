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
  Switch,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@heroicons/react/24/solid/PencilIcon";
import DeleteIcon from "@heroicons/react/24/solid/TrashIcon";

export const CustomersTable = (props) => {
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
                <TableCell>First name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>status</TableCell>
                <TableCell>Creation Date</TableCell>
                <TableCell>Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const isSelected = selected.includes(item.id);
                // const createdAt = format(customer.clCreatedAt, "dd/MM/yyyy");
                return (
                  <TableRow hover key={item.clUuid} selected={isSelected}>
                    <TableCell>{item.clName}</TableCell>
                    <TableCell>{item.clLastName}</TableCell>
                    <TableCell>{item.clIdentification}</TableCell>
                    <TableCell>
                      <Switch
                        defaultChecked={item.clStatus === 1 ? true : false}
                        color="secondary"
                        onChange={() => {
                          props.OnChangeStatus(item);
                        }}
                      />
                    </TableCell>
                    <TableCell>{item.clCreatedAt}</TableCell>
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

CustomersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
