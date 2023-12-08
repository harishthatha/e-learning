import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Header,
  Form,
  Input,
  Message,
} from "semantic-ui-react";
import api from "../../api/api";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const AssignmentList = () => {
  const { sectionId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadFileName, setUploadFileName] = useState("");
  const [snackbar, setSnackbar] = useState({
    message: "",
    alertType: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const assignmentsResponse = await api.get(
        `/instructors/${user?.userId}/sections/${sectionId}/assignments`
      );
      setAssignments(assignmentsResponse.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const submissionsResponse = await api.get(
        `/assignments/${assignmentId}/submissions`
      );
      setSubmissions(submissionsResponse.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sectionId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadFile(file);
    setUploadFileName(file.name);
  };

  const handleUploadFile = async () => {
    // Implement file upload logic here
    // You need to customize this based on your backend
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);

      await api.post(
        `/assignments/${selectedAssignment}/submissions`,
        formData
      );

      setSnackbar({
        message: "File uploaded successfully",
        alertType: "success",
      });
      setOpenSnackbar(true);
      setOpenUploadModal(false);
      setUploadFile(null);
      setUploadFileName("");
      fetchSubmissions(selectedAssignment);
    } catch (error) {
      console.error("Error uploading file:", error);
      setSnackbar({
        message: "Error uploading file",
        alertType: "error",
      });
      setOpenSnackbar(true);
    }
  };

  return (
    <Container style={{ marginTop: "20px" }}>
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
            <Table.HeaderCell>Assignment</Table.HeaderCell>
            <Table.HeaderCell>Submissions</Table.HeaderCell>
            <Table.HeaderCell>Points</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {assignments.map((assignment) => (
            <Table.Row key={assignment.assignmentId}>
              <Table.Cell>{assignment.title}</Table.Cell>
              <Table.Cell>
                {submissions
                  .filter(
                    (submission) =>
                      submission.assignmentId === assignment.assignmentId
                  )
                  .map((submission) => (
                    <div key={submission.submissionId}>
                      {submission.fileName}
                    </div>
                  ))}
              </Table.Cell>
              <Table.Cell>{assignment.points}</Table.Cell>
              <Table.Cell>
                <Button
                  primary
                  onClick={() => {
                    setSelectedAssignment(assignment.assignmentId);
                    fetchSubmissions(assignment.assignmentId);
                    setOpenUploadModal(true);
                  }}
                >
                  Upload File
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Modal
        open={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
        size="small"
      >
        <Modal.Header>Upload File</Modal.Header>
        <Modal.Content>
          <Header as="h4">{`Upload file for Assignment ${
            selectedAssignment || ""
          }`}</Header>
          <Form>
            <Form.Field>
              <Input
                type="file"
                onChange={handleFileChange}
                label="File"
                placeholder="Choose file"
                value={uploadFileName}
                action={<Button onClick={handleUploadFile}>Upload</Button>}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
      </Modal>
    </Container>
  );
};

export default AssignmentList;
