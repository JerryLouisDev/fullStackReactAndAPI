import React, { Component } from "react";
import Form from "./Form";

//using a class component to export class
export default class UpdateCourse extends Component {
  state = {
    title: "",
    description: "",
    estimatedTime: "",
    materialsNeeded: "",
    errors: [],
    user: {},
    id: "",
  };

  async componentDidMount() {
    const context = this.props.context;
    const authUser = context.authenticatedUser;
    const id = this.props.match.params.id;

    context.data
      .getCourse(id)
      .then((course) => {
     
        this.setState({
          title: course.title,
          description: course.description,
          materialsNeeded: course.materialsNeeded,
          estimatedTime: course.estimatedTime,
          user: course.User,
        });
   
        if (authUser.id !== this.state.user.id) {
          this.props.history.push("/forbidden");
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.message === "Course Not Found.") {
          this.props.history.push("/notfound");
        } else {
          this.props.history.push("/error");
          console.log(`Error: unable to retrieve course.`);
        }
      });

    if (this.state.user === null) {
      this.props.history.push("/signin");
    }
  }
// returning the format of the update course page
  render() {
    const { title, description, estimatedTime, materialsNeeded, user, errors } =
      this.state;

    return (
      <div className="wrap">
        <h2>Update Course</h2>
        <Form
          cancel={this.cancel}
          errors={errors}
          submit={this.submit}
          submitButtonText="Update Course"
          elements={() => (
            <React.Fragment>
              <div className="main--flex">
                <div>
                  <label>
                    {" "}
                    Course Title
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={title}
                      onChange={this.change}
                      placeholder="Title"
                    />
                  </label>
                  <p>
                    {" "}
                    By {user.firstName} {user.lastName}{" "}
                  </p>
                  <label>
                    {" "}
                    Description
                    <textarea
                      id="description"
                      name="description"
                      type="text"
                      value={description}
                      onChange={this.change}
                      placeholder="Description"
                    />
                  </label>
                </div>
                <div>
                  <label>
                    {" "}
                    Estimated Time
                    <input
                      id="estimatedTime"
                      name="estimatedTime"
                      type="text"
                      value={estimatedTime ? estimatedTime : ""}
                      onChange={this.change}
                      placeholder="Estimated Time"
                    />
                  </label>
                  <label>
                    {" "}
                    Materials Needed
                    <textarea
                      id="materialsNeeded"
                      name="materialsNeeded"
                      type="text"
                      value={materialsNeeded ? materialsNeeded : ""}
                      onChange={this.change}
                      placeholder="Materials Needed"
                    />
                  </label>
                </div>
              </div>
            </React.Fragment>
          )}
        />
      </div>
    );
  }
// setting new values
  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value,
      };
    });
  };
//submitting new changes
  submit = () => {
    const { context } = this.props;
    const authUser = context.authenticatedUser;
    const userId = authUser.id;
    const { title, description, estimatedTime, materialsNeeded } = this.state;
    const id = this.props.match.params.id;
    const course = {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      userId,
    };

    context.data
      .updateCourse(id, course, authUser.emailAddress, authUser.password)
      .then((errors) => {
        // console.log(id);
        if (errors.length) {
          this.setState({ errors });
        } else {
          const id = this.props.match.params.id;
          this.props.history.push(`/courses/${id}`);
          console.log("Yurrrr, the course has been updated!");
        }
      })
      .catch((error) => {
        console.error(error);
        this.props.history.push("/error");
      });
  };
// if user changes mind they can cancel and old information will stay
  cancel = () => {
    const id = this.props.match.params.id;
    this.props.history.push(`/courses/${id}`);
  };
}
