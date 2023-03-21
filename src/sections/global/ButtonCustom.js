import { Button, SvgIcon } from "@mui/material";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";

export const ButtonCustom = (props) => {
  const company = JSON.parse(localStorage.getItem("company"));
  console.log(company);
  return (
    <Button
      startIcon={
        <SvgIcon fontSize="small">
          <PlusIcon />
        </SvgIcon>
      }
      sx={{ backgroundColor: `${company.components.paletteColor.button} !important` }}
      variant="contained"
      onClick={() => {
        props.openModal();
      }}
      id="modal-button"
    >
      New
    </Button>
  );
};
