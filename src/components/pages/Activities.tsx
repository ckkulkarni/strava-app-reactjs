import React, { Component } from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
} from "@mui/material";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import withNavigate from "../utils/navigation";
import { http } from "../utils/http";
import { clearAccessToken } from "../redux/reducer/stravaSlice";

interface Props {
  navigate: (path: string) => void;
  userID: string;
  clearAccessToken: () => void;
}

interface State {
  resultsSet: any[];
  toggleLoader: boolean;
}

class Activities extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      resultsSet: [],
      toggleLoader: false,
    };
  }

  componentDidMount() {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      this.props.navigate("/app");
    } else {
      this.fetchActivities();
    }
  }
  fetchActivities = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;

    try {
      const response = await http.get(`/athlete/activities`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("API Called " + accessToken);
      this.setState({ resultsSet: response.data });
    } catch (error) {
      console.log("Error");
      console.error("Error fetching activities:", error);
    }
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      prevProps.userID !== this.props.userID ||
      prevState.toggleLoader !== this.state.toggleLoader
    ) {
      this.fetchActivities();
    }
  }

  refreshPage = () => {
    this.setState((prevState) => ({
      toggleLoader: !prevState.toggleLoader,
    }));
  };

  handleLogoutClick = () => {
    localStorage.removeItem("access_token");
    this.props.clearAccessToken();
    this.props.navigate("/app");
    this.refreshPage();
  };

  render() {
    return (
      <div data-testid="activity-container">
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginRight: 2,
            marginTop: 2,
            gap: 2,
          }}
        >
          <Button
            component={Link}
            to="/create-activity"
            variant="contained"
            color="primary"
          >
            Create Activity
          </Button>
          <Button
            onClick={this.handleLogoutClick}
            variant="contained"
            color="primary"
          >
            Logout
          </Button>
        </Box>
        <Typography
          variant="h4"
          sx={{ textAlign: "center", marginTop: 4, marginBottom: 2 }}
        >
          Activities
        </Typography>
        <List sx={{ padding: 2 }}>
          {this.state.resultsSet.map((activity) => (
            <Card
              key={activity.id}
              sx={{
                marginBottom: 2,
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
              }}
            >
              <CardContent>
                <Typography variant="h6">{activity.name}</Typography>
                <ListItem>
                  <ListItemText
                    primary="Sports Type"
                    secondary={activity.type}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Distance"
                    secondary={`${activity.distance} meters`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Average speed"
                    secondary={`${activity.average_speed} m/s`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Max speed"
                    secondary={`${activity.max_speed} m/s`}
                  />
                </ListItem>
              </CardContent>
            </Card>
          ))}
        </List>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  userID: state.strava.userID,
});

const mapDispatchToProps = {
  clearAccessToken,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigate(Activities));
