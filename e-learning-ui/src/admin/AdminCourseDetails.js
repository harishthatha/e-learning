import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Table, Container, Button, Header, Message } from "semantic-ui-react";
import api from "../api/api";
import moment from "moment";

const AdminCourseDetails = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState({});
  const [sections, setSections] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [error, setError] = useState(null);
  const [openMessage, setOpenMessage] = useState(false);
  const [message, setMessage] = useState({
    content: "",
    type: "",
  });

  const fetchInstructors = async () => {
    try {
      const response = await api.get("/instructors"); // Replace with your API endpoint
      setInstructors(response.data);
    } catch (err) {
      setError("Error fetching admin courses: " + err.message);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseResponse = await api.get(`/courses/${courseId}`);
        setCourse(courseResponse.data);
        setSections(courseResponse.data?.sections);
      } catch (error) {
        console.error("Error fetching course details:", error.message);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleDeleteSection = async (sectionId) => {
    try {
      await api.delete(`/sections/${sectionId}`);
      setMessage({
        content: "Section deleted successfully",
        type: "success",
      });
      setOpenMessage(true);
      fetchCourseDetails(); // Refresh the section list after deletion
    } catch (err) {
      setMessage({
        content: "Error deleting section: " + err.message,
        type: "error",
      });
      setOpenMessage(true);
    }
  };

  const fetchCourseDetails = async () => {
    try {
      const courseResponse = await api.get(`/courses/${courseId}`);
      setSections(courseResponse.data?.sections);
    } catch (error) {
      console.error("Error fetching course details:", error.message);
    }
  };

  return (
    <Container style={{ marginTop: "20px" }}>
      {openMessage && (
        <Message
          positive={message.type === "success"}
          negative={message.type === "error"}
          onDismiss={() => setOpenMessage(false)}
        >
          <Message.Header>
            {message.type === "success" ? "Success" : "Error"}
          </Message.Header>
          <p>{message.content}</p>
        </Message>
      )}

      <Header as="h2">
        <b>Course Name: </b>
        {course.courseCode} - {course.title}
      </Header>

      <Link
        to={`/admin/courses/${courseId}/sections/create-section`}
        style={{ textDecoration: "none", marginBottom: "20px" }}
      >
        <Button primary>Create Section</Button>
      </Link>

      <Header as="h3">Sections:</Header>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>CRN</Table.HeaderCell>
            <Table.HeaderCell>Instructor</Table.HeaderCell>
            <Table.HeaderCell>Day</Table.HeaderCell>
            <Table.HeaderCell>Start Time</Table.HeaderCell>
            <Table.HeaderCell>End Time</Table.HeaderCell>
            <Table.HeaderCell>Total Seats</Table.HeaderCell>
            <Table.HeaderCell>Available Seats</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sections &&
            sections.map((section) => {
              const instructor = instructors?.find(
                (instructor) => instructor.instructorId === section.instructorId
              );
              return (
                <Table.Row key={section.sectionId}>
                  <Table.Cell>{section.sectionCode || "-"}</Table.Cell>
                  <Table.Cell>
                    {instructor?.firstName + " " + instructor.lastName}
                  </Table.Cell>
                  <Table.Cell>{section.day}</Table.Cell>
                  <Table.Cell>
                    {section.startTime
                      ? moment(section.startTime, "HH:mm").format("h:mm A")
                      : "N/A"}
                  </Table.Cell>
                  <Table.Cell>
                    {section.endTime
                      ? moment(section.endTime, "HH:mm").format("h:mm A")
                      : "N/A"}
                  </Table.Cell>
                  <Table.Cell>{section.totalSeats || "-"}</Table.Cell>
                  <Table.Cell>{section.availableSeats || "-"}</Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/admin/courses/${courseId}/sections/${section.sectionId}/update-section`}
                      style={{ textDecoration: "none" }}
                    >
                      <Button primary>Edit</Button>
                    </Link>
                    <Button
                      secondary
                      onClick={() => handleDeleteSection(section.sectionId)}
                    >
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table>
    </Container>
  );
};

export default AdminCourseDetails;
