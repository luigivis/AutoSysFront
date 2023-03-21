import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import {
  Card,
  InputAdornment,
  OutlinedInput,
  SvgIcon,
  CircularProgress,
  Grid,
  Button,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState, useEffect } from "react";

export const Search = (props) => {
  const company = JSON.parse(localStorage.getItem("company"));
  const [text, setText] = useState("");
  useEffect(() => {
    setText("");
  }, []);
  return (
    <>
      <Card sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center" sx={{ margin: "5px" }}>
          <OutlinedInput
            value={text}
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
          <Box>
            <Button
              variant="contained"
              sx={{
                backgroundColor: `${company.components.paletteColor.button} !important`,
                marginLeft: "10px",
              }}
              onClick={() => {
                setText("");
                props.refresh();
              }}
              id="modal-button"
            >
              Clear
            </Button>
          </Box>
          <Box>
            <CircularProgress
              disableShrink
              sx={{
                display: props.isShow == 1 ? "center" : "none",
                marginLeft: "10px",
              }}
            />
          </Box>
        </Grid>
      </Card>
    </>
  );
};
