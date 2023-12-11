import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Form,
  Grid,
  Header,
  Input,
} from "semantic-ui-react";
import api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import CustomMessage from "../../layout/CustomMessage";

const UpdateAssignment = () => {
  const { sectionId, assignmentId } = useParams();
  const [assignmentDetails, setAssignmentDetails] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    points: "",
    attachment: null, // New property for attachment file
  });

  const [message, setMessage] = useState({
    content: "",
    type: "",
  });

  const [openMessage, setOpenMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch assignment details and populate the form
    const fetchAssignmentDetails = async () => {
      try {
        const response = await api.get(`/assignments/${assignmentId}`);
        const { title, description, dueDate, dueTime, points } = response.data;
        setAssignmentDetails({ title, description, dueDate, dueTime, points });
      } catch (error) {
        console.error("Error fetching assignment details:", error.message);
      }
    };

    fetchAssignmentDetails();
  }, [assignmentId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAssignmentDetails({ ...assignmentDetails, attachment: file });
  };

  const handleSubmit = async () => {
    const { title, dueDate, dueTime, points, attachment } = assignmentDetails;

    // Check if points is not a valid integer
    if (!title || !dueDate || !dueTime || !Number.isInteger(Number(points))) {
      setMessage({
        content: "All fields are required, and points must be a valid integer",
        type: "error",
      });
      setOpenMessage(true);
      setTimeout(() => {
        setOpenMessage(false);
      }, 1000);
      return;
    }

    try {
      const formData = new FormData();
      formData.append(
        "assignmentJson",
        JSON.stringify({
          sectionId,
          title,
          dueDate,
          dueTime,
          points,
          description: assignmentDetails.description || "",
        })
      );
      formData.append("attachment", attachment);

      await api.put(`/assignments/${assignmentId}`, formData, {
        params: { sectionId },
      });

      setMessage({
        content: "Assignment updated successfully",
        type: "success",
      });
      setOpenMessage(true);
      setTimeout(() => {
        navigate(`/instructor/courses/${sectionId}/assignments`);
      }, 1000);
    } catch (err) {
      setMessage({
        content: "Error updating assignment",
        type: "error",
      });
      setOpenMessage(true);
      setTimeout(() => {
        setOpenMessage(false);
      }, 1000);
      console.error(err);
    }
  };

  return (
    <Container>
      {openMessage && (
        <CustomMessage type={message.type} content={message.content} />
      )}
      <Header as="h2" content="Update Assignment" textAlign="center" />
      <Container>
        <Grid centered>
          <Grid.Row>
            <Grid.Column width={5}>
              <Form>
                <Form.Field>
                  <label>Title</label>
                  <Input
                    fluid
                    size="small"
                    value={assignmentDetails.title}
                    onChange={(e) =>
                      setAssignmentDetails({
                        ...assignmentDetails,
                        title: e.target.value,
                      })
                    }
                  />
                </Form.Field>

                <Form.Field>
                  <label>Due Date</label>
                  <Input
                    fluid
                    type="date"
                    size="small"
                    value={assignmentDetails.dueDate}
                    onChange={(e) =>
                      setAssignmentDetails({
                        ...assignmentDetails,
                        dueDate: e.target.value,
                      })
                    }
                  />
                </Form.Field>

                <Form.Field>
                  <label>Due Time</label>
                  <Input
                    fluid
                    type="time"
                    size="small"
                    value={assignmentDetails.dueTime}
                    onChange={(e) =>
                      setAssignmentDetails({
                        ...assignmentDetails,
                        dueTime: e.target.value,
                      })
                    }
                  />
                </Form.Field>

                <Form.Field>
                  <label>Points</label>
                  <Input
                    fluid
                    size="small"
                    value={assignmentDetails.points}
                    onChange={(e) =>
                      setAssignmentDetails({
                        ...assignmentDetails,
                        points: e.target.value,
                      })
                    }
                  />
                </Form.Field>

                <Form.Field>
                  <label>Description</label>
                  <Input
                    fluid
                    size="small"
                    value={assignmentDetails.description}
                    onChange={(e) =>
                      setAssignmentDetails({
                        ...assignmentDetails,
                        description: e.target.value,
                      })
                    }
                  />
                </Form.Field>

                <Form.Field>
                  <label>Attachment</label>
                  <Input
                    fluid
                    type="file"
                    size="small"
                    onChange={handleFileChange}
                  />
                </Form.Field>

                <Button
                  fluid
                  color="blue"
                  style={{ marginTop: "20px" }}
                  onClick={handleSubmit}
                >
                  Update Assignment
                </Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Container>
  );
};

export default UpdateAssignment;
