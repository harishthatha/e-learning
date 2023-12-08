import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Dropdown,
  Form,
  Grid,
  Header,
} from "semantic-ui-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import CustomMessage from "../layout/CustomMessage";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const UpdateSection = () => {
  const { id: courseId, sectionId } = useParams();
  const [sectionDetails, setSectionDetails] = useState({
    days: [],
    startTime: "",
    endTime: "",
    maxStrength: "",
    instructorId: "",
  });

  const [instructors, setInstructors] = useState([]);
  const [error, setError] = useState(null);

  const [message, setMessage] = useState({
    content: "",
    type: "",
  });
  const [openMessage, setOpenMessage] = useState(false);
  const navigate = useNavigate();
  const [course, setCourse] = useState({});

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      setCourse(response.data);
    } catch (err) {
      setError("Error fetching admin courses: " + err.message);
    }
  };

  const fetchSectionDetails = async () => {
    try {
      const response = await api.get(`/sections/${sectionId}`);
      setSectionDetails({
        days: [response.data.day],
        startTime: response.data.startTime,
        endTime: response.data.endTime,
        maxStrength: response.data.maxStrength,
        instructorId: response.data.instructorId,
      });
    } catch (err) {
      setError("Error fetching section details: " + err.message);
    }
  };

  useEffect(() => {
    fetchInstructors();
    fetchCourse();
    fetchSectionDetails();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await api.get("/instructors");
      setInstructors(response.data);
    } catch (err) {
      setError("Error fetching instructors: " + err.message);
    }
  };

  const handleInputChange = (name, value) => {
    setSectionDetails({ ...sectionDetails, [name]: value });
  };

  const handleSubmit = async () => {
    // Empty field validations
    for (const key in sectionDetails) {
      if (!sectionDetails[key]) {
        setMessage({
          content: "All fields are required!",
          type: "error",
        });
        setOpenMessage(true);
        return;
      }
    }

    try {
      await api.put(`/sections/${sectionId}`, {
        ...sectionDetails,
        courseId,
        listOfDays: sectionDetails.days,
      });

      setMessage({
        content: "Section updated successfully",
        type: "success",
      });
      setOpenMessage(true);
      setTimeout(() => {
        navigate(`/admin/courses/${courseId}/details`);
      }, 1000);
    } catch (err) {
      setMessage({
        content: err?.response?.data || "Error updating section",
        type: "error",
      });
      setOpenMessage(true);
      console.error(err);
    }
  };

  return (
    <Container style={{ marginTop: "20px", textAlign: "center" }}>
      {openMessage && (
        <CustomMessage
          type={message.type}
          content={message.content}
          onClose={() => setOpenMessage(false)}
        />
      )}
      <Header as="h4">{course?.title}</Header>
      <Grid columns={2} centered>
        <Grid.Row centered>
          <Grid.Column width={5}>
            <Form>
              <Form.Field>
                <label>Days</label>
                <Dropdown
                  fluid
                  multiple
                  selection
                  options={daysOfWeek.map((day) => ({
                    key: day,
                    text: day,
                    value: day,
                  }))}
                  value={sectionDetails.days}
                  onChange={(_, { value }) => handleInputChange("days", value)}
                  disabled
                />
              </Form.Field>
              <Form.Field>
                <label>Start Time</label>
                <Form.Input
                  type="time"
                  value={sectionDetails.startTime}
                  onChange={(e) =>
                    handleInputChange("startTime", e.target.value)
                  }
                />
              </Form.Field>
              <Form.Field>
                <label>End Time</label>
                <Form.Input
                  type="time"
                  value={sectionDetails.endTime}
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
                />
              </Form.Field>
              <Form.Field>
                <label>Total Seats</label>
                <Form.Input
                  type="number"
                  value={sectionDetails.maxStrength}
                  onChange={(e) =>
                    handleInputChange("maxStrength", e.target.value)
                  }
                />
              </Form.Field>
              <Form.Field>
                <label>Select Instructor</label>
                <Dropdown
                  fluid
                  selection
                  options={instructors.map((instructor) => ({
                    key: instructor.instructorId,
                    text: instructor.firstName + " " + instructor.lastName,
                    value: instructor.instructorId,
                  }))}
                  value={sectionDetails.instructorId}
                  onChange={(_, { value }) =>
                    handleInputChange("instructorId", value)
                  }
                />
              </Form.Field>
              <Button content="Update Section" primary onClick={handleSubmit} />
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default UpdateSection;
