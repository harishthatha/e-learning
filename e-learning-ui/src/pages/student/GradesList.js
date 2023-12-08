import React, { useState, useEffect } from "react";
import { Container, Table, Message, Header, Segment } from "semantic-ui-react";
import api from "../../api/api";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { convertTo12HourFormat } from "./constants";
import moment from "moment";

const GradesList = () => {
  const { sectionId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [snackbar, setSnackbar] = useState({
    message: "",
    alertType: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { user } = useAuth();
  const [enrollment, setEnrollment] = useState();
  const fetchData = async () => {
    try {
      const assignmentsResponse = await api.get(
        `/students/${user?.userId}/sections/${sectionId}/assignments`
      );
      const enrollmentObject = assignmentsResponse.data[0] || {};

      setEnrollment(enrollmentObject?.enrollment);

      setAssignments(assignmentsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sectionId]);

  // Calculate total obtained marks and total assignment marks
  const totalObtainedMarks = assignments.reduce(
    (acc, assignment) =>
      acc +
      (assignment.submission && assignment.submission?.points != null
        ? parseInt(assignment.submission?.points)
        : 0),
    0
  );

  const totalAssignmentMarks = assignments.reduce(
    (acc, assignment) => acc + parseInt(assignment.points),
    0
  );

  // Define a function to determine the styling based on the percentage
  const getPercentageStyle = (percentage) => {
    if (percentage >= 90) return { backgroundColor: "#39e379", color: "black" };
    else if (percentage >= 80 && percentage < 90)
      return { backgroundColor: "lightgreen", color: "black" };
    else if (percentage >= 70 && percentage < 80)
      return { backgroundColor: "orange", color: "black" };
    else if (percentage >= 60 && percentage < 70)
      return { backgroundColor: "yellow", color: "black" };
    else return { backgroundColor: "red", color: "black" };
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

      <Header as="h2">Grades List</Header>

      <Segment
        style={{
          textAlign: "right",
          marginTop: 0,
          padding: 16,
          backgroundColor: "rgb(230, 247, 255)",
        }}
      >
        <Header as="h3">
          <span style={{ marginRight: "20px" }}>
            Grade: {enrollment?.grade}{" "}
          </span>
          Total:{" "}
          <div
            style={{
              display: "inline-block",
              borderRadius: 20, // Make it circular
              padding: "10px",
              backgroundColor: getPercentageStyle(
                (totalObtainedMarks / totalAssignmentMarks) * 100
              ).backgroundColor, // Set the background color based on the percentage
            }}
          >
            {totalObtainedMarks} {`/`} {totalAssignmentMarks}{" "}
          </div>
        </Header>
      </Segment>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Assignment</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Due Date & time</Table.HeaderCell>
            <Table.HeaderCell>Submission Status</Table.HeaderCell>
            <Table.HeaderCell>Submission Date</Table.HeaderCell>
            <Table.HeaderCell>Marks</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {assignments.map((assignment) => {
            const { submission } = assignment;
            const obtainedMarks = submission ? submission.points : 0;
            const percentage = (obtainedMarks / assignment.points) * 100;

            return (
              <Table.Row key={assignment.assignmentId}>
                <Table.Cell>{assignment.title}</Table.Cell>
                <Table.Cell>{assignment.description}</Table.Cell>
                <Table.Cell>
                  {assignment.dueDate},
                  {convertTo12HourFormat(assignment.dueTime)}
                </Table.Cell>
                <Table.Cell>
                  {submission ? submission.status : "Not Submitted"}
                </Table.Cell>
                <Table.Cell>
                  {submission
                    ? moment(submission.dateTime).format("YYYY-MM-DD h:mm A")
                    : "N/A"}
                </Table.Cell>
                <Table.Cell>
                  <div
                    style={{
                      ...getPercentageStyle(
                        (obtainedMarks / assignment.points) * 100
                      ),
                      borderRadius: 24,
                      height: 35,
                      textAlign: "center",
                      marginTop: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <b>
                      {obtainedMarks === null
                        ? 0 + `/` + assignment.points
                        : obtainedMarks + `/` + assignment.points}
                    </b>
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Container>
  );
};

export default GradesList;
