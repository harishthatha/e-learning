import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Table,
  Message,
  Modal,
  Header,
} from "semantic-ui-react";
import api from "../api/api";
import { useNavigate, useParams } from "react-router-dom";

const InstructorList = () => {
  const { sectionId } = useParams();
  const [instructors, setInstructors] = useState([]);
  const [snackbar, setSnackbar] = useState({ message: "", alertType: "" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  const fetchData = async () => {
    try {
      const instructorsResponse = await api.get(`/instructors`);
      setInstructors(instructorsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sectionId]);

  const handleRemoveInstructor = async (instructorId) => {
    try {
      await api.delete(`/instructors/${instructorId}`);
      fetchData();
      setSnackbar({
        message: "Instructor removed successfully",
        alertType: "success",
      });
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error removing instructor:", error);
      setSnackbar({ message: "Error removing instructor", alertType: "error" });
      setOpenSnackbar(true);
    }
  };

  const handleOpenDialog = (instructor) => {
    setSelectedInstructor(instructor);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedInstructor(null);
    setOpenDialog(false);
  };

  return (
    <Container style={{ marginTop: "20px" }}>
      <Header as="h2">Instructor List</Header>

      {openSnackbar && (
        <Message
          positive={snackbar.alertType === "success"}
          negative={snackbar.alertType === "error"}
          onDismiss={() => setOpenSnackbar(false)}
          header={snackbar.message}
        />
      )}

      <Table selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Instructor ID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell>Education</Table.HeaderCell>
            <Table.HeaderCell>Experience</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {instructors.map((instructor) => (
            <Table.Row key={instructor.instructorId}>
              <Table.Cell>{instructor.instructorId}</Table.Cell>
              <Table.Cell>
                {instructor.firstName} {instructor.lastName}
              </Table.Cell>
              <Table.Cell>{instructor.email}</Table.Cell>
              <Table.Cell>{instructor.address || "N/A"}</Table.Cell>
              <Table.Cell>{instructor.education || "N/A"}</Table.Cell>
              <Table.Cell>{instructor.experience || "N/A"}</Table.Cell>
              <Table.Cell>
                <Button
                  color="red"
                  onClick={() => handleOpenDialog(instructor)}
                >
                  Delete
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Remove Instructor Confirmation Modal */}
      <Modal open={openDialog} onClose={handleCloseDialog} size="tiny">
        <Modal.Header>Remove Instructor</Modal.Header>
        <Modal.Content>
          <p>
            Are you sure you want to remove {selectedInstructor?.firstName}?
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={handleCloseDialog}>
            No
          </Button>
          <Button
            positive
            onClick={() => {
              handleRemoveInstructor(selectedInstructor?.instructorId);
              handleCloseDialog();
            }}
          >
            Yes
          </Button>
        </Modal.Actions>
      </Modal>
    </Container>
  );
};

export default InstructorList;
