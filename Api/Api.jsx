import axios from "axios";
import swal from "sweetalert";

let BaseURL = "https://artdevotee.com/artservices/";
const token = () => {
  let token=null;
  if (typeof window !== 'undefined') {
  let token = "bearer " + JSON.parse(localStorage.getItem("access_tocken"));
  }
  return token;
};

let headers={};
if (typeof window !== 'undefined') {
headers = {
  authorization: "bearer " + JSON.parse(localStorage.getItem("access_tocken")),
};
}

export const Bucket = process.env.REACT_APP_BUCKET;
export const getFileImage = (file) => {
  let ext = file?.split(".").pop();
  let filePrev = "";
  let img = [
    "apng",
    "avif",
    "gif",
    "jpg",
    "jpeg",
    "jfif",
    "pjpeg",
    "pjp",
    "png",
    "svg",
    "webp",
    "bmp",
    "ico",
    "cur",
    "tif",
    "tiff",
  ];
  if (img?.includes(ext?.toLowerCase())) {
    filePrev = BaseURL + file;
  }
  return filePrev;
};
export const ApiGetNoAuth = (type) => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
    axios
      .get(BaseURL + "api/" + type)
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        if (
          error?.hasOwnProperty("response") &&
          error?.response?.hasOwnProperty("data") &&
          error?.response?.data?.hasOwnProperty("error") &&
          error?.response?.data?.error
        ) {
          reject(error?.response?.data);
        } else {
          reject(error?.response);
        }
      });
    }
  });
};

export const ApiPostNoAuth = (type, userData) => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
    axios
      .post(BaseURL + "api/" + type, userData)
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        if (
          error?.hasOwnProperty("response") &&
          error?.response?.hasOwnProperty("data") &&
          error?.response?.data?.hasOwnProperty("error") &&
          error?.response?.data?.error
        ) {
          reject(error?.response?.data);
        } else {
          reject(error?.response);
        }
      });
    }
  });
};

export const ApiPutNoAuth = (type, userData) => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
    axios
      .put(BaseURL + "api/" + type, userData)
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        if (
          error?.hasOwnProperty("response") &&
          error?.response?.hasOwnProperty("data") &&
          error?.response?.data?.hasOwnProperty("error") &&
          error?.response?.data?.error
        ) {
          reject(error?.response?.data);
        } else {
          reject(error?.response);
        }
      });
    }
  });
};

export const ApiDeleteNoAuth = (type) => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
    axios
      .put(BaseURL + "api/" + type)
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        if (
          error?.hasOwnProperty("response") &&
          error?.response?.hasOwnProperty("data") &&
          error?.response?.data?.hasOwnProperty("error") &&
          error?.response?.data?.error
        ) {
          reject(error?.response?.data);
        } else {
          reject(error?.response);
        }
      });
    }
  });
};

export const ApiGet = (type) => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
    axios
      .get(BaseURL + "api/" + type, {
        headers: {
          authorization:
            "bearer " + JSON.parse(localStorage.getItem("access_tocken")),
        },
      })
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        if (
          error?.hasOwnProperty("response") &&
          error?.response?.hasOwnProperty("data") &&
          error?.response?.data?.hasOwnProperty("error") &&
          error?.response?.data?.error
        ) {
          if (error?.response?.status === 403) {
            //   signout();
          } else {
            reject(error?.response?.data);
          }
        } else {
          reject(error);
          if (error?.response?.data?.message === "Token has expired") {
            localStorage.clear();
            swal({
              title: "Warning",
              text: "Token has expired",
              icon: "warning",
            });
            // window.location.reload()
            window.location = "preview/next/login";
          } else if (error?.message === "Request failed with status code 401") {
            // localStorage.clear()
            // window.location.reload()
          }
        }
      });
    }
  });
};

export const ApiPost = (type, userData) => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
    axios
      .post(BaseURL + "api/" + type, userData, {
        headers: {
          authorization:
            "bearer " + JSON.parse(localStorage.getItem("access_tocken")),
        },
      })
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        if (
          error?.hasOwnProperty("response") &&
          error?.response?.hasOwnProperty("data") &&
          error?.response?.data?.hasOwnProperty("error") &&
          error?.response?.data?.error
        ) {
          if (error?.response?.status === 403) {
          } else {
            reject(error?.response?.data);
          }
        } else {
          reject(error);
          if (error?.response?.data?.message === "Token has expired") {
            localStorage.clear();
            swal({
              title: "Warning",
              text: "Token has expired",
              icon: "warning",
            });
            // window.location.reload()
            window.location = "preview/next/login";
          } else if (error?.message === "Request failed with status code 401") {
            // localStorage.clear()
            // window.location.reload()
          }
        }
      });
    }
  });
};
export const ApiPostuser = (type, userData, header) => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
    axios
      .post(BaseURL + "api/" + type, userData, { headers: "bearer" + header })
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        if (
          error?.hasOwnProperty("response") &&
          error?.response?.hasOwnProperty("data") &&
          error?.response?.data?.hasOwnProperty("error") &&
          error?.response?.data?.error
        ) {
          if (error?.response?.status === 403) {
          } else {
            reject(error?.response?.data);
          }
        } else {
          reject(error);
          if (error?.response?.data?.message === "Token has expired") {
            localStorage.clear();
            window.location.reload();
          } else if (error?.message === "Request failed with status code 401") {
            // localStorage.clear()
            window.location.reload();
          }
        }
      });
    }
  });
};

export const ApiPut = (type, userData) => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
    axios
      .put(BaseURL + "api/" + type, userData, { headers: headers })
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        if (
          error?.hasOwnProperty("response") &&
          error?.response?.hasOwnProperty("data") &&
          error?.response?.data?.hasOwnProperty("error") &&
          error?.response?.data?.error
        ) {
          if (error?.response?.status === 403) {
            //   signout();
          } else {
            reject(error?.response?.data);
          }
        } else {
          reject(error);
        }
      });
    }
  });
};

export const ApiDelete = (type) => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
    axios
      .delete(BaseURL + "api/" + type, { headers: headers })
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        if (
          error?.hasOwnProperty("response") &&
          error?.response?.hasOwnProperty("data") &&
          error?.response?.data?.hasOwnProperty("error") &&
          error?.response?.data?.error
        ) {
          if (error?.response?.status === 403) {
            //   signout();
          } else {
            reject(error?.response?.data);
          }
        } else {
          reject(error);
        }
      });
    }
  });
};
