import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Header, Table, Container } from "semantic-ui-react";
import api from "../../api/api";
import moment from "moment";
import { useAuth } from "../../contexts/AuthContext";

const SectionAssignments = () => {
  const { sectionId } = useParams();
  const [assignments, setAssignments] = useState([]); // Assignments data from API
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
  }, [user?.userId, sectionId]);

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
                  <Link
                    to={`/instructor/courses/${sectionId}/assignments/${assignment.assignmentId}/update`}
                  >
                    <Button primary>Update</Button>
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </Container>
  );
};

export default SectionAssignments;
