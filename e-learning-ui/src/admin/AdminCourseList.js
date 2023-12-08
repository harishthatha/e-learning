import React, { useEffect, useState } from "react";
import { Button, Table, Container } from "semantic-ui-react";
import { Link } from "react-router-dom";
import api from "../api/api";
import CustomMessage from "../layout/CustomMessage";

const AdminCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({
    content: "",
    type: "",
  });

  const [openMessage, setOpenMessage] = useState(false);
  const [departmentsList, setDepartmentsList] = useState([]);

  const handleDelete = async (courseId) => {
    try {
      await api.delete(`/courses/${courseId}`);
      fetchAdminCourses(); // Refresh the course list after deletion
      setMessage({
        content: "Course deleted successfully",
        type: "success",
      });
      setOpenMessage(true);
      setTimeout(() => {
        setOpenMessage(false);
      }, 1000);
    } catch (err) {
      setMessage({
        content: "Error deleting course: " + err.message,
        type: "error",
      });
      setOpenMessage(true);
    }
  };

  const fetchAdminCourses = async () => {
    try {
      const response = await api.get("/courses");
      setCourses(response.data);
    } catch (err) {
      setError("Error fetching admin courses: " + err.message);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/categories");
      setDepartmentsList(response.data);
    } catch (err) {
      setError("Error fetching admin courses: " + err.message);
    }
  };

  useEffect(() => {
    fetchAdminCourses();
    fetchDepartments();
  }, []);

  return (
    <Container style={{ padding: "20px" }}>
      {openMessage && (
        <CustomMessage type={message.type} content={message.content} />
      )}
      <Link
        to="/admin/courses/create-course"
        style={{ textDecoration: "none", float: "right", marginBottom: 12 }}
      >
        <Button primary>Create Course</Button>
      </Link>
      <Table style={{ border: "0", borderCollapse: "collapse" }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Course Code</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Credit hours</Table.HeaderCell>
            <Table.HeaderCell>Department</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {courses.map((course) => {
            let depName = "";
            course.departments?.forEach((dep) => {
              const depDet = departmentsList.find(
                ({ categoryId }) => categoryId === dep
              )?.name;
              depName = depName ? depName + "," + depDet : depDet;
            });
            return (
              <Table.Row key={course.courseId}>
                <Table.Cell>{course.title}</Table.Cell>
                <Table.Cell>{course.courseCode}</Table.Cell>
                <Table.Cell>{course.description}</Table.Cell>
                <Table.Cell>{course.creditHours}</Table.Cell>
                <Table.Cell>{depName}</Table.Cell>
                <Table.Cell>
                  <Link
                    to={`/admin/courses/${course.courseId}/details`}
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <Button primary>View</Button>
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link
                    to={`/admin/courses/${course.courseId}/update-course`}
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <Button primary>Edit</Button>
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    secondary
                    onClick={() => handleDelete(course.courseId)}
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

export default AdminCourseList;
