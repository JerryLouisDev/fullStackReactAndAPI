import config from "./config";

export default class Data {
  api(
    path,
    method = "GET",
    body = null,
    requiresAuth = false,
    credentials = null
  ) {
    const url = config.apiBaseUrl + path;

    const options = {
      method,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    if (requiresAuth) {
      const encodedCredentials = btoa(
        `${credentials.emailAddress}:${credentials.password}`
      );
      options.headers["Authorization"] = `Basic ${encodedCredentials}`;
    }
    return fetch(url, options);
  }
  /**
   * USER FUNCTIONS
   */

  //getUser function
  async getUser(emailAddress, password) {
    const response = await this.api("/users", "GET", null, true, {
      emailAddress,
      password,
    });

    // if the status response code indicates that the request is successful the data is returned
    if (response.status === 200) {
      return response.json().then((data) => data);
    }
    // if the status response code indicates that the request lacks valid authentication credentials, null is returned
    else if (response.status === 401) {
      return null;
    } else {
      throw new Error();
    }
  }
  //createUser function
  async createUser(user) {
    const response = await this.api("/users", "POST", user);
    //tests if response code indicates that the request has successed and created a new user
    if (response.status === 201) {
      return [];
    }
    // tests if responde code indicates that the server cannot process the request and returns an error
    else if (response.status === 400) {
      return response.json().then((data) => {
        return data.errors;
      });
    } else {
      throw new Error();
    }
  }

  /**
   * COURSE FUNCTIONS
   */

  //createCourse function
  async createCourse(course, emailAddress, password) {
    const response = await this.api("/courses", "POST", course, true, {
      emailAddress,
      password,
    });
    //tests if response code indicates that the request has successed and created a new user
    if (response.status === 201) {
      return [];
    }
    // tests if responde code indicates that the server cannot process the request and returns an error
    else if (response.status === 400) {
      return response.json().then((data) => {
        return data.errors;
      });
    } else {
      throw new Error();
    }
  }
  //getCourse funciton
  async getCourse(id) {
    const response = await this.api(`/courses/${id}`, "GET", null);
    // console.log(id);
    // if the status response code indicates that the request is successful the data is returned
    if (response.status === 200) {
      return response.json().then((data) => data);
      // if the status response code indicates that the request lacks valid authentication credentials, null is returned
    } else if (response.status === 404) {
      throw new Error("Course Not Found.");
    } else {
      throw new Error();
    }
  }

  //updateCourse function
  async updateCourse(id, course, emailAddress, password) {
    const response = await this.api(`/courses/${id}`, "PUT", course, true, {
      emailAddress,
      password,
    });
    //tests if the server has fulfilled the request and if there is a No Content response indicating that the page does not need to be replaced
    if (response.status === 204) {
      return [];
    }
    // tests if responde code indicates that the server cannot process the request and returns an error
    else if (response.status === 400) {
      return response.json().then((data) => {
        return data;
      });
    } else {
      throw new Error();
    }
  }

  //deleteCourse function
  async deleteCourse(id, emailAddress, password) {
    const response = await this.api(`/courses/${id}`, "DELETE", null, true, {
      emailAddress,
      password,
    });
    //tests if the server has fulfilled the request and if there is a No Content response indicating that the page does not need to be replaced
    if (response.status === 204) {
      return [];
    }
    // tests if responde code indicates that the server cannot process the request and returns an error
    else if (response.status === 400) {
      return response.json().then((data) => {
        return data.errors;
      });
    } else {
      throw new Error();
    }
  }
}
