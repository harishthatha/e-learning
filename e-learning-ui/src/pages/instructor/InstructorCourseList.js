import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Grid, Button, Message, Header } from "semantic-ui-react";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import moment from "moment";

const InstructorCourseList = () => {
  const { instructorId } = useParams();
  const [sections, setSections] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await api.get(`/instructors/${user?.userId}/courses`);
        setSections(response.data);
      } catch (err) {
        setError("Error fetching sections: " + err.message);
      }
    };

    fetchSections();
  }, [instructorId]);

  return (
    <Grid container stackable>
      <Grid.Row>
        <Grid.Column width={16}>
          {error && <Message color="red">{error}</Message>}
          <Header as="h3">Your Sections</Header>
          <Card.Group>
            {sections.map((section) => (
              <Card key={section.sectionId}>
                <Card.Content>
                  <Card.Header>{section.course.title}</Card.Header>
                  <Card.Meta>{section.course.courseCode}</Card.Meta>
                  <Card.Description>
                    <strong>CRN:</strong> {section.sectionCode}
                    <br />
                    <strong>Timings:</strong>{" "}
                    {`${section.day}, ${moment(
                      section.startTime,
                      "HH:mm"
                    ).format("h:mm A")} - ${moment(
                      section.endTime,
                      "HH:mm"
                    ).format("h:mm A")}`}
                    <br />
                    <strong>Credit Hours:</strong> {section.course.creditHours}
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Link to={`/instructor/courses/${section.sectionId}?tab=0`}>
                    <Button color="blue" fluid>
                      Go to Course details
                    </Button>
                  </Link>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default InstructorCourseList;
