const URL = "https://jabsvip.dk/Skelet";
//const URL = "http://localhost:8080/exam";
function handleHttpErrors(res) {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: res.json() });
  }
  return res.json();
}

class ApiFacade {
  //Insert utility-methods from a latter step (d) here
  makeOptions(method, addToken, body) {
    var opts = {
      method: method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json"
      }
    };
    if (addToken && this.loggedIn()) {
      opts.headers["x-access-token"] = this.getToken();
    }
    if (body) {
      opts.body = JSON.stringify(body);
    }
    return opts;
  }

  setToken = token => {
    localStorage.setItem("jwtToken", token);
  };
  getToken = () => {
    return localStorage.getItem("jwtToken");
  };
  loggedIn = () => {
    const loggedIn = this.getToken() != null;
    return loggedIn;
  };
  logout = () => {
    localStorage.removeItem("jwtToken");
  };
  login = (user, pass) => {
    const options = this.makeOptions("POST", true, {
      username: user,
      password: pass
    });
    return fetch(URL + "/api/login", options)
      .then(handleHttpErrors)
      .then(res => {
        this.setToken(res.token);
      });
  };
  fetchData = () => {
    const options = this.makeOptions("GET", true); //True add's the token
    return fetch(URL + "/api/info/user", options).then(handleHttpErrors);
  };

  fetchMovies = title => {
    const options = this.makeOptions("GET", false);
    return fetch(URL + "/api/info/movie-info-simple/" + title, options).then(
      handleHttpErrors
    );
  };

  fetchMoviesAll = title => {
    const options = this.makeOptions("GET", true);
    return fetch(URL + "/api/info/movie-info-all/" + title, options).then(
      handleHttpErrors
    );
  };

  fetchMoviesAmount = title => {
    const options = this.makeOptions("GET", true);
    return fetch(URL + "/api/info/movie-count/" + title, options).then(
      handleHttpErrors
    );
  };
}
const facade = new ApiFacade();
export default facade;
