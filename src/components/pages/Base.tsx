import React, { useState, useEffect } from "react";
import { Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
const Base = () => {
  const navigation = useNavigate();
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    if (accessToken) {
      navigation("/activities");
    }
  }, []);
  //  const accessToken = useSelector((state: any) => state.strava.accessToken);
  const { REACT_APP_CLIENTID } = process.env;
  const { REACT_APP_CLIENT_SECRET } = process.env;
  // console.log(REACT_APP_CLIENTID);
  const redirectUrl = "http://localhost:3000/redirect";
  const scope = "read,activity:read";
  const dispatch = useDispatch();
  const handleLogin = () => {
    window.location.href = `http://www.strava.com/oauth/authorize?client_id=${REACT_APP_CLIENTID}&response_type=code&redirect_uri=${redirectUrl}/exchange_token&approval_prompt=force&scope=${scope}`;
  };

  return (
    <div className="inputContainer">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#EEEDED",
          p: 4,
          height: "30vh",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{ marginBottom: 2, color: "#333", fontWeight: "bold" }}
        >
          Welcome to Strava Connect
        </Typography>
        <Button
          variant="contained"
          onClick={handleLogin}
          sx={{
            backgroundColor: "#FF5733",
            color: "white",
            "&:hover": {
              backgroundColor: "#FF834A",
            },
          }}
        >
          Login With Strava
        </Button>
      </Box>
    </div>
  );
};

export default Base;
