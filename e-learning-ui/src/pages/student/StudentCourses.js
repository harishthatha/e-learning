import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Grid, Header } from "semantic-ui-react";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";

const StudentCourses = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);

  const fetchInstructors = async () => {
    try {
      const response = await api.get("/instructors");
      setInstructors(response.data);
    } catch (err) {
      console.log("Error fetching instructors: " + err.message);
    }
  };

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await api.get(
          `/students/${user?.userId}/enrolled-courses`
        );
        setEnrolledCourses(response.data);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      }
    };

    fetchEnrolledCourses();
    fetchInstructors();
  }, [user?.userId]);

  const handleEnrollCourses = () => {
    navigate(`/student/${user?.userId}/courses/enroll`);
  };

  return (
    <Container style={{ marginTop: "20px" }}>
      <Header as="h2">Enrolled Courses</Header>
      <Grid columns={3}>
        {enrolledCourses.map((course) => {
          const instructor = instructors?.find(
            (instructor) => instructor.instructorId === course.instructorId
          );
          const cardStyle = {
            borderRadius: 8,
          };

          return (
            <Grid.Column key={course.sectionId}>
              <Card fluid style={cardStyle}>
                <Card.Content>
                  <Card.Header>{course.course.title}</Card.Header>
                  <Card.Meta>CRN: {course.sectionCode}</Card.Meta>
                  <Card.Meta>
                    Room No. {course.classroomNumber || "N/A"}
                  </Card.Meta>
                  <Card.Description>
                    <strong>Instructor:</strong>{" "}
                    {instructor?.firstName + " " + instructor?.lastName}
                    <br />
                    <strong>Timings:</strong>{" "}
                    {course.day &&
                      `${course.day}, ${moment(
                        course.startTime,
                        "HH:mm"
                      ).format("h:mm A")} - ${moment(
                        course.endTime,
                        "HH:mm"
                      ).format("h:mm A")}`}
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button
                    onClick={() => {
                      navigate(`/student/courses/${course.sectionId}/details`);
                    }}
                    color="blue"
                    fluid
                  >
                    View
                  </Button>
                </Card.Content>
              </Card>
            </Grid.Column>
          );
        })}
      </Grid>
    </Container>
  );
};

export default StudentCourses;
