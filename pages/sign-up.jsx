import React, { useEffect, useState } from "react";
// import GoogleLogin from "react-google-login";
import Link from "next/link";
// import Image from "next/future/image";
import { useRouter } from "next/router";
import { ApiPostNoAuth } from "../Api/Api";
import Loader from "../Componets/Loader/Loader";
import { Formik, Form, ErrorMessage, Field } from "formik";
import swal from "sweetalert";
import * as Yup from "yup";
import FormikErrorFocus from "formik-error-focus";
import Head from "next/head";
import google from "../assets/images/google.png";
import { ApiPost } from "../Api/Api";

const Sign_Up = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [phoneStore, setPhoneStore] = useState("");
  const [country, setCountry] = useState([]);
  const [con, setCon] = useState("");
  const [states, setStates] = useState([]);
  const [rType, setRType] = useState("N");
  const [uData, setUData] = useState([]);
  var passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#_\$%\^&\*]).{6,}$/;

  const [errorMsg, seterrorMsg] = useState("");
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const responseGoogle = (response) => {
    console.log("response",response);
    if (response) {
      setRType("S");
      setUData(response);
      swal({
        text: "Please select country to complete your registration",
        icon: "warning",
      });
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    localStorage.clear();
    ApiPost("country-list", {})
      .then((res) => {
        setLoading(false);
        if (res?.data?.result) {
          setCountry(res?.data?.result?.country_with_code);
          setStates(res?.data?.result?.state_list);
        }
      })
      .catch(async (err) => {
        setLoading(false);
      });
  }, [rType]);
  useEffect(() => {
    setTimeout(() => {
      seterrorMsg("");
    }, 10000);
  }, [errorMsg]);
  useEffect(() => {
    if (msg) {
      setMsg("");
    }
  }, [router.pathname]);
  const bbb = country.map((e) => e?.name);
  const bbbb = bbb.filter((e) => {
    if (e?.toLowerCase()?.includes(phoneStore.toLowerCase())) {
      return e;
    }
  });

  const initialValues = {
    fname: "",
    lname: "",
    email: "",
    password: "",
    cPassword: "",
    newsletter_receive: false,
    agree: false,
    know: "",
    country: "",
    state: "",
    type: rType,
  };
  const validationSchema = Yup.object({
    type: Yup.string(),
    fname: Yup.string().when("type", {
      is: "N",
      then: Yup.string().required("Please enter your first name!"),
    }),
    lname: Yup.string().when("type", {
      is: "N",
      then: Yup.string().required("Please enter your last name!"),
    }),
    email: Yup.string().when("type", {
      is: "N",
      then: Yup.string()
        .required("Please enter your email address!")
        .email("Please enter a valid email address!")
        .nullable(),
    }),
    country: Yup.string().required("Please select your country!"),
    state: Yup.string().when("country", {
      is: "India (+91)",
      then: Yup.string().required("Please select your state!"),
    }),
    password: Yup.string().when("type", {
      is: "N",
      then: Yup.string()
        .required("Please enter Password!")
        .matches(passwordRegex, "Please enter a strong password!"),
    }),
    cPassword: Yup.string().when("type", {
      is: "N",
      then: Yup.string()
        .oneOf([Yup.ref("password"), ""], "Passwords is not matching!")
        .required("Please confirm your password!"),
    }),
    agree: Yup.string().when("type", {
      is: "N",
      then: Yup.string().oneOf(
        ["true"],
        "Please agree to our terms & condition and privacy policy!"
      ),
    }),
    know: Yup.string().when("type", {
      is: "N",
      then: Yup.string().required("Please select an option!"),
    }),
  });
  const onSubmit = (values, actions) => {
    setLoading(true);
    let body = {};
    let url = "";
    if (rType === "N") {
      url = "signUp";
      body = {
        first_name: values?.fname,
        last_name: values?.lname,
        email: values?.email,
        password: values?.password,
        confirm_password: values?.cPassword,
        agree: values?.agree ? "Y" : "N",
        newsletter_receive: values?.newsletter_receive ? "Y" : "N",
        got_to_know: values?.know,
        country: values?.country,
        state: values?.state,
      };
    } else if (rType === "S") {
      url = "socialLogin";
      body = {
        params: {
          social_id: uData?.googleId,
          type: "google",
          accessToken: uData?.accessToken,
          first_name: uData?.profileObj?.givenName,
          last_name: uData?.profileObj?.familyName,
          email: uData?.profileObj?.email,
          image: uData?.profileObj?.imageUrl,
          action_type: "S",
          country: values?.country,
          state: values?.state,
        },
      };
    }
    ApiPostNoAuth(url, body)
      .then((res) => {
        if (res?.data?.error) {
          seterrorMsg(res?.data?.error?.meaning);
        }
        setLoading(false);
        {
          res?.data?.result?.status &&
            setMsg(res?.data?.result?.status?.meaning);
        }
      })
      .catch(async (err) => {
        setLoading(false);
      });
  };

  return (
    <>
      <Head>
        <title>Sign Up - Artdevotee</title>
        <meta name="description" content="Sign Up - Artdevotee" />
        <meta property="og:title" content="Sign Up - Artdevotee" />
        <meta property="og:description" content="Sign Up - Artdevotee" />
        <meta
          property="og:image"
          content="https://artdevotee.com /images/how-bnr.png"
        />
        <link rel="canonical" href="https://artdevotee.com/sign-up" />
      </Head>
      <div className="log-page">
        {loading && <Loader />}
        {!msg ? (
          <div className="container">
            <div className="log-page-inr">
              <div className="login-box">
                <div className="log-box-top">
                  {errorMsg && <h6 className="errorMsg">{errorMsg}</h6>}
                  <div className="loger-top">
                    <h2>Signup</h2>
                    <h3>Please fill in the below fields to continue</h3>
                  </div>
                  <div className="loger-inr signer-inr">
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={onSubmit}
                      enableReinitialize={true}
                    >
                      {({ values, setFieldValue }) => (
                        <Form action="" role="form">
                          {rType === "N" && (
                            <>
                              <div className="name">
                                <div className="log-inpt sign-inpt">
                                  <label for="exampleInputEmail1">
                                    First Name<span>*</span>
                                  </label>
                                  <Field
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter here"
                                    id="fname"
                                    name="fname"
                                  />
                                  <span className="errorInput">
                                    <ErrorMessage name="fname" />
                                  </span>
                                </div>
                                <div className="log-inpt sign-inpt">
                                  <label for="exampleInputEmail1">
                                    Last Name<span>*</span>
                                  </label>
                                  <Field
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter here"
                                    id="lname"
                                    name="lname"
                                  />
                                  <span className="errorInput">
                                    <ErrorMessage name="lname" />
                                  </span>
                                </div>
                              </div>
                              <div className="log-inpt sign-inpt">
                                <label for="exampleInputEmail1">
                                  Email address<span>*</span>
                                </label>
                                <Field
                                  type="email"
                                  className="form-control"
                                  placeholder="Enter here"
                                  id="email"
                                  name="email"
                                />

                                <span className="errorInput">
                                  <ErrorMessage name="email" />
                                </span>
                              </div>
                            </>
                          )}
                          <div className="log-inpt sign-inpt sign-coun-inpt">
                            <label for="exampleInputEmail1">
                              Country<span>*</span>
                            </label>
                            <a className="sort_open country_input">
                              {values?.country ? values?.country : "select"}
                            </a>
                            <div className="sort_lst show_phone_code show_checkout_code ">
                              <input
                                className="phone_input"
                                value={phoneStore}
                                name="country"
                                onChange={(e) =>
                                  setPhoneStore(e?.target?.value)
                                }
                              />
                              <ul className="sort_open show_phone_code_list cont-inpt-ul">
                                {phoneStore &&
                                  [...new Set(bbbb)]?.map((e, i) => (
                                    <li key={i}>
                                      <a
                                        onClick={() => {
                                          setFieldValue("country", e);
                                          setCon(e);
                                        }}
                                      >
                                        +{e}
                                      </a>
                                    </li>
                                  ))}
                                {!phoneStore &&
                                  [...new Set(bbb)]?.map((e, i) => (
                                    <li key={i}>
                                      <a
                                        onClick={() => {
                                          setFieldValue("country", e);
                                          setCon(e);
                                        }}
                                      >
                                        +{e}
                                      </a>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                            <span className="errorInput extra_error ext-err00">
                              <ErrorMessage name="country" />
                            </span>
                          </div>
                          {con.toString() === "India (+91)" && (
                            <div className="log-inpt sign-inpt">
                              <div className="input_froms">
                                <label>State</label>
                                <Field as="select" name="state">
                                  <option value="">Select</option>
                                  {states && states.length > 0
                                    ? states.map((value, index) => {
                                        return (
                                          <option
                                            key={"state" + index}
                                            value={value.name}
                                          >
                                            {value.name}
                                          </option>
                                        );
                                      })
                                    : null}
                                </Field>

                                <span className="errorInput">
                                  <ErrorMessage name="state" />
                                </span>
                              </div>
                            </div>
                          )}
                          {rType === "N" && (
                            <>
                              <div className="name mb_0">
                                <div className="log-inpt sign-inpt">
                                  <label for="exampleInputEmail1">
                                    Password<span>*</span>
                                  </label>
                                  <Field
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    autocomplete="current-password"
                                    id="id_password"
                                    placeholder="Enter here"
                                  />
                                  <i
                                    className={`${
                                      showPassword && "fa-eye-slash"
                                    } fa fa-eye pointer`}
                                    id="togglePassword"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                  ></i>

                                  <span className="errorInput h15">
                                    <ErrorMessage name="password" />
                                  </span>
                                </div>
                                <div className="log-inpt sign-inpt">
                                  <label for="exampleInputEmail1">
                                    Confirm Password<span>*</span>
                                  </label>
                                  <Field
                                    type={showPassword2 ? "text" : "password"}
                                    name="cPassword"
                                    autocomplete="current-password"
                                    id="id_password_2"
                                    placeholder="Enter here"
                                  />
                                  <i
                                    className={`${
                                      showPassword2 && "fa-eye-slash"
                                    } fa fa-eye pointer`}
                                    id="togglePassword"
                                    onClick={() =>
                                      setShowPassword2(!showPassword2)
                                    }
                                  ></i>

                                  <span className="errorInput">
                                    <ErrorMessage name="cPassword" />
                                  </span>
                                </div>
                              </div>
                              <label className="mb-3 text-success f_12">
                                Note: For a strong password it should contain at
                                least one capital letter, one small letter, a
                                number and a special character and minimum 6
                                characters.(A!12fd)
                              </label>
                              <div className="forget signer-forget">
                                <label className="tick ">
                                  Sign up for newsletter
                                  <Field
                                    type="checkbox"
                                    name="newsletter_receive"
                                  />
                                  <span className="tickmark"></span>
                                </label>
                                <label className="tick">
                                  By creating an account, you agree to Art
                                  Devotee’s all{" "}
                                  <Link href="/terms-condition" target="_blank">
                                    Terms & Conditions
                                  </Link>{" "}
                                  and{" "}
                                  <Link href="/privacy-policy" target="_blank">
                                    Privacy Policy
                                  </Link>
                                  .
                                  <Field type="checkbox" name="agree" />
                                  <span className="tickmark"></span>
                                  <span className="errorInput">
                                    <ErrorMessage name="agree" />
                                  </span>
                                </label>
                              </div>
                              <div className="input_froms">
                                <label>
                                  How did you come to know about our website?
                                </label>
                                <Field as="select" name="know">
                                  <option value="">Select</option>
                                  <option value="Social Media">
                                    Social Media
                                  </option>
                                  <option value="Internet">Internet</option>
                                  <option value="Newspaper">Newspaper</option>
                                  <option value="Friend">Friend</option>
                                  <option value="Family">Family</option>
                                  <option value="Other">Other</option>
                                </Field>

                                <span className="errorInput h_15">
                                  <ErrorMessage name="know" />
                                </span>
                              </div>
                            </>
                          )}
                          <button type="submit" className="log-sbmt">
                            {" "}
                            Sign Up
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
                    Already have an Account?<Link href="/login">Login</Link>
                  </h5>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="goto-login">
            <div className="">
              <h5>{msg}</h5>
              <Link href="/login">Go to login</Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sign_Up;
