import React from "react";
import { Container, Header, Button, Grid } from "semantic-ui-react";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  return (
    <Container text style={{ marginTop: "2em" }}>
      <Header as="h2" textAlign="center">
        Welcome to Student Dashboard
      </Header>

      <Grid columns={2} divided textAlign="center" style={{ marginTop: "2em" }}>
        <Grid.Row>
          <Grid.Column>
            <Header as="h3">My Courses</Header>
            <p>View and manage your enrolled courses.</p>
            <Button as={Link} to="/student/courses" primary>
              View My Courses
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Header as="h3">Account</Header>
            <p>
              View and edit your student profile details like name, email, etc.
            </p>
            <Button as={Link} to="/student/profile" primary>
              Edit Account
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default StudentDashboard;
