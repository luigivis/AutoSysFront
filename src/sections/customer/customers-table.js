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
  Button,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@heroicons/react/24/solid/PencilIcon";

export const CustomersTable = (props) => {
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
              {props.isSecondary == 1 ? (
                <>
                  <TableRow>
                    <TableCell>First name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>Options</TableCell>
                  </TableRow>
                </>
              ) : (
                <>
                  <TableRow>
                    <TableCell>First name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>status</TableCell>
                    <TableCell>Creation Date</TableCell>
                    <TableCell>Options</TableCell>
                  </TableRow>
                </>
              )}
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
                    {props.isSecondary == 0 ? (
                      <TableCell>
                        <Switch
                          defaultChecked={item.clStatus === 1 ? true : false}
                          color={company.components.paletteColor.toggle}
                          onChange={() => {
                            props.OnChangeStatus(item);
                          }}
                        />
                      </TableCell>
                    ) : null}
                    {props.isSecondary == 0 ? <TableCell>{item.clCreatedAt}</TableCell> : null}

                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={0}>
                        {props.isSecondary == 0 ? (
                          <IconButton
                            aria-label="delete"
                            sx={{ color: company.components.paletteColor.button }}
                            onClick={() => props.OnEdit(item)}
                          >
                            {
                              <SvgIcon fontSize="small">
                                <EditIcon />
                              </SvgIcon>
                            }
                          </IconButton>
                        ) : null}

                        {props.isSecondary == 1 ? (
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: `${company.components.paletteColor.button} !important`,
                            }}
                            onClick={() => {
                              props.OnSee(item);
                            }}
                            id="modal-button"
                          >
                            Add
                          </Button>
                        ) : null}
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
