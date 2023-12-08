import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, Header, Segment } from "semantic-ui-react";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";

const InstructorCourseDetails = () => {
  const { sectionId } = useParams();
  const { user } = useAuth();
  const [section, setSection] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSectionDetails = async () => {
      try {
        const response = await api.get(`/sections/${sectionId}`);
        setSection(response.data);
      } catch (err) {
        setError("Error fetching section details: " + err.message);
      }
    };

    fetchSectionDetails();
  }, [sectionId, user]);

  return (
    <Container textAlign="center" style={{ marginTop: "20px" }}>
      {section ? (
        <Segment.Group>
          <Segment>
            <Header as="h3">{section.course.title}</Header>
            <p>
              <strong>Course Code:</strong> {section.course.courseCode}
            </p>
            <p>
              <strong>CRN:</strong> {section.sectionCode}
            </p>
            <p>
              <strong>Timings:</strong>{" "}
              {`${section.day}, ${moment(section.startTime, "HH:mm").format(
                "h:mm A"
              )} - ${moment(section.endTime, "HH:mm").format("h:mm A")}`}
            </p>
            <p>
              <strong>Credit Hours:</strong> {section.course.creditHours}
            </p>
            <p>
              <strong>Total Seats:</strong> {section.totalSeats}
            </p>
            <p>
              <strong>Available Seats:</strong> {section.availableSeats}
            </p>
          </Segment>
          <Segment>
            <Header as="h3">Actions</Header>
            <p>
              <Link
                style={{ marginRight: 10, fontSize: 20 }}
                to={`/instructor/courses/${sectionId}/assignments`}
              >
                <b> Assignments</b>
              </Link>{" "}
              |{" "}
              <Link
                style={{ marginLeft: 10, fontSize: 20 }}
                to={`/instructor/courses/${sectionId}/students`}
              >
                <b>Go to Students</b>
              </Link>
            </p>
          </Segment>
        </Segment.Group>
      ) : (
        <Container>{error || "Loading..."}</Container>
      )}
    </Container>
  );
};

export default InstructorCourseDetails;
