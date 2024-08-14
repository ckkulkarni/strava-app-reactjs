import React, { Component } from "react";
import { Button, Typography, Box } from "@mui/material";
import { connect } from "react-redux";
import withNavigate from "../utils/navigation";

interface Props {
  navigate: (path: string) => void;
}

class HomeScreen extends Component<Props> {
  checkForAccessToken = () => {
    const accessToken = localStorage.getItem("access_token");
    console.log("Outside if " + accessToken);
    if (accessToken) {
      console.log("Inside if " + accessToken);

      this.props.navigate("/activities");
    }
  };
  componentDidMount() {
    this.checkForAccessToken();
  }

  componentDidUpdate() {
    this.checkForAccessToken();
  }

  handleLogin = () => {
    const { REACT_APP_CLIENTID } = process.env;
    const redirectUrl = "http://localhost:3000/redirect";
    const scope = "read,activity:read,activity:write";
    window.location.href = `http://www.strava.com/oauth/authorize?client_id=${REACT_APP_CLIENTID}&response_type=code&redirect_uri=${redirectUrl}/exchange_token&approval_prompt=force&scope=${scope}`;
  };

  render() {
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
            height: "100%",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{ mb: 2, color: "#333", fontWeight: "bold" }}
          >
            Welcome to Strava Connect
          </Typography>
          <Button
            data-testid="login-button"
            variant="contained"
            onClick={this.handleLogin}
            sx={{
              textTransform: "capitalize",
            }}
          >
            Login With Strava
          </Button>
        </Box>
      </div>
    );
  }
}

export default connect()(withNavigate(HomeScreen));
