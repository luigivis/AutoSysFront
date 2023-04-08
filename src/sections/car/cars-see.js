import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Unstable_Grid2 as Grid,
  Stack,
  IconButton,
  Container,
  Typography,
} from "@mui/material";
import Head from "next/head";

import { useAuthContext } from "src/contexts/auth-context";
import { showAlert } from "src/sections/global/alert";
import { useRouter } from "next/router";
import { MODEL, TYPE, CARS, CLIENTS, FILTER } from "../../service/endpoints";
import { postElements, getElements } from "src/service/api";
import TableCustomCatalog from "src/sections/global/table-custom";
import EditIcon from "@heroicons/react/24/solid/PencilIcon";
import DeleteIcon from "@heroicons/react/24/solid/TrashIcon";
const columns = [
  { field: "carId", headerName: "ID", type: "number", width: 100 },
  { field: "modelName", headerName: "Model", width: 200 },
  { field: "carNumber", headerName: "Car Number", width: 200 },
  { field: "carPassengerQuantity", headerName: "Passenger", width: 200 },
  { field: "carCylinders", headerName: "Cylinders", width: 200 },
  { field: "carColor", headerName: "Color", width: 200 },
  { field: "carYear", headerName: "Year", width: 200 },
];
export const CarSee = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuthContext();
  const [rows, setRows] = useState([]);
  const getData = async () => {
    var response = await getElements(`${CARS.findById.replace("{id}", id)}`, {
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
    setRows(response.response.body);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <TableCustomCatalog rows={rows} columns={columns} />
    </>
  );
};
