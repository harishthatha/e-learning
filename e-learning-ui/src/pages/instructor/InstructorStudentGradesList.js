import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Message,
  Header,
  Segment,
  Input,
  Button,
  Modal,
  Dropdown,
} from "semantic-ui-react";
import api from "../../api/api";
import { useParams } from "react-router-dom";
import moment from "moment";
import FileViewer from "../student/FileViewer";
import { convertTo12HourFormat } from "../student/constants";
import CustomMessage from "../../layout/CustomMessage";

const InstructorStudentGradesList = () => {
  const { sectionId, studentId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState({
    content: "",
    type: "",
  });

  const [openMessage, setOpenMessage] = useState(false);
  const [student, setStudent] = useState();
  const [selectedAssignment, setSelectedAssignment] = useState();
  const [openViewFileModal, setOpenViewFileModal] = useState(false);
  const [enrollment, setEnrollment] = useState();

  const fetchData = async () => {
    try {
      const assignmentsResponse = await api.get(
        `/students/${studentId}/sections/${sectionId}/assignments`
      );
      setAssignments(assignmentsResponse.data);
      const enrollmentObject = assignmentsResponse.data[0] || {};

      setEnrollment(enrollmentObject?.enrollment);

      let marksObj = {};

      assignmentsResponse.data?.forEach((obj) => {
        marksObj[obj.assignmentId] = obj?.submission?.points || 0;
      });

      setMarks({
        ...marksObj,
      });

      const studentRes = await api.get(`/students/${studentId}`);
      setStudent(studentRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sectionId]);

  const [marks, setMarks] = useState({});

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

  const saveMarks = async (assignment) => {
    const submissionId = assignment?.submission?.submissionId;
    const points = marks[assignment?.assignmentId];
    try {
      await api.put(`/submissions/${submissionId}/update-points`, {
        sectionId,
        points: points || 0,
      });
      setMessage({
        content: "Marks updated successfully",
        type: "success",
      });
      setOpenMessage(true);
      fetchData();
      setTimeout(() => {
        setMessage({
          content: "",
          type: "success",
        });
        setOpenMessage(false);
      }, 1000);
    } catch (err) {
      setMessage({
        content: "Error occured",
        type: "error",
      });
      setOpenMessage(true);
      setTimeout(() => {
        setOpenMessage(false);
      }, 1000);
      console.error(err);
    }
  };

  const saveFinalGrade = async (gradeVal) => {
    if (!gradeVal) return;

    const enrollmentId = enrollment?.enrollmentId;

    try {
      await api.put(`/enrollments/${enrollmentId}/update-final-grade`, {
        grade: gradeVal,
      });
      setMessage({
        content: "Final Grade updated successfully",
        type: "success",
      });
      setOpenMessage(true);
      fetchData();
      setTimeout(() => {
        setMessage({
          content: "",
          type: "success",
        });
        setOpenMessage(false);
      }, 1000);
    } catch (err) {
      setMessage({
        content: "Error occured",
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
    <Container style={{ marginTop: "20px" }}>
      {openMessage && (
        <CustomMessage type={message.type} content={message.content} />
      )}

      <Header as="h2">
        {`${student?.firstName} ${student?.lastName} `}Grades List
      </Header>

      <Segment
        style={{
          textAlign: "right",
          marginTop: 0,
          padding: 16,
          backgroundColor: "rgb(224, 235, 235)",
        }}
      >
        <Header
          as="h3"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              marginLeft: "auto",
              alignItems: "baseline",
            }}
          >
            <Dropdown
              style={{ width: 100, marginRight: 20 }}
              placeholder="Grade"
              fluid
              selection
              options={[
                { key: "A", value: "A", text: "A" },
                { key: "B", value: "B", text: "B" },
                { key: "C", value: "C", text: "C" },
                { key: "D", value: "D", text: "D" },
                { key: "F", value: "F", text: "F" },
              ]}
              onChange={(e, { value }) => saveFinalGrade(value)}
              value={enrollment?.grade}
            />
            Total:{" "}
          </div>
          <div
            style={{
              display: "inline-block",
              borderRadius: 20,
              padding: "10px",
              marginRight: "20px",
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
            <Table.HeaderCell>Due by</Table.HeaderCell>
            <Table.HeaderCell> Status</Table.HeaderCell>
            <Table.HeaderCell>Submission Date</Table.HeaderCell>
            <Table.HeaderCell>Marks</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {assignments.map((assignment) => {
            const { submission } = assignment;
            const obtainedMarks = marks[assignment.assignmentId];

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
                  {submission?.fileUrl && (
                    <>
                      {" "}
                      <Input
                        style={{ width: 100 }}
                        type="number"
                        value={obtainedMarks || ""}
                        onChange={(e) =>
                          setMarks({
                            ...marks,
                            [assignment.assignmentId]:
                              parseInt(e.target.value) || 0,
                          })
                        }
                      />{" "}
                      <Button
                        primary
                        onClick={() => {
                          saveMarks(assignment);
                        }}
                      >
                        Save
                      </Button>
                    </>
                  )}
                </Table.Cell>
                <Table.Cell>
                  {submission?.fileUrl && (
                    <Button
                      primary
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setOpenViewFileModal(true);
                      }}
                    >
                      View Submission
                    </Button>
                  )}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>

      {/* View Submission Modal */}
      <Modal
        open={openViewFileModal}
        onClose={() => setOpenViewFileModal(false)}
        size="large"
      >
        <Modal.Header>{"Submission Viewer"}</Modal.Header>
        <Modal.Content>
          {selectedAssignment && (
            <FileViewer file={selectedAssignment?.submission?.fileUrl} />
          )}
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

export default InstructorStudentGradesList;
