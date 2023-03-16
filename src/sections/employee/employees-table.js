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
import Check from "@heroicons/react/24/solid/CheckCircleIcon";

export const EmployeeTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: props.isSecondary === 0 ? 800 : 500 }}>
          <Table>
            <TableHead>
              {props.isSecondary === 0 ? (
                <TableRow>
                  <TableCell>First name</TableCell>
                  <TableCell>last name</TableCell>
                  <TableCell>id</TableCell>
                  <TableCell>status</TableCell>
                  <TableCell>Creation Date</TableCell>
                  <TableCell>options</TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell>First name</TableCell>
                  <TableCell>options</TableCell>
                </TableRow>
              )}
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const isSelected = selected.includes(item.id);
                // const createdAt = format(customer.clCreatedAt, "dd/MM/yyyy");
                return (
                  <TableRow hover key={item.empUuid} selected={isSelected}>
                    <TableCell>{item.empName}</TableCell>
                    {props.isSecondary === 1 ? null : <TableCell>{item.empLastname}</TableCell>}
                    {props.isSecondary === 1 ? null : <TableCell>{item.empIdentCard}</TableCell>}
                    {props.isSecondary === 1 ? null : (
                      <TableCell>
                        <Switch
                          defaultChecked={item.empStatus === 1 ? true : false}
                          color="secondary"
                          onChange={() => {
                            props.OnChangeStatus(item);
                          }}
                        />
                      </TableCell>
                    )}
                    {props.isSecondary === 1 ? null : <TableCell>{item.empCreatedAt}</TableCell>}
                    <TableCell>
                      {props.isSecondary === 0 ? (
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
                      ) : (
                        <Stack direction="row" alignItems="center" spacing={0}>
                          <IconButton
                            aria-label="delete"
                            color="primary"
                            onClick={() => {
                              props.OnSee(item);
                            }}
                          >
                            {
                              <SvgIcon fontSize="small">
                                <Check />
                              </SvgIcon>
                            }
                          </IconButton>
                        </Stack>
                      )}
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

EmployeeTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
