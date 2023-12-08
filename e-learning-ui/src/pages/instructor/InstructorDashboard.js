import React from "react";
import { Grid, Segment, Header, Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

const InstructorDashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Grid container stackable centered>
      <Grid.Row columns={2} centered>
        <Grid.Column textAlign="center">
          <Segment
            color="grey"
            inverted
            onClick={() => handleNavigation("/instructor/courses")}
            className="dashboard-segment"
          >
            <Header as="h2" inverted>
              Courses
            </Header>
            <p inverted>View and manage your courses</p>
            <Button
              inverted
              color="white"
              onClick={() => handleNavigation("/instructor/courses")}
            >
              View Courses
            </Button>
          </Segment>
        </Grid.Column>

        <Grid.Column textAlign="center">
          <Segment
            color="grey"
            inverted
            onClick={() => handleNavigation("/instructor/profile")}
            className="dashboard-segment"
          >
            <Header as="h2" inverted>
              Profile
            </Header>
            <p inverted>Manage your instructor profile</p>
            <Button
              inverted
              color="white"
              onClick={() => handleNavigation("/instructor/profile")}
            >
              View Profile
            </Button>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default InstructorDashboard;
