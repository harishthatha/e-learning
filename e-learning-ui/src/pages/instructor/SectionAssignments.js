import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Container, Modal, Table } from "semantic-ui-react";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import FileViewer from "../student/FileViewer";

const SectionAssignments = () => {
  const { sectionId } = useParams();
  const [assignments, setAssignments] = useState([]); // Assignments data from API
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [openViewFileModal, setOpenViewFileModal] = useState(false); // New state for the View File modal
  const { user } = useAuth();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await api.get(
          `/instructors/${user?.userId}/sections/${sectionId}/assignments`
        );
        setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching assignments:", error.message);
      }
    };

    fetchAssignments();
  }, [sectionId]);

  const handleViewFile = (assignmentId) => {
    setSelectedAssignment(assignmentId);
    setOpenViewFileModal(true);
  };

  return (
    <Container style={{ padding: "20px" }}>
      <Link
        to={`/instructor/courses/${sectionId}/assignments/new`}
        style={{ float: "right", marginBottom: "12px" }}
      >
        <Button primary>Create Assignment</Button>
      </Link>

      <Table striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Assignment Name</Table.HeaderCell>
            <Table.HeaderCell>Due Date</Table.HeaderCell>
            <Table.HeaderCell>Marks</Table.HeaderCell>
            <Table.HeaderCell>Attachment</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {assignments &&
            assignments.map((assignment) => (
              <Table.Row key={assignment.assignmentId}>
                <Table.Cell>{assignment.title}</Table.Cell>
                <Table.Cell>
                  {assignment.dueDate},{"  "}
                  {assignment.dueTime &&
                    moment(assignment.dueTime, "HH:mm").format("h:mm A")}
                </Table.Cell>
                <Table.Cell>{assignment.points}</Table.Cell>

                <Table.Cell>
                  {assignment.attachmentUrl && (
                    <Button
                      color="teal"
                      onClick={() => handleViewFile(assignment.assignmentId)}
                    >
                      Show
                    </Button>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Link
                    to={`/instructor/courses/${sectionId}/assignments/${assignment.assignmentId}/update`}
                  >
                    <Button primary>Edit</Button>
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>

      {/* View File Modal */}
      <Modal
        open={openViewFileModal}
        onClose={() => setOpenViewFileModal(false)}
        size="large"
      >
        <Modal.Header>Attachment Viewer</Modal.Header>
        <Modal.Content>
          <FileViewer
            file={
              assignments.find((a) => a.assignmentId === selectedAssignment)
                ?.attachmentUrl
            }
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => setOpenViewFileModal(false)}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    </Container>
  );
};

export default SectionAssignments;
