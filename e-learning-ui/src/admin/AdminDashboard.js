import React from "react";
import { Grid, Card, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div style={{ padding: "16px", marginTop: 20 }}>
      <Grid container stackable columns={4}>
        <Grid.Column>
          <Card
            as={Link}
            to="/admin/courses"
            style={{
              backgroundColor: "rgb(223, 159, 191)",
              color: "white",
              padding: 16,
            }}
          >
            <Card.Content>
              <Card.Header
                style={{
                  color: "white",
                }}
              >
                Courses
              </Card.Header>
              <Card.Description>Manage Courses</Card.Description>
            </Card.Content>
            <Button
              style={{
                backgroundColor: "rgb(223, 159, 191)",
                color: "white",
                textAlign: "left",
              }}
              fluid
              as={Link}
              to="/admin/courses"
            >
              <b>View Courses</b>
            </Button>
          </Card>
        </Grid.Column>

        <Grid.Column>
          <Card
            as={Link}
            to="/admin/students"
            style={{
              backgroundColor: "rgb(255, 128, 128)",
              color: "white",
              padding: 16,
            }}
          >
            <Card.Content>
              <Card.Header
                style={{
                  color: "white",
                }}
              >
                Students
              </Card.Header>
              <Card.Description>Manage Students</Card.Description>
            </Card.Content>

            <Button
              style={{
                backgroundColor: "rgb(255, 128, 128)",
                color: "white",
                textAlign: "left",
              }}
              fluid
              as={Link}
              to="/admin/students"
            >
              View Students
            </Button>
          </Card>
        </Grid.Column>

        <Grid.Column>
          <Card
            as={Link}
            to="/admin/instructors"
            style={{
              backgroundColor: "rgb(0, 179, 179)",
              color: "white",
              padding: 16,
            }}
          >
            <Card.Content>
              <Card.Header
                style={{
                  color: "white",
                }}
              >
                Instructors
              </Card.Header>
              <Card.Description>Manage Instructors</Card.Description>
            </Card.Content>
            <Button
              style={{
                backgroundColor: "rgb(0, 179, 179)",
                color: "white",
                textAlign: "left",
              }}
              fluid
              as={Link}
              to="/admin/instructors"
            >
              View Instructors
            </Button>
          </Card>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default AdminDashboard;
