import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import {
  Card,
  InputAdornment,
  OutlinedInput,
  SvgIcon,
  Box,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useState } from "react";

export const Search = (props) => {
  const [text, setText] = useState("");
  return (
    <>
      <Card sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center" sx={{ margin: "5px" }}>
          <Grid xs={12} md={4}>
            <OutlinedInput
              defaultValue=""
              fullWidth
              placeholder={`Search...`}
              onChange={(e) => {
                setText(e.target.value);
              }}
              startAdornment={
                <InputAdornment position="start">
                  <SvgIcon color="action" fontSize="small">
                    <MagnifyingGlassIcon />
                  </SvgIcon>
                </InputAdornment>
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  props.OnSearch(text);
                }
              }}
              sx={{ maxWidth: 500 }}
            />
          </Grid>
          <CircularProgress
            disableShrink
            sx={{
              marginLeft: "10px",
              marginTop: "5px",
              display: props.isShow == 1 ? "center" : "none",
            }}
          />
        </Grid>
      </Card>
    </>
  );
};
