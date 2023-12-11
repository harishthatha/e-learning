import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Container, Header, Message, Table } from "semantic-ui-react";
import api from "../api/api";
import CustomMessage from "../layout/CustomMessage";
import CourseTable from "./CourseTable";

const CourseEnrollmentList = () => {
  const { studentId } = useParams();
  const [courses, setCourses] = useState([]);
  const [addedCourses, setAddedCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({
    content: "",
    type: "",
  });
  const [openMessage, setOpenMessage] = useState(false);

  const fetchData = async () => {
    try {
      const [coursesResponse, prevCourses] = await Promise.all([
        api.get("/sections"),
        api.get(`/students/${studentId}/enrolled-courses`),
      ]);

      setCourses(coursesResponse.data);

      const existingCourses = coursesResponse.data?.filter((course) =>
        prevCourses.data.some(
          (prevCourse) => prevCourse.sectionId === course.sectionId
        )
      );

      setAddedCourses(existingCourses);
    } catch (err) {
      setError("Error fetching courses: " + err.message);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await api.get("/instructors");
      setInstructors(response.data);
    } catch (err) {
      setError("Error fetching instructors: " + err.message);
    }
  };

  useEffect(() => {
    fetchData();
    fetchInstructors();
  }, []);

  // const handleAddCourse = (course) => {
  //   if (
  //     addedCourses.length < 3 &&
  // /     !addedCourses.find(
  //       (addedCourse) =>
  //         addedCourse.sectionId === course.sectionId ||
  //         addedCourse?.course?.courseCode === course?.course?.courseCode
  //     )
  //   ) {
  //     setAddedCourses([...addedCourses, course]);
  //   }
  // };

  const handleAddCourse = (course) => {
    // Check if the same course is already added
    const isCourseAdded = addedCourses.some(
      (addedCourse) =>
        addedCourse.sectionId === course.sectionId ||
        addedCourse?.course?.courseCode === course?.course?.courseCode
    );

    // Check if there is a course with the same day and time
    const hasConflict = addedCourses.some((addedCourse) => {
      return (
        addedCourse.day === course.day &&
        moment(course.startTime, "HH:mm").isBefore(
          moment(addedCourse.endTime, "HH:mm")
        ) &&
        moment(course.endTime, "HH:mm").isAfter(
          moment(addedCourse.startTime, "HH:mm")
        )
      );
    });

    if (addedCourses.length < 3 && !isCourseAdded && !hasConflict) {
      setAddedCourses([...addedCourses, course]);
    } else {
      // Display appropriate error message
      if (isCourseAdded) {
        setMessage({
          content: "Course is already added.",
          type: "error",
        });
      } else if (hasConflict) {
        setMessage({
          content: "There is a time conflict with the selected course.",
          type: "error",
        });
      } else {
        setMessage({
          content: "You can add up to 3 courses.",
          type: "error",
        });
      }

      setOpenMessage(true);
      setTimeout(() => {
        setMessage({
          content: "",
          type: "",
        });
        setOpenMessage(false);
      }, 1500);
    }
  };

  const handleRemoveCourse = (course) => {
    const updatedCourses = addedCourses.filter(
      (addedCourse) => addedCourse.sectionId !== course.sectionId
    );
    setAddedCourses(updatedCourses);
  };

  const handleEnroll = async () => {
    const sectionIds = addedCourses.map(({ sectionId }) => sectionId);
    try {
      await api.post(`/students/${studentId}/enrolled-courses`, sectionIds);
      setMessage({ content: "Courses Enrolled successfully", type: "success" });
      setOpenMessage(true);
      setTimeout(() => {
        fetchData();
        fetchInstructors();
        setMessage({ content: "", type: "success" });
        setOpenMessage(false);
      }, 1000);
    } catch (err) {
      setMessage({ content: err?.response.data, type: "error" });
      setOpenMessage(true);
      return "fail";
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredCourses = courses.filter((course) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      course.course.title.toLowerCase().includes(searchTerm) ||
      course.course.courseCode.toString().includes(searchTerm) ||
      course.sectionCode.toString().includes(searchTerm) ||
      (
        instructors.find(
          (instructor) => instructor.instructorId === course.instructorId
        )?.name || ""
      )
        .toLowerCase()
        .includes(searchTerm)
    );
  });

  return (
    <Container style={{ marginTop: "20px" }}>
      {error && <Message negative>{error}</Message>}
      {openMessage && (
        <CustomMessage type={message.type} content={message.content} />
      )}
      <CourseTable
        sections={filteredCourses}
        onAddCourse={handleAddCourse}
        addedCourses={addedCourses}
        onEnroll={handleEnroll}
        instructors={instructors}
        searchQuery={searchQuery}
        handleSearch={(value) => handleSearch(value)}
      />
      <br />
      <div>
        <Header as="h3">Added Courses</Header>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Course Code</Table.HeaderCell>
              <Table.HeaderCell>CRN</Table.HeaderCell>
              <Table.HeaderCell>Instructor</Table.HeaderCell>
              <Table.HeaderCell>Timings</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {addedCourses.map((course) => {
              const instructor = instructors?.find(
                (instructor) => instructor.instructorId === course.instructorId
              );
              return (
                <Table.Row key={course.sectionId}>
                  <Table.Cell>{course.course.title}</Table.Cell>
                  <Table.Cell>{course.course.courseCode}</Table.Cell>
                  <Table.Cell>{course.sectionCode}</Table.Cell>
                  <Table.Cell>
                    {instructor?.firstName + " " + instructor?.lastName}
                  </Table.Cell>
                  <Table.Cell>
                    {`${course.day}, ${
                      course.startTime
                        ? moment(course.startTime, "HH:mm").format("h:mm A")
                        : "N/A"
                    } - 
                    ${
                      course.endTime
                        ? moment(course.endTime, "HH:mm").format("h:mm A")
                        : "N/A"
                    }`}
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      onClick={() => handleRemoveCourse(course)}
                      color="red"
                      size="mini"
                      icon="remove"
                    />
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}
      >
        <Button
          color="blue"
          onClick={handleEnroll}
          style={{ width: "14%" }}
          disabled={addedCourses.length === 0}
        >
          Enroll Courses
        </Button>
      </div>
    </Container>
  );
};

export default CourseEnrollmentList;
