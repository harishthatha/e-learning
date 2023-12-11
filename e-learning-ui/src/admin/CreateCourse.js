import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Dropdown,
  Form,
  Grid,
  Header,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import CustomMessage from "../layout/CustomMessage";

const CreateCourse = () => {
  const [courseDetails, setCourseDetails] = useState({
    title: "",
    courseCode: "", // New field for course code
    creditHours: "",
    description: "",
    department: [],
  });

  const [message, setMessage] = useState({
    content: "",
    type: "",
  });
  const [departmentsList, setDepartmentsList] = useState([]);
  const [openMessage, setOpenMessage] = useState(false);
  const navigate = useNavigate();

  const handleDepartmentChange = (_, { value }) => {
    setCourseDetails({ ...courseDetails, department: value });
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/categories");
      setDepartmentsList(response.data);
    } catch (err) {
      console.log("Error fetching admin courses: " + err.message);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async () => {
    if (
      !courseDetails.title ||
      !courseDetails.courseCode || // New validation for course code
      !courseDetails.creditHours ||
      !courseDetails.department.length
    ) {
      setMessage({ content: "All fields are required!", type: "error" });
      setOpenMessage(true);
      return;
    }

    try {
      await api.post("/courses", {
        ...courseDetails,
        departments: courseDetails.department,
      });
      setMessage({ content: "Course created successfully", type: "success" });
      setOpenMessage(true);
      setTimeout(() => {
        navigate("/admin/courses");
      }, 1000);
    } catch (err) {
      setMessage({ content: err?.response.data, type: "error" });
      setOpenMessage(true);
      setTimeout(() => {
        setOpenMessage(false);
      }, 1000);
      console.error(err);
      return "fail";
    }
  };

  return (
    <Container>
      {openMessage && (
        <CustomMessage type={message.type} content={message.content} />
      )}
      <Grid centered columns={2}>
        <Grid.Column>
          <Header as="h2">Create New Course</Header>
          <Form>
            <Form.Field>
              <label>Course Title</label>
              <Form.Input
                fluid
                placeholder="Course Title"
                value={courseDetails.title}
                onChange={(e) =>
                  setCourseDetails({
                    ...courseDetails,
                    title: e.target.value,
                  })
                }
              />
            </Form.Field>
            <Form.Field>
              <label>Course Code</label>
              <Form.Input
                fluid
                placeholder="Course Code"
                value={courseDetails.courseCode}
                onChange={(e) =>
                  setCourseDetails({
                    ...courseDetails,
                    courseCode: e.target.value,
                  })
                }
              />
            </Form.Field>
            <Form.Field>
              <label>Credit Hours</label>
              <Form.Input
                fluid
                placeholder="Credit Hours"
                type="number"
                value={courseDetails.creditHours}
                onChange={(e) =>
                  setCourseDetails({
                    ...courseDetails,
                    creditHours: e.target.value,
                  })
                }
              />
            </Form.Field>
            <Form.Field>
              <label>Description</label>
              <Form.Input
                fluid
                placeholder="Description"
                value={courseDetails.description}
                onChange={(e) =>
                  setCourseDetails({
                    ...courseDetails,
                    description: e.target.value,
                  })
                }
              />
            </Form.Field>
            <Form.Field>
              <label>Department</label>
              <Dropdown
                fluid
                multiple
                selection
                options={departmentsList.map((department) => ({
                  key: department.categoryId,
                  text: department.name,
                  value: department.categoryId,
                }))}
                value={courseDetails.department}
                onChange={handleDepartmentChange}
              />
            </Form.Field>
            <Button content="Create Course" primary onClick={handleSubmit} />
          </Form>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default CreateCourse;
