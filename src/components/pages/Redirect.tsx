import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken, setUserID } from "../redux/reducer/stravaSlice";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router";
const Redirect = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const { REACT_APP_CLIENTID } = process.env;
  const { REACT_APP_CLIENT_SECRET } = process.env;
  const code = urlParams.get("code");
  const navigation = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (code) {
      axios
        .post(
          `https://www.strava.com/api/v3/oauth/token?client_id=${REACT_APP_CLIENTID}&client_secret=${REACT_APP_CLIENT_SECRET}&code=${code}&grant_type=authorization_code`
        )
        .then((response) => {
          const accessToken = response.data.access_token;
          const userID = response.data.athlete.id;
          //    console.log(response.data.athlete.id);
          if (accessToken) {
            dispatch(setAccessToken(accessToken));
            dispatch(setUserID(userID));
            localStorage.setItem("access_token", accessToken);

            navigation("/activities");
          }
        })
        .catch((error) => {
          console.error("Error exchanging code for access token:", error);
        });
    }
  }, [code]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress sx={{ color: "primary.main" }} size={64} />
    </div>
  );
};

export default Redirect;
