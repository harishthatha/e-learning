import React from "react";
import { Grid, Card, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div style={{ padding: "8px" }}>
      <Grid container stackable columns={3}>
        <Grid.Column>
          <Card as={Link} to="/admin/courses">
            <Card.Content>
              <Card.Header>Courses</Card.Header>
              <Card.Description>Manage Courses</Card.Description>
            </Card.Content>
            <Button color="blue" fluid as={Link} to="/admin/courses">
              View Courses
            </Button>
          </Card>
        </Grid.Column>

        <Grid.Column>
          <Card as={Link} to="/admin/students">
            <Card.Content>
              <Card.Header>Students</Card.Header>
              <Card.Description>Manage Students</Card.Description>
            </Card.Content>
            <Button color="blue" fluid as={Link} to="/admin/students">
              View Students
            </Button>
          </Card>
        </Grid.Column>

        <Grid.Column>
          <Card as={Link} to="/admin/instructors">
            <Card.Content>
              <Card.Header>Instructors</Card.Header>
              <Card.Description>Manage Instructors</Card.Description>
            </Card.Content>
            <Button color="blue" fluid as={Link} to="/admin/instructors">
              View Instructors
            </Button>
          </Card>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default AdminDashboard;
