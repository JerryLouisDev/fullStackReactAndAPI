import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default class CourseDetail extends Component {
  state = {
    course: {},
    user: {},
  };
  //Using Axios to get course data and user data
  // Referenced this article for help understanding how to set up fetch request: https://www.smashingmagazine.com/2020/06/rest-api-react-fetch-axios/

  componentDidMount() {
    axios
      .get(`http://localhost:5000/api/courses/${this.props.match.params.id}`)
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

  // Render course details and offers either full access to edit/delete courses or the ability to navigate back to the course list
  render() {
    const { course, user } = this.state;
    //If the user is the owner of the course, allow access
    const context = this.props.context;
    const authUser = context.authenticatedUser;
    return (
      <React.Fragment>
        <div className="actions--bar">
          <div className="wrap">
            {
              //if the user is authorized, display "Update", "Delete", and "Return to List" buttons
              authUser ? (
                authUser.userId === user.id ? (
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
                  // if user is not authorized, display only "Back" button
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
          <h2> Course Detail </h2>
          <form>
            <div className="main--flex">
              <div>
                <h3 className="course--detail--title">Course</h3>
                <h4 className="course--name">{course.title}</h4>
                <p>
                  {" "}
                  By {user.firstName} {user.lastName}{" "}
                </p>
                <ReactMarkdown children={course.description} />
              </div>
              <div>
                <h3 className="course--detail--title"> Estimated Time </h3>
                {course.estimatedTime === null ||
                course.estimatedTime === "" ? (
                  <p> N/A </p>
                ) : (
                  <p> {course.estimatedTime} </p>
                )}
                <h3 className="course--detail--title"> Materials Needed </h3>
                {course.materialsNeeded === null ||
                course.materialsNeeded === "" ? (
                  <p> N/A </p>
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
  //authenticated user can delete a course using deleteCourse
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
          console.log("Hooray! Course deleted.");
          this.props.history.push("/");
          window.location.reload(true); // returns user to Course list page
        }
      })
      .catch((error) => {
        console.log(error);
        this.props.history.push("/error"); // sends user to "Error" page
      });
  };
}
