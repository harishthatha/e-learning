import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, Header, Card, Grid, Button } from "semantic-ui-react";
import moment from "moment";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";

const StudentCourseDetails = () => {
  const { courseId: sectionId } = useParams();
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
    <Container
      text
      style={{
        marginTop: "2em",
        textAlign: "center",
        backgroundColor: "lightblue",
      }}
    >
      {section ? (
        <Card
          fluid
          raised
          style={{ backgroundColor: "rgb(217, 229, 242)", padding: 30 }}
        >
          <Card.Content>
            <Header as="h2">{section.course.title}</Header>
            <Grid columns={2} divided>
              <Grid.Row>
                <Grid.Column>
                  <p>
                    <strong>Course Code:</strong> {section.course.courseCode}
                  </p>
                  <p>
                    <strong>CRN:</strong> {section.sectionCode}
                  </p>
                  <p>
                    <strong>Timings:</strong>{" "}
                    {`${section.day}, ${moment(
                      section.startTime,
                      "HH:mm"
                    ).format("h:mm A")} - ${moment(
                      section.endTime,
                      "HH:mm"
                    ).format("h:mm A")}`}
                  </p>
                </Grid.Column>
                <Grid.Column>
                  <p>
                    <strong>Credit Hours:</strong> {section.course.creditHours}
                  </p>
                  <p>
                    <strong>Total Seats:</strong> {section.totalSeats}
                  </p>
                  <p>
                    <strong>Available Seats:</strong> {section.availableSeats}
                  </p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Header as="h3" style={{ marginTop: "1.5em" }}>
              Actions
            </Header>
            <Button.Group>
              <Link to={`/student/courses/${sectionId}/assignments`}>
                <Button
                  primary
                  icon="clipboard outline"
                  content="Assignments"
                />
              </Link>
              <Link
                style={{ marginLeft: 16 }}
                to={`/student/courses/${sectionId}/grades`}
              >
                <Button primary icon="users" content="Go to Grades" />
              </Link>
            </Button.Group>
          </Card.Content>
        </Card>
      ) : (
        <Container>{error || "Loading..."}</Container>
      )}
    </Container>
  );
};

export default StudentCourseDetails;
