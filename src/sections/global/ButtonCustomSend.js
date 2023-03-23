import { Button, SvgIcon } from "@mui/material";

export const ButtonCustomSend = (props) => {
  const company = JSON.parse(localStorage.getItem("company"));
  return (
    <Button
      sx={{ backgroundColor: `${company.components.paletteColor.button} !important` }}
      variant="contained"
      onClick={() => {
        props.OnSend();
      }}
      id="modal-button"
    >
      Save
    </Button>
  );
};
