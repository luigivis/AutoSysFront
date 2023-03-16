import { useCallback, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";

import { LOGIN } from "../../service/endpoints";
import { postElements } from "src/service/api";
import { useAuthContext } from "src/contexts/auth-context";
import { showAlert } from "src/sections/global/alert";
import { useRouter } from "next/navigation";

export const AccountProfileDetails = () => {
  const router = useRouter();
  const { user } = useAuthContext();
  const [values, setValues] = useState({
    oldPassword: "",
    newPassword: "",
    newPasswordVerification: "",
  });

  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);

  const changePassword = async () => {
    var response = await postElements(
      LOGIN.changePassword,
      {
        "Content-Type": "application/json",
        jwt: `${user.id}`,
      },
      values
    );
    console.log(response);
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
    setValues((item) => ({
      ...item,
      ...{
        oldPassword: "",
        newPassword: "",
        newPasswordVerification: "",
      },
    }));
    showAlert("Success", "success", "Success");
    router.push("/auth/login");
    localStorage.removeItem("userStorage");
    localStorage.setItem("authenticated", "false");
    localStorage.removeItem("rowsPerPage");
  };

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="" title="User" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={12}>
                <TextField
                  fullWidth
                  helperText="Please specify your old password"
                  label="Old password"
                  name="oldPassword"
                  type={"password"}
                  onChange={handleChange}
                  required
                  value={values.oldPassword}
                />
              </Grid>
              <Grid xs={12} md={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type={"password"}
                  onChange={handleChange}
                  required
                  value={values.newPassword}
                />
              </Grid>
              <Grid xs={12} md={12}>
                <TextField
                  fullWidth
                  label="New Password Verification"
                  name="newPasswordVerification"
                  type={"password"}
                  onChange={handleChange}
                  required
                  value={values.newPasswordVerification}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={changePassword}>
            Save
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
