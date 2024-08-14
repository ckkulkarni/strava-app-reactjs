import React, { Component } from "react";
import {
  Typography,
  TextField,
  Box,
  Button,
  Container,
  CircularProgress,
  Backdrop,
  FormControl,
  FormLabel,
  SxProps,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Select,
  MenuItem,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import withNavigate from "../utils/navigation";
import { AxiosResponse } from "axios";
import { http } from "../utils/http";

export const InputWrapper: SxProps = {
  width: "100%",
  justifyContent: "space-between",
};
export const LabelStyle: SxProps = {
  fontWeight: 500,
  fontSize: "16px",
  lineHeight: "150%",
  mb: "10px",
  color: "#111928",
  "& .MuiFormLabel-asterisk": {
    color: "#F05252",
  },
};
export const commonContainerWrapper: SxProps = {
  backgroundColor: "#FFFFFF",
  borderRadius: "8px",
  p: 2.5,
  mb: 2,
  display: "flex",
  justifyContent: "center",
  boxShadow: "0px 0px 12px 0px rgba(0, 0, 0, 0.08)",
};

interface State {
  loading: boolean;
  accessToken: any;
}

const activityTypes = [
  "Run",
  "Ride",
  "Swim",
  "Walk",
  "Hike",
  "AlpineSki",
  "BackcountrySki",
  "Canoeing",
  "Crossfit",
  "EBikeRide",
  "Elliptical",
  "IceSkate",
  "InlineSkate",
  "Kayaking",
  "Kitesurf",
  "NordicSki",
  "RockClimbing",
  "RollerSki",
  "Rowing",
  "Sail",
  "Skateboard",
  "Snowboard",
  "Snowshoe",
  "Soccer",
  "StairStepper",
  "StandUpPaddling",
  "Surfing",
  "VirtualRide",
  "WeightTraining",
  "Windsurf",
  "Workout",
  "Yoga",
];

interface Props {
  navigate: (path: string) => void;
}

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  type: yup.string().required("Type is required"),
  start_date_local: yup.string().required("Start Date is required"),
  elapsed_time: yup.number().required("Elapsed Time is required"),
  description: yup.string().optional(),
  distance: yup.number().required("Distance is required"),
  trainer: yup.boolean().optional(),
  commute: yup.boolean().optional(),
});

class CreateActivity extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      accessToken: localStorage.getItem("access_token"),
    };
  }

  submitHandler = async (values: any) => {
    try {
      this.setState({ loading: true });
      const headers = { Authorization: `Bearer ${this.state.accessToken}` };
      if (!this.state.accessToken) return;

      const data = {
        name: values?.name,
        type: values?.type,
        start_date_local: values?.start_date_local,
        elapsed_time: values?.elapsed_time,
        description: values?.description,
        distance: values?.distance,
        trainer: values?.trainer ? 1 : 0,
        commute: values?.commute ? 1 : 0,
      };
      const response: any = await http.post("/activities", data, {
        headers,
      });
      alert("Activity Added Successfully!");
      this.props.navigate("/activities");
      // setButtonLoader(false);
    } catch (err) {
      alert(err as Error);
      console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading } = this.state;

    return (
      <>
        <Typography variant="h4" sx={{ textAlign: "center", marginTop: 4 }}>
          Create Activity
        </Typography>
        <Box sx={commonContainerWrapper}>
          <Formik
            initialValues={{
              name: "",
              type: activityTypes[0],
              start_date_local: "",
              elapsed_time: "",
              description: "",
              distance: "",
              trainer: false,
              commute: false,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              this.submitHandler(values);
            }}
          >
            {({ errors, touched, getFieldProps, values, setFieldValue }) => (
              <Form>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    minWidth: "500px",
                  }}
                >
                  <FormControl sx={InputWrapper}>
                    <FormLabel htmlFor="name" sx={LabelStyle}>
                      Name *
                    </FormLabel>
                    <TextField
                      data-testid="activity-name"
                      id="name"
                      {...getFieldProps("name")}
                      error={touched?.name && errors?.name ? true : false}
                      helperText={
                        touched?.name && errors?.name ? errors?.name : " "
                      }
                    />
                  </FormControl>
                  <FormControl sx={InputWrapper}>
                    <FormLabel htmlFor="type" sx={LabelStyle}>
                      Type *
                    </FormLabel>
                    <Select
                      data-testid="activity-type"
                      value={values?.type}
                      id="type"
                      onChange={(e) => setFieldValue("type", e.target.value)}
                    >
                      {activityTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText
                      error={touched?.type && errors?.type ? true : false}
                    >
                      {touched?.type && errors?.type
                        ? (errors?.type as string)
                        : " "}
                    </FormHelperText>
                  </FormControl>
                  <FormControl sx={InputWrapper}>
                    <FormLabel htmlFor="start_date_local" sx={LabelStyle}>
                      Start Date *
                    </FormLabel>
                    <TextField
                      data-testid="activity-date"
                      id="start_date_local"
                      type="datetime-local"
                      {...getFieldProps("start_date_local")}
                      error={
                        touched?.start_date_local && errors?.start_date_local
                          ? true
                          : false
                      }
                      helperText={
                        touched?.start_date_local && errors?.start_date_local
                          ? errors?.start_date_local
                          : " "
                      }
                    />
                  </FormControl>
                  <FormControl sx={InputWrapper}>
                    <FormLabel htmlFor="elapsed_time" sx={LabelStyle}>
                      Elapsed Time (seconds) *
                    </FormLabel>
                    <TextField
                      data-testid="elapsed-time"
                      id="elapsed_time"
                      type="number"
                      {...getFieldProps("elapsed_time")}
                      error={
                        touched?.elapsed_time && errors?.elapsed_time
                          ? true
                          : false
                      }
                      helperText={
                        touched?.elapsed_time && errors?.elapsed_time
                          ? errors?.elapsed_time
                          : " "
                      }
                    />
                  </FormControl>
                  <FormControl sx={InputWrapper}>
                    <FormLabel htmlFor="description" sx={LabelStyle}>
                      Description
                    </FormLabel>
                    <TextField
                      id="description"
                      {...getFieldProps("description")}
                      multiline
                      rows={4}
                      error={
                        touched?.description && errors?.description
                          ? true
                          : false
                      }
                      helperText={
                        touched?.description && errors?.description
                          ? errors?.description
                          : " "
                      }
                    />
                  </FormControl>
                  <FormControl sx={InputWrapper}>
                    <FormLabel htmlFor="distance" sx={LabelStyle}>
                      Distance (meters) *
                    </FormLabel>
                    <TextField
                      data-testid="activity-distance"
                      id="distance"
                      type="number"
                      {...getFieldProps("distance")}
                      error={
                        touched?.distance && errors?.distance ? true : false
                      }
                      helperText={
                        touched?.distance && errors?.distance
                          ? errors?.distance
                          : " "
                      }
                    />
                  </FormControl>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <FormControl sx={InputWrapper}>
                      <FormControlLabel
                        control={<Checkbox {...getFieldProps("trainer")} />}
                        label="Trainer"
                      />
                      <FormHelperText
                        error={
                          touched?.trainer && errors?.trainer ? true : false
                        }
                      >
                        {touched?.trainer && errors?.trainer
                          ? (errors?.trainer as string)
                          : " "}
                      </FormHelperText>
                    </FormControl>
                    <FormControl sx={InputWrapper}>
                      <FormControlLabel
                        control={<Checkbox {...getFieldProps("commute")} />}
                        label="Commute"
                      />
                      <FormHelperText
                        error={
                          touched?.commute && errors?.commute ? true : false
                        }
                      >
                        {touched?.commute && errors?.commute
                          ? (errors?.commute as string)
                          : " "}
                      </FormHelperText>
                    </FormControl>
                  </Box>
                  {!loading ? (
                    <Button type="submit" variant="contained" color="primary">
                      Create
                    </Button>
                  ) : (
                    <Box>
                      <CircularProgress color="inherit" />
                    </Box>
                  )}
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </>
    );
  }
}

export default withNavigate(CreateActivity);
