import { Button, SvgIcon } from "@mui/material";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";

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
