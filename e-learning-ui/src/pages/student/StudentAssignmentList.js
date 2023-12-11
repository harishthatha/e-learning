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
import { convertTo12HourFormat } from "./constants";
import FileViewer from "./FileViewer"; // Import the FileViewer component

const StudentAssignmentList = () => {
  const { sectionId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [selectedAssignmentData, setSelectedAssignmentData] = useState({});
  const [snackbar, setSnackbar] = useState({
    message: "",
    alertType: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openViewFileModal, setOpenViewFileModal] = useState(false); // New state for the View File modal
  const { user } = useAuth();
  const [isAttachment, setIsAttachment] = useState(false);

  const fetchData = async () => {
    try {
      const assignmentsResponse = await api.get(
        `/students/${user?.userId}/sections/${sectionId}/assignments`
      );
      setAssignments(assignmentsResponse.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sectionId]);

  const isAssignmentOverdue = (dueDate, dueTime) => {
    const currentDate = new Date();
    const assignmentDueDateTime = new Date(`${dueDate}T${dueTime}`);
    return currentDate > assignmentDueDateTime;
  };

  const handleFileChange = (e) => {
    debugger;
    const file = e.target.files[0];
    setUploadFile(file);
  };

  const handleUploadFile = async () => {
    try {
      if (!uploadFile) {
        setSnackbar({
          message: "Please select a file to upload",
          alertType: "error",
        });
        setOpenSnackbar(true);
        return;
      }

      const formData = new FormData();
      formData.append("assignmentFile", uploadFile);

      await api.post(
        `/students/${user?.userId}/sections/${sectionId}/assignments/${selectedAssignment}/submission`,
        formData
      );

      setSnackbar({
        message: "File uploaded successfully",
        alertType: "success",
      });
      setOpenSnackbar(true);
      fetchData();
      setTimeout(() => {
        setSnackbar({
          message: "",
          alertType: "success",
        });
        setOpenSnackbar(false);
      }, 1000);
      setOpenUploadModal(false);
      setUploadFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      setSnackbar({
        message: "Error uploading file",
        alertType: "error",
      });
      setOpenSnackbar(true);
    }
  };

  const handleViewFile = () => {
    setOpenViewFileModal(true);
  };

  return (
    <Container style={{ marginTop: "20px" }}>
      {openSnackbar && (
        <Message
          positive={snackbar.alertType === "success"}
          negative={snackbar.alertType === "error"}
          onDismiss={() => setOpenSnackbar(false)}
          header={snackbar.message}
          width={"60%"}
        />
      )}

      <Container as={"h2"}>Your Assignments</Container>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Assignment</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Attachments</Table.HeaderCell>
            <Table.HeaderCell>Due date</Table.HeaderCell>
            <Table.HeaderCell>Due time</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
            <Table.HeaderCell>Submissions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {assignments.map((assignment) => (
            <Table.Row key={assignment.assignmentId}>
              <Table.Cell>{assignment.title}</Table.Cell>
              <Table.Cell>{assignment.description}</Table.Cell>
              <Table.Cell>
                {assignment?.attachmentUrl && (
                  <Button
                    color="teal"
                    onClick={() => {
                      setSelectedAssignmentData(assignment);
                      setSelectedAssignment(assignment.assignmentId);
                      handleViewFile();
                      setIsAttachment(true);
                    }}
                  >
                    Show
                  </Button>
                )}
              </Table.Cell>
              <Table.Cell>{assignment.dueDate}</Table.Cell>
              <Table.Cell>
                {convertTo12HourFormat(assignment.dueTime)}
              </Table.Cell>
              <Table.Cell>
                {!isAssignmentOverdue(
                  assignment.dueDate,
                  assignment.dueTime
                ) ? (
                  <Button
                    secondary
                    onClick={() => {
                      setSelectedAssignment(assignment.assignmentId);
                      setOpenUploadModal(true);
                    }}
                  >
                    Upload File
                  </Button>
                ) : (
                  "Submission Closed"
                )}
              </Table.Cell>

              <Table.Cell>
                {assignment?.submission?.fileUrl && (
                  <Button
                    primary
                    onClick={() => {
                      setSelectedAssignmentData(assignment);
                      setSelectedAssignment(assignment.assignmentId);
                      handleViewFile(); // Open the View File modal
                    }}
                  >
                    View submission
                  </Button>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Upload File Modal */}
      <Modal
        open={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
        size="medium"
      >
        <Modal.Header>
          {uploadFile ? uploadFile?.name : "Upload File"}
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <Input
                type="file"
                onChange={handleFileChange}
                label="File"
                placeholder="Choose file"
                accept=".pdf, image/*"
              />
            </Form.Field>
            <Button primary onClick={handleUploadFile}>
              Upload
            </Button>
          </Form>
        </Modal.Content>
      </Modal>

      {/* View File Modal */}
      <Modal
        open={openViewFileModal}
        onClose={() => {
          setOpenViewFileModal(false);
          setIsAttachment(false);
        }}
        size="large"
      >
        <Modal.Header>
          {isAttachment ? "Attachment Viewer" : "File Viewer"}
        </Modal.Header>
        <Modal.Content>
          <FileViewer
            file={
              isAttachment
                ? selectedAssignmentData?.attachmentUrl
                : selectedAssignmentData?.submission?.fileUrl
            }
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="black"
            onClick={() => {
              setOpenViewFileModal(false);
              setIsAttachment(false);
            }}
          >
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    </Container>
  );
};

export default StudentAssignmentList;
