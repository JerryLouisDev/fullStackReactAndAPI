import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import config from "../config";
import ReactMarkdown from "react-markdown";

//exporting CourseDetail class
export default class CourseDetail extends Component {
  state = {
    course: {},
    user: {},
  };
  //Using Axios to get course data and user data
  componentDidMount() {
    axios
      .get(config.apiBaseUrl+`/courses/${this.props.match.params.id}`)
      .then((response) => {
        this.setState({
          course: response.data,
          user: response.data.User,
        });
      })
      .catch((errors) => {
        console.log("Course ID not found", errors);
        this.props.history.push("/notfound");
      });
  }

  // Render the course details and offering either full acces or no access to owners of a course
  render() {
    const { course, user } = this.state;
    const context = this.props.context;
    const authUser = context.authenticatedUser;
    return (
      <React.Fragment>
        <div className="actions--bar">
          <div className="wrap">
            {                  
              authUser ? (
                authUser.id === user.id ? (
                  <React.Fragment>
                    <Link
                      className="button"
                      to={`/courses/${course.id}/update`}
                    >
                      {" "}
                      Update Course{" "}
                    </Link>
                    <Link
                      className="button"
                      to="/"
                      onClick={() => this.deleteCourse()}
                    >
                      {" "}
                      Delete Course{" "}
                    </Link>
                    <Link className="button button-secondary" to="/">
                      {" "}
                      Return to List{" "}
                    </Link>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Link className="button" to="/">
                      {" "}
                      Return to List{" "}
                    </Link>
                  </React.Fragment>
                )
              ) : (
                <React.Fragment>
                  <Link className="button" to="/">
                    {" "}
                    Return to List{" "}
                  </Link>
                </React.Fragment>
              )
            }
          </div>
        </div>
        <div className="wrap">
          <h1> Course Detail </h1>
          <form>
            <div className="main--flex">
              <div>
                <h4 className="course--detail--title">Course</h4>
                <h3 className="course--name">{course.title}</h3>
                <span>
                  {" "}
                  By {user.firstName} {user.lastName}{" "}
                </span>
                <ReactMarkdown children={course.description} />
              </div>
              <div>
                <h3 className="course--detail--title"> Estimated Time </h3>
                {course.estimatedTime === null ||
                course.estimatedTime === "" ? (
                  <p> " " </p>
                ) : (
                  <p> {course.estimatedTime} </p>
                )}
                <h3 className="course--detail--title"> Materials Needed </h3>
                {course.materialsNeeded === null ||
                course.materialsNeeded === "" ? (
                  <p> " " </p>
                ) : (
                  <ReactMarkdown children={course.materialsNeeded} />
                )}
              </div>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
  //if user is authenticated they can delete a course
  deleteCourse = () => {
    const { context } = this.props;
    const authUser = context.authenticatedUser;
    const id = this.props.match.params.id;
    context.data
      .deleteCourse(id, authUser.emailAddress, authUser.password)
      .then((errors) => {
        if (errors.length) {
          this.setState({ errors });
        } else {
          console.log("Yuurrr, the course is deleted.");
          this.props.history.push("/");
          window.location.reload(true); // returns user to Main Course page
        }
      })
      .catch((error) => {
        console.log(error);
        this.props.history.push("/error"); // sends user to Error page
      });
  };
}
