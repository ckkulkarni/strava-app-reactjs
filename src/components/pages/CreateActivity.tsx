import React, { useState } from "react";
import { Typography, TextField, Box, Button, Container } from "@mui/material";
import { useNavigate } from "react-router";

const CreateActivity = () => {
  const navigate = useNavigate();
  const [activityData, setActivityData] = useState({
    name: "",
    type: "",
    start_date_local: "",
    elapsed_time: "",
    description: "",
    distance: "",
    trainer: false,
    commute: false,
  });

  const handleInputChange = (event: any) => {
    const { name, value, type, checked } = event.target;
    setActivityData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    alert("Activity Submitted");
    navigate("/activities");
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ textAlign: "center", marginTop: 4 }}>
        Create Activity
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Name"
            name="name"
            value={activityData.name}
            onChange={handleInputChange}
            data-testid="activity-name"
            required
          />
          <TextField
            label="Type"
            name="type"
            value={activityData.type}
            onChange={handleInputChange}
            placeholder="Enter Start Date"
            data-testid="activity-type"
            required
          />
          <TextField
            name="start_date_local"
            type="datetime-local"
            value={activityData.start_date_local}
            onChange={handleInputChange}
            data-testid="activity-date"
            required
          />
          <TextField
            label="Elapsed Time (seconds)"
            name="elapsed_time"
            type="number"
            value={activityData.elapsed_time}
            onChange={handleInputChange}
            data-testid="elapsed-time"
            required
          />
          <TextField
            label="Description"
            name="description"
            value={activityData.description}
            onChange={handleInputChange}
            multiline
            data-testid="activity-description"
            rows={4}
          />
          <TextField
            label="Distance (meters)"
            name="distance"
            type="number"
            value={activityData.distance}
            onChange={handleInputChange}
            data-testid="activity-distance"
            required
          />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <label>
              Trainer:
              <input
                type="checkbox"
                name="trainer"
                checked={activityData.trainer}
                onChange={handleInputChange}
              />
            </label>
            <label style={{ marginLeft: "16px" }}>
              Commute:
              <input
                type="checkbox"
                name="commute"
                checked={activityData.commute}
                onChange={handleInputChange}
              />
            </label>
          </Box>
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default CreateActivity;
