import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Table,
  Message,
  Modal,
  Header,
} from "semantic-ui-react";
import api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";

const EnrolledStudentsList = () => {
  const { sectionId } = useParams();
  const [students, setStudents] = useState([]);
  const [snackbar, setSnackbar] = useState({
    message: "",
    alertType: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const studentsResponse = await api.get(`/sections/${sectionId}/students`);
      setStudents(studentsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sectionId]);

  const handleRemoveStudent = async (studentId) => {
    try {
      // Your logic to remove a student goes here
      // For example, api.delete(`/sections/${sectionId}/students/${studentId}`);
      // Then refresh the data
      fetchData();
      setSnackbar({
        message: "Student removed successfully",
        alertType: "success",
      });
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error removing student:", error);
      setSnackbar({
        message: "Error removing student",
        alertType: "error",
      });
      setOpenSnackbar(true);
    }
  };

  return (
    <Container style={{ marginTop: "20px" }}>
      <Header as="h3">Enrolled Students List</Header>

      {openSnackbar && (
        <Message
          positive={snackbar.alertType === "success"}
          negative={snackbar.alertType === "error"}
          onDismiss={() => setOpenSnackbar(false)}
          header={snackbar.message}
        />
      )}

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Student ID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {students.map((student) => (
            <Table.Row key={student.studentId}>
              <Table.Cell>{student.studentIdNumber}</Table.Cell>
              <Table.Cell>
                {student.firstName} {student.lastName}
              </Table.Cell>
              <Table.Cell>{student.email}</Table.Cell>
              <Table.Cell>
                <Button
                  secondary
                  onClick={() =>
                    navigate(
                      `/instructor/courses/${sectionId}/students/${student.studentId}/assignments`
                    )
                  }
                >
                  Assignments
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  );
};

export default EnrolledStudentsList;
