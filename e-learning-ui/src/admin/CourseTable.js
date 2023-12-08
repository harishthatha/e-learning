import moment from "moment";
import React from "react";
import { Button, Grid, Header, Input, Table } from "semantic-ui-react";

const CourseTable = ({
  sections,
  onAddCourse,
  addedCourses,
  instructors,
  handleSearch,
  searchQuery,
}) => {
  return (
    <Grid container stackable>
      <Grid.Row>
        <Grid.Column width={8}>
          <Header as="h4" textAlign="left">
            Available Courses
          </Header>
        </Grid.Column>
        <Grid.Column width={8} textAlign="right">
          <Input
            type="text"
            placeholder="Search by title, course code, CRN, or instructor name"
            icon="search"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <div
            style={{
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            <Table striped>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell style={{ position: "sticky", top: 0 }}>
                    Title
                  </Table.HeaderCell>
                  <Table.HeaderCell style={{ position: "sticky", top: 0 }}>
                    Course Id
                  </Table.HeaderCell>
                  <Table.HeaderCell style={{ position: "sticky", top: 0 }}>
                    CRN
                  </Table.HeaderCell>
                  <Table.HeaderCell style={{ position: "sticky", top: 0 }}>
                    Instructor
                  </Table.HeaderCell>
                  <Table.HeaderCell style={{ position: "sticky", top: 0 }}>
                    Timings
                  </Table.HeaderCell>
                  <Table.HeaderCell style={{ position: "sticky", top: 0 }}>
                    Credit Hours
                  </Table.HeaderCell>
                  <Table.HeaderCell style={{ position: "sticky", top: 0 }}>
                    Action
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sections.map((section) => {
                  const instructor = instructors?.find(
                    (instructor) =>
                      instructor.instructorId === section.instructorId
                  );

                  const isAdded = addedCourses.find(
                    (course) => course.sectionId === section.sectionId
                  );

                  return (
                    <Table.Row key={section.sectionId}>
                      <Table.Cell>{section.course?.title}</Table.Cell>
                      <Table.Cell>{section.course?.courseCode}</Table.Cell>
                      <Table.Cell>{section.sectionCode}</Table.Cell>
                      <Table.Cell>
                        {instructor?.firstName + " " + instructor?.lastName}
                      </Table.Cell>
                      <Table.Cell>
                        {`${section.day}, ${
                          section.startTime
                            ? moment(section.startTime, "HH:mm").format(
                                "h:mm A"
                              )
                            : "N/A"
                        } - 
                        ${
                          section.endTime
                            ? moment(section.endTime, "HH:mm").format("h:mm A")
                            : "N/A"
                        }`}
                      </Table.Cell>
                      <Table.Cell>{section.course?.creditHours}</Table.Cell>
                      <Table.Cell>
                        {isAdded ? (
                          <Button color="green" disabled>
                            Added
                          </Button>
                        ) : (
                          <Button
                            onClick={() => onAddCourse(section)}
                            color="blue"
                          >
                            Add
                          </Button>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default CourseTable;
