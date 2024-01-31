import React, { useEffect, useState } from "react";
import Link from "next/link";
// import Image from "next/future/image";
import { useRouter } from "next/router";
import { ApiPost, ApiPostNoAuth } from "../Api/Api";
import Loader from "../Componets/Loader/Loader";
// import GoogleLogin from "react-google-login";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import FormikErrorFocus from "formik-error-focus";
import Head from "next/head";
import google from "../assets/images/google.png";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, seterrorMsg] = useState("");
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const responseGoogle = (response) => {
    if (typeof window !== "undefined") {
      setLoading(true);
      const body = {
        params: {
          social_id: response?.googleId,
          type: "google",
          accessToken: response?.accessToken,
          first_name: response?.profileObj?.givenName,
          last_name: response?.profileObj?.familyName,
          email: response?.profileObj?.email,
          image: response?.profileObj?.imageUrl,
          action_type: "L",
        },
      };
      ApiPostNoAuth("socialLogin", body)
        .then((res) => {
          if (res?.data?.error) {
            seterrorMsg(res?.data?.error?.meaning);
          } else if (res?.data?.result) {
            localStorage.setItem(
              "userinfo",
              JSON.stringify(res?.data?.result?.userData)
            );
            localStorage.setItem(
              "access_tocken",
              JSON.stringify(res?.data?.result?.token)
            );
            if (!res?.data?.result?.userData?.phone) {
              router.push("/edit-profile");
            } else {
              router.push("/dashboard");
            }
          }
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
        });
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  }, []);
  useEffect(() => {
    setTimeout(() => {
      seterrorMsg("");
    }, 10000);
  }, [errorMsg]);

  //Subarna 19-10-22
  let initialValues = {};
  if (typeof window !== "undefined") {
    initialValues = {
      email: localStorage.getItem("email") ? localStorage.getItem("email") : "",
      password: localStorage.getItem("password")
        ? localStorage.getItem("password")
        : "",
      rememberme: localStorage.getItem("rememberme")
        ? localStorage.getItem("rememberme")
        : false,
    };
  }
  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Please enter your email address!")
      .email("Please enter a valid email address!")
      .nullable(),
    password: Yup.string()
      .required("Please enter a password!")
      .min(6, "Password must be atleast 6 character!")
      .nullable(),
  });
  const onSubmit = (values, actions) => {
    if (typeof window !== "undefined") {
      setLoading(true);
      if (values?.rememberme) {
        localStorage.setItem("email", values?.email);
        localStorage.setItem("password", values?.password);
        localStorage.setItem("rememberme", values?.rememberme);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        localStorage.removeItem("rememberme");
      }
      const body = {
        params: {
          email: values?.email,
          password: values?.password,
        },
      };
      ApiPost("auth/login", body)
        .then((res) => {
          if (res?.data?.error) {
            seterrorMsg(res?.data?.error?.meaning);
            setMsg(res?.data?.result?.status?.meaning);
          } else if (res?.data?.result) {
            localStorage.setItem(
              "access_tocken",
              JSON.stringify(res?.data?.result?.token)
            );
            localStorage.setItem(
              "userinfo",
              JSON.stringify(res?.data?.result?.userdata)
            );
            if (!res?.data?.result?.userdata?.phone) {
              router.push("/edit-profile");
            } else {
              router.push("/dashboard");
            }
          }
          setLoading(false);
        })
        .catch(async (err) => {
          setLoading(false);
        });
    }
  };
  //Subarna 19-10-22
  return (
    <>
      <Head>
        <title>Login - Artdevotee</title>
        <meta name="description" content="Login - Artdevotee" />
        <meta property="og:title" content="Login - Artdevotee" />
        <meta property="og:description" content="Login - Artdevotee" />
        <meta
          property="og:image"
          content="https://artdevotee.com /images/how-bnr.png"
        />
        <link rel="canonical" href="https://artdevotee.com/login" />
      </Head>
      <div className="log-page">
        {loading && <Loader />}
        {msg ? (
          <div className="goto-login">
            <div className="">
              <h5>{msg}</h5>
              <a onClick={() => setMsg("")}>Go to login</a>
            </div>
          </div>
        ) : (
          <div className="container">
            <div className="log-page-inr">
              <div className="login-box">
                <div className="log-box-top">
                  {errorMsg && <h6 className="errorMsg">{errorMsg}</h6>}
                  <div className="loger-top">
                    <h2>Login</h2>
                    <h3>Please enter your login info to continue</h3>
                  </div>
                  <div className="loger-inr">
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={onSubmit}
                      enableReinitialize={true}
                    >
                      {({ values, setFieldValue }) => (
                        <Form action="" role="form">
                          <div className="log-inpt inpt-1">
                            <label htmlFor="exampleInputEmail1">
                              Email address
                            </label>
                            <Field
                              type="email"
                              className="form-control"
                              placeholder="Enter here..."
                              name="email"
                            />
                            <span className="errorInput">
                              <ErrorMessage name="email" />
                            </span>
                          </div>
                          <div className="log-inpt">
                            <label htmlFor="exampleInputEmail1">Password</label>
                            <Field
                              type={showPassword ? "text" : "password"}
                              name="password"
                              autocomplete="current-password"
                              id="id_password"
                              placeholder="Enter here..."
                            />
                            <i
                              className={`${
                                showPassword && "fa-eye-slash"
                              } fa fa-eye pointer`}
                              id="togglePassword"
                              onClick={() => setShowPassword(!showPassword)}
                            ></i>

                            <span className="errorInput">
                              <ErrorMessage name="password" />
                            </span>
                          </div>
                          <div className="forget">
                            <label className="tick">
                              Remember me
                              <Field type="checkbox" name="rememberme" />
                              <span className="tickmark"></span>
                            </label>
                            <Link href="/forgot-password">
                              Forgot password?
                            </Link>
                          </div>
                          <button type="submit" className="log-sbmt">
                            Submit
                          </button>
                          <FormikErrorFocus
                            offset={0}
                            align={"middle"}
                            focusDelay={200}
                            ease={"linear"}
                            duration={1000}
                          />
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
                <div className="log-box-btm">
                  <h5>
                    Do not have an Account?{" "}
                    <Link href="/sign-up">Register Now</Link>
                  </h5>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
