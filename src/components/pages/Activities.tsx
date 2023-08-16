import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Activities = () => {
  const [resultsSet, setResultsSet] = useState([]);
  const userID = useSelector((state: any) => state.strava.userID);
  const accessToken = localStorage.getItem("access_token");

  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        `https://www.strava.com/api/v3/athlete/activities`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setResultsSet(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [userID]);

  return (
    <div data-testid="activity-container">
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: 2,
          marginTop: 2,
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
      </Box>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", marginTop: 4, marginBottom: 2 }}
      >
        Activities
      </Typography>
      <List sx={{ padding: 2 }}>
        {resultsSet.map((activity: any) => (
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
                <ListItemText primary="Sports Type" secondary={activity.type} />
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
              <ListItem>
                <ListItemText
                  primary="Heart rate"
                  secondary={activity.average_heartrate}
                />
              </ListItem>
            </CardContent>
          </Card>
        ))}
      </List>
    </div>
  );
};

export default Activities;
