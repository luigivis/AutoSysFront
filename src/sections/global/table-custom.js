import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";

export default function TableCustomCatalog({ rows, columns }) {
  rows = rows.map((row, index) => {
    return { ...row, id: index };
  });
  return (
    <div style={{ height: "650px", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        sx={{
          border: 1,
          borderColor: "divider",
          ...{
            "& .MuiDataGrid-columnHeaders": {
              background: "#F8F9FA",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-row": {
              marginBottom: "8px", // Agregar margen inferior a las filas
            },
            "& .MuiDataGrid-cell": {
              borderTop: "1px solid #E5E5E5",
              //justifyContent: "center",
            },
          },
        }}
        autoHeight={false}
        //rowsPerPageOptions={[25, 50, 100]}
        pageSizeOptions={[10, 20, 100]}
      />
    </div>
  );
}
