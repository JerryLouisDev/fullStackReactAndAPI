import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import config from "../config";
export default class Courses extends Component {
  state = {
    courses: [],
  };

  componentDidMount() {
    axios
      .get(config.apiBaseUrl+"/courses")
      .then((response) => {
 
        this.setState({
          courses: response.data,
        });
     
      })
      .catch((errors) => {
        console.log(errors);
        this.props.history.push("/error");
      });
  }
  //Render list of courses from API
  render() {
    return (
      <div>
        <div className="wrap main--grid">
          {this.state.courses.map((course) => (
            <Link
              className="course--module course--link"
              key={course.id}
              to={`/courses/${course.id}`}
            >
              <h2 className="course--label"> Course </h2>
              <h3 className="course--title">{course.title} </h3>
            </Link>
          ))}

          <Link
            className="course--module course--add--module"
            to="/courses/create"
          >
            <h3 className="course--add--title">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 13 13"
                className="add"
              >
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg>
              Create Course
            </h3>
          </Link>
        </div>
      </div>
    );
  }
}
