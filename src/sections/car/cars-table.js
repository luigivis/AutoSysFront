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
import SeeIcon from "@heroicons/react/24/solid/EyeIcon";
import DeleteIcon from "@heroicons/react/24/solid/TrashIcon";

export const CarTable = (props) => {
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
                <TableCell>Car</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>type</TableCell>
                <TableCell>status</TableCell>
                <TableCell>Creation Date</TableCell>
                <TableCell>options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const isSelected = selected.includes(item.id);
                // const createdAt = format(customer.clCreatedAt, "dd/MM/yyyy");
                return (
                  <TableRow hover key={item.carId} selected={isSelected}>
                    <TableCell>{item.carModelId.modelName}</TableCell>
                    <TableCell>{`${item.carClUuid.clName} ${item.carClUuid.clLastName}`}</TableCell>
                    <TableCell>{item.carColor}</TableCell>
                    <TableCell>{item.carTypeId.carTypeName}</TableCell>
                    <TableCell>
                      <Switch
                        defaultChecked={item.carStatus === 1 ? true : false}
                        color={company.components.paletteColor.toggle}
                        onChange={() => {
                          props.OnChangeStatus(item);
                        }}
                      />
                    </TableCell>
                    <TableCell>{item.carCreatedAt}</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={0}>
                        <IconButton
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
                          sx={{ color: company.components.paletteColor.button }}
                          onClick={() => props.OnSee(item)}
                        >
                          {
                            <SvgIcon fontSize="small">
                              <SeeIcon />
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

CarTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
