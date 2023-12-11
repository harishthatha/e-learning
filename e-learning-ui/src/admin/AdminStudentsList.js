import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Table,
  Message,
  Header,
  Modal,
} from "semantic-ui-react";
import api from "../api/api";
import { useNavigate, useParams } from "react-router-dom";

const AdminStudentsList = () => {
  const { sectionId } = useParams();
  const [students, setStudents] = useState([]);
  const [snackbar, setSnackbar] = useState({ message: "", alertType: "" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const studentsResponse = await api.get(`/students`);
      setStudents(studentsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sectionId]);

  const handleEnrollCourses = (studentId) => {
    // `/admin/courses/${studentId}/enroll-courses`
    navigate(`/admin/courses/${studentId}/enroll-courses`);
  };

  return (
    <Container style={{ marginTop: "20px" }}>
      <Header as="h2">Enrolled Students List</Header>

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
            <Table.HeaderCell>Student ID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell>Graduation Level</Table.HeaderCell>
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
              <Table.Cell>{student.address || "N/A"}</Table.Cell>
              <Table.Cell>{student.graduationLevel || "N/A"}</Table.Cell>

              <Table.Cell>
                <Button
                  secondary
                  onClick={() => handleEnrollCourses(student.studentId)}
                >
                  Enroll courses
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  );
};

export default AdminStudentsList;
