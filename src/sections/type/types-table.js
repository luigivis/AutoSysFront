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

export const TypeTable = (props) => {
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
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                return (
                  <TableRow hover key={item.carTypeId}>
                    <TableCell>{item.carTypeId}</TableCell>
                    <TableCell>{item.carTypeName}</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={0}>
                        <IconButton
                          aria-label="edit"
                          sx={{ color: company.components.paletteColor.button }}
                          onClick={() => props.OnEdit(item)}
                        >
                          {
                            <SvgIcon fontSize="small">
                              <EditIcon />
                            </SvgIcon>
                          }
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          color="error"
                          onClick={() => props.OnDelete(item)}
                        >
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

TypeTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
