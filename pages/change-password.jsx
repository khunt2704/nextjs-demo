import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import { ApiPost } from "../Api/Api";
import Loader from "../Componets/Loader/Loader";
import Sidemenu from "../Componets/Sidemenu/Sidemenu";
import Head from "next/head";


const Change_Password = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    old_password: "",
    password: "",
    cPassword: "",
  });
  const [errors, setError] = useState({});
  const [errorMsg, seterrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  var passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#_\$%\^&\*]).{6,}$/;
  const validateForm = () => {
    let errors = {};
    let formIsValid = true;
    if (!data?.old_password) {
      formIsValid = false;
      errors["old_password"] = "Please enter current password";
    } else if (data?.old_password?.length < 6) {
      formIsValid = false;
      errors["old_passwords"] =
        "The current password must be at least 6 characters.";
    }
    if (!data?.password) {
      formIsValid = false;
      errors["password"] = "Please enter password";
    } else if (!data?.password?.match(passwordRegex)) {
      formIsValid = false;
      errors["passwordCheck"] = "Please enter strong password";
    }
    if (!data?.cPassword) {
      formIsValid = false;
      errors["cPassword"] = "Please enter confirm password";
    } else if (data?.password !== data?.cPassword) {
      formIsValid = false;
      errors["cPasswordmatch"] = "Password do NOT match";
    }
    setError(errors);

    return formIsValid;
  };
  const resetPassword = () => {
    if (validateForm()) {
      setLoading(true);
      const body = {
        params: {
          old_password: data?.old_password,
          new_password: data?.password,
        },
      };
      ApiPost("change-password", body)
        .then((res) => {
          if (res?.data?.error) {
            seterrorMsg(res?.data?.error?.meaning);
            swal({
              title: "Warning",
              text: res?.data?.error?.meaning,
              icon: "warning",
            });
          } else if (res?.data?.result) {
            swal({
              title: "Success",
              text: res?.data?.result?.status?.meaning,
              icon: "success",
            });
            setData({
              old_password: "",
              password: "",
              cPassword: "",
            });
          }
          setLoading(false);
        })
        .catch(async (err) => {
          setLoading(false);
        });
    }
  };
  useEffect(() => {
    setTimeout(() => {
      seterrorMsg("");
    }, 10000);
  }, [errorMsg]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <Head>
        <title>Change Password - Artdevotee</title>
        <meta name="description" content="Change Password - Artdevotee" />
        <meta property="og:title" content="Change Password - Artdevotee" />
        <meta
          property="og:description"
          content="Change Password - Artdevotee"
        />
        <meta
          property="og:image"
          content="https://artdevotee.com /images/how-bnr.png"
        />
        <link rel="canonical" href="https://artdevotee.com/change-password" />
      </Head>
      {loading && <Loader />}
      <div className="dashbord_sec">
        <div className="container">
          <div className="dashbord_inr">
            <Sidemenu />

            <div className="dashbord_right">
              <div className="dashbord_right_ir">
                <div className="dash_headings_div">
                  {" "}
                  <h1>Change Password</h1>
                </div>

                <div className="dashbord_frm">
                  <form action="">
                    <div className="row">
                      <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <div className="input_froms log-inpt">
                          <label className="change_lable">
                            Current Password
                          </label>

                          <input
                            type={showPassword3 ? "text" : "password"}
                            placeholder="Enter here"
                            name="old_password"
                            value={data?.old_password}
                            onChange={handleChange}
                          />
                          <i
                            className={`${
                              showPassword3 && "fa-eye-slash"
                            } fa fa-eye pointer change_i`}
                            id="togglePassword"
                            onClick={() => setShowPassword3(!showPassword3)}
                          ></i>
                          <span className="errorInput h_10">
                            {data?.old_password?.length > 0
                              ? ""
                              : errors["old_password"]}
                          </span>
                          <span className="errorInput h_10">
                            {data?.old_password?.length > 5
                              ? ""
                              : errors["old_passwords"]}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <div className="input_froms log-inpt">
                          <label className="change_lable">New Password</label>

                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter here"
                            name="password"
                            value={data?.password}
                            onChange={handleChange}
                          />
                          <i
                            className={`${
                              showPassword && "fa-eye-slash"
                            } fa fa-eye pointer change_i`}
                            id="togglePassword"
                            onClick={() => setShowPassword(!showPassword)}
                          ></i>
                          <span className="errorInput h_10">
                            {data?.password?.length > 0
                              ? ""
                              : errors["password"]}
                          </span>
                          <span className="errorInput h_10">
                            {data?.password?.match(passwordRegex)
                              ? ""
                              : errors["passwordCheck"]}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <div className="input_froms log-inpt">
                          <label className="change_lable">
                            Confirm Password
                          </label>

                          <input
                            type={showPassword2 ? "text" : "password"}
                            placeholder="Enter here"
                            name="cPassword"
                            value={data?.cPassword}
                            onChange={handleChange}
                          />
                          <i
                            className={`${
                              showPassword2 && "fa-eye-slash"
                            } fa fa-eye pointer change_i`}
                            id="togglePassword"
                            onClick={() => setShowPassword2(!showPassword2)}
                          ></i>
                          <span className="errorInput h_10">
                            {data?.cPassword?.length > 0
                              ? ""
                              : errors["cPassword"]}
                          </span>
                          <span className="errorInput h_10">
                            {data?.cPassword &&
                            data?.cPassword === data?.password
                              ? ""
                              : errors["cPasswordmatch"]}
                          </span>
                        </div>
                      </div>
                    </div>

                    <label className="mb-3 text-success f_12">
                      Note: For a strong password it should contain at least one
                      capital letter, one small letter, a number and a special
                      character and minimum 6 characters.(A!12fd)
                    </label>
                    <div className="boirder"></div>

                    <div className="edit-frm-btns">
                      <button
                        type="button"
                        className="save"
                        onClick={resetPassword}
                      >
                        Save & Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="clearfix"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Change_Password;
