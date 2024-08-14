import axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import { setAccessToken, setUserID } from "../redux/reducer/stravaSlice";
import { CircularProgress } from "@mui/material";
import withNavigate from "../utils/navigation";
import { http } from "../utils/http";

interface Props {
  navigate: (path: string) => void;
  setAccessToken: (token: string) => void;
  setUserID: (id: string) => void;
}

class Redirect extends Component<Props> {
  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const { REACT_APP_CLIENTID, REACT_APP_CLIENT_SECRET } = process.env;

    if (code) {
      http
        .post(
          `/oauth/token?client_id=${REACT_APP_CLIENTID}&client_secret=${REACT_APP_CLIENT_SECRET}&code=${code}&grant_type=authorization_code`
        )
        .then((response) => {
          const accessToken = response.data.access_token;
          const userID = response.data.athlete.id;

          if (accessToken) {
            this.props.setAccessToken(accessToken);
            this.props.setUserID(userID);
            localStorage.setItem("access_token", accessToken);
            this.props.navigate("/activities");
          }
        })
        .catch((error) => {
          console.error("Error exchanging code for access token:", error);
        });
    }
  }

  render() {
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
  }
}

const mapDispatchToProps = {
  setAccessToken,
  setUserID,
};

export default connect(null, mapDispatchToProps)(withNavigate(Redirect));
