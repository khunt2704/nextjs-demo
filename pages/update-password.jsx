import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import swal from "sweetalert";
import { ApiPost } from "../Api/Api";
import Loader from "../Componets/Loader/Loader";

const Update_Password = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");
  const [errors, setError] = useState({});
  const [errorMsg, seterrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
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
  const resetPassword = (e) => {
    e.preventDefault()
    if (validateForm()) {
      setLoading(true);
      const body = {
        params: {
          otp: router.query.otp,
          password: data?.password,
        },
      };
      ApiPost("new-password-updated", body)
        .then((res) => {
          if (res?.data?.error) {
            seterrorMsg(res?.data?.error?.meaning);
          } else if (res?.data?.result) {
            swal({
              title: "Success",
              text: res?.data?.result?.status?.meaning,
              icon: "success",
            })
            .then(function() {
            router.push("/login");
            })
          }
          setLoading(false);
        })
        .catch(async (err) => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      seterrorMsg("");
    }, 10000);
  }, [errorMsg]);
  return (
    <>
    <Head>
        <title>Update Password - Artdevotee</title>
        <meta name="description" content="Update Password - Artdevotee" />
        <meta property="og:title" content="Update Password - Artdevotee" />
        <meta property="og:description" content="Update Password - Artdevotee" />
        <meta
          property="og:image"
          content="https://artdevotee.com /images/how-bnr.png"
        />
        <link rel="canonical" href="https://artdevotee.com/update-password" />
      </Head>
    <div className="log-page">
      {loading && <Loader />}
      <div className="container">
        <div className="log-page-inr">
          <div className="login-box">
            <div className="log-box-top">
              {errorMsg && <h6 className="errorMsg">{errorMsg}</h6>}
              <div className="loger-top for-got">
                <h2>Update Password</h2>
                {/* <h3>Please enter your registered email address to recieve OTP to reset your password</h3> */}
              </div>
              <div className="loger-inr">
                <form action="" role="form" onSubmit={resetPassword}>
                  <div className="log-inpt">
                    <label for="exampleInputEmail1">Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autocomplete="current-password"
                      id="id_password"
                      placeholder="password"
                      value={data?.password}
                      onChange={handleChange}
                    />
                    <i
                      className={`${
                        showPassword && "fa-eye-slash"
                      } fa fa-eye pointer`}
                      id="togglePassword"
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                    <span className="errorInput">
                      {data?.password?.length > 0 ? "" : errors["password"]}
                    </span>
                    <span className="errorInput h_21">
                      {data?.password?.match(passwordRegex)
                        ? ""
                        : errors["passwordCheck"]}
                    </span>
                  </div>
                  <div className="log-inpt mt-4">
                    <label for="exampleInputEmail1">Confirm Password</label>
                    <input
                      type={showPassword2 ? "text" : "password"}
                      name="cPassword"
                      autocomplete="current-password"
                      id="id_password_2"
                      placeholder="password"
                      value={data?.cPassword}
                      onChange={handleChange}
                    />
                    <i
                      className={`${
                        showPassword2 && "fa-eye-slash"
                      } fa fa-eye pointer`}
                      id="togglePassword"
                      onClick={() => setShowPassword2(!showPassword2)}
                    ></i>
                    <span className="errorInput">
                      {data?.cPassword?.length > 0 ? "" : errors["cPassword"]}
                    </span>
                    <span className="errorInput">
                      {data?.cPassword && data?.cPassword === data?.password
                        ? ""
                        : errors["cPasswordmatch"]}
                    </span>
                  </div>
                  <label className="mb-3 text-success f_12">
                    Note: For a strong password it should contain at least one
                    capital letter, one small letter, a number and a special
                    character and minimum 6 characters.(A!12fd)
                  </label>
                  <button
                    type="submit"
                    className="log-sbmt mt-2"
                  >
                    {" "}
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Update_Password;
