import React, { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
// import Image from "next/future/image";
import { useRouter } from "next/router";
import swal from "sweetalert";
import { ApiPost } from "../Api/Api";
import Loader from "../Componets/Loader/Loader";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import FormikErrorFocus from "formik-error-focus";
import {
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  TwitterShareButton,
} from "react-share";
import send_fly from "../assets/images/send-fly.png";
import map_white from "../assets/images/map-white.png";
import mail_white from "../assets/images/mail-white.png";
import phone_white from "../assets/images/phone-white.png";
import facebook from "../assets/images/facebook.png";
import linkedin from "../assets/images/linkedin.png";
import pinterest from "../assets/images/pinterest.png";
import fa3 from "../assets/images/fa3.png";
import Assets from "@/Componets/Assest";

const Contact_Us = () => {
  const router = useRouter();
  
  let userData=null;
  if (typeof window !== 'undefined') {
  userData = JSON.parse(localStorage.getItem("userinfo"));
  }
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const initialValues = {
    full_name: userData?.first_name
      ? userData?.first_name + " " + userData?.last_name
      : "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    captcha: false,
  };
  const validationSchema = Yup.object({
    full_name: Yup.string().required("Please enter your full name!"),
    email: Yup.string()
      .required("Please enter your email address!")
      .email("Please enter a valid email address!")
      .nullable(),
    phone: Yup.string()
      .required("Please enter your phone number!")
      .matches(/^([0-9\s\-+()]*)$/, "Invalid phone number!")
      .min(7, "Phone number must be at least 7 characters!")
      .max(15, "Phone number contains maximum 15 characters!"),
    subject: Yup.string().required("Please select a subject!"),
    message: Yup.string().required("Please enter message!"),
    captcha: Yup.string().oneOf(
      ["true"],
      "Please confirm you are not a robot!"
    ),
  });
  const onSubmit = (values, actions) => {
    setLoading(true);
    const body = {
      params: {
        full_name: values.full_name,
        email: values.email,
        phone_number: values.phone,
        message: values.message,
        subject: values.subject,
      },
    };
    ApiPost("submit-contact", body)
      .then((res) => {
        setLoading(false);
        if (res?.data?.result) {
          swal({
            title: "Success",
            text: res?.data?.result?.status?.meaning,
            icon: "success",
          });
          actions.resetForm();
        }
      })
      .catch(async (err) => {
        setLoading(false);
      });
  };
  return (
    <>
    <Head>
        <title>Contact Us - Artdevotee</title>
        <meta
            name="description"
            content="Contact Us - Artdevotee"
        />
        <meta property="og:title" content="Contact Us - Artdevotee" />
        <meta property="og:description" content="Contact Us - Artdevotee" />
        <meta property="og:image" content="https://artdevotee.com /images/contact-bnr.png" />
        <link rel="canonical" href="https://artdevotee.com/contact-us" />
      </Head>
    <div>
      {loading && <Loader />}
      <div className="contact-bnr">
        <div className="container">
          <div className="contct-bnr-txt">
            <h1>Contact Us</h1>

            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>

                <li className="breadcrumb-item active" aria-current="page">
                  Contact
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="contact-pager">
        <div className="container">
          <div className="contact-inr">
            <div className="row">
              <div className="col-lg-7">
                <div className="contact-frm-sec">
                  <div className="loger-top cont-top">
                    <h2>Get In Touch!</h2>

                    <h3>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua enim
                    </h3>
                  </div>

                  <div className="contact-form">
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={onSubmit}
                      enableReinitialize={true}
                    >
                      {({ values, setFieldValue }) => (
                        <Form action="" role="form">
                          <div className="cont-name">
                            <div className="cont-inpt">
                              <label for="exampleFormControlInput1">
                                Full Name
                              </label>

                              <Field
                                type="text"
                                className="form-control"
                                id="exampleFormControlInput1"
                                placeholder="Enter your full name here"
                                name="full_name"
                              />
                              <span className="errorInput">
                                <ErrorMessage name="full_name" />
                              </span>
                            </div>

                            <div className="cont-inpt">
                              <label for="exampleFormControlInput1">
                                Email Address
                              </label>

                              <Field
                                type="email"
                                className="form-control"
                                id="exampleFormControlInput1"
                                placeholder="Enter here"
                                name="email"
                              />
                              <span className="errorInput">
                                <ErrorMessage name="email" />
                              </span>
                            </div>
                          </div>

                          <div className="cont-name">
                            <div className="cont-inpt">
                              <label for="exampleFormControlInput1">
                                Phone Number
                              </label>

                              <Field
                                type="number"
                                className="form-control"
                                id="exampleFormControlInput1"
                                placeholder="Enter your phone number here"
                                name="phone"
                              />
                              <span className="errorInput">
                                <ErrorMessage name="phone" />
                              </span>
                            </div>

                            <div className="cont-inpt">
                              <label for="exampleFormControlInput1">
                                Subject
                              </label>

                              <Field
                                as="select"
                                className="form-control"
                                id="exampleFormControlSelect1"
                                name="subject"
                              >
                                <option value="">Select</option>

                                <option value="Business / commercial use">
                                  Business / commercial use
                                </option>

                                <option value="Suggestion Comments">
                                  Suggestion Comments
                                </option>

                                <option value="Any Other">Any Other</option>
                              </Field>
                              <span className="errorInput">
                                <ErrorMessage name="subject" />
                              </span>
                            </div>
                          </div>

                          <div className="cont-inpt input_froms">
                            <label for="exampleFormControlInput1">
                              Message
                            </label>

                            <Field
                              as="textarea"
                              maxLength={500}
                              className="form-control "
                              id="exampleFormControlTextarea1"
                              placeholder="Enter your message here"
                              name="message"
                            ></Field>
                            {values?.message?.length <= 500 && (
                              <small>
                                {500 - values?.message?.length} characters
                                remaining
                              </small>
                            )}
                            {values?.message?.length > 500 && (
                              <small>
                                You can not use more than 500 characters.
                              </small>
                            )}
                            <span className="errorInput">
                              <ErrorMessage name="message" />
                            </span>
                          </div>
                          <div
                            className="col-sm-12 mx-auto"
                            style={{
                              paddingLeft: "0px",
                              marginBottom: "22px",
                              marginTop: "22px",
                            }}
                          >
                            <div className="captcha">
                              <div className="spinner">
                                <label>
                                  <Field type="checkbox" name="captcha" />

                                  <span className="checkmark">
                                    <span>&nbsp;</span>
                                  </span>
                                </label>
                              </div>

                              <div className="text">I am not a robot</div>

                              <div className="logs">
                                <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt=""/>

                                <p>reCAPTCHA</p>

                                <small>Privacy - Terms</small>
                              </div>
                            </div>
                            <span className="errorInput h_20">
                              <ErrorMessage name="captcha" />
                            </span>
                          </div>
                          <button
                            type="submit"
                            className="conc-btn"
                          >
                            Submit
                            <Assets
                              src={"images/send-fly.png"}
                              alt=""
                            />
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
              </div>

              <div className="col-lg-5">
                <div className="adrs-box">
                  <div className="adrs-inr">
                    <div className="ad-sec-01">
                      <div className="sec-img">
                        <Assets
                          src={"images/map-white.png"}
                          alt=""
                        />
                      </div>

                      <div className="sec-text">
                        <h2>Address</h2>

                        <p>
                          Lorem ipsum dolor sit amet adipiscing elit sed do
                          eiusmod tempor
                        </p>
                      </div>
                    </div>

                    <div className="ad-sec-01">
                      <div className="sec-img">
                        <Assets
                          src={
                            "images/mail-white.png"
                          }
                          alt=""
                        />
                      </div>

                      <div className="sec-text">
                        <h2>Email</h2>

                        <a
                          className="a_hover"
                          href={`mailto:info@artdevotee.com`}
                        >
                          info@artdevotee.com
                        </a>
                      </div>
                    </div>

                    <div className="ad-sec-01">
                      <div className="sec-img">
                        <Assets
                          src={
                            "images/phone-white.png"
                          }
                          alt=""
                        />
                      </div>

                      <div className="sec-text">
                        <h2>Contact number</h2>
                        <a className="a_hover" href={`tel:+1 0123456789`}>
                          +1 0123456789{" "}
                        </a>
                        /
                        <span>
                          <a className="a_hover" href={`tel:+1 9876543210`}>
                            +1 9876543210
                          </a>
                        </span>
                      </div>
                    </div>

                    <div className="social-conct">
                      <h2>Connect with social media</h2>

                      <div className="sos-cnct-lst">
                        <ul>
                          <li>
                            <FacebookShareButton
                              url={
                                "https://artdevotee.com/preview/next" +
                                router?.pathname
                              }
                            >
                              <a>
                                <Assets
                                  src={
                                    "images/facebook.png"
                                  }
                                  alt=""
                                />
                              </a>
                            </FacebookShareButton>
                          </li>
                          <li>
                            <LinkedinShareButton
                              url={
                                "https://artdevotee.com/preview/next" +
                                router?.pathname
                              }
                            >
                              <a>
                                <Assets
                                  src={
                                    "images/linkedin.png"
                                  }
                                  alt=""
                                />
                              </a>
                            </LinkedinShareButton>
                          </li>
                          <li>
                            <PinterestShareButton
                              media={
                                "https://artdevotee.com/preview/next" +
                                router?.pathname
                              }
                              description={
                                "https://artdevotee.com/preview/next" +
                                router?.pathname
                              }
                              url={
                                "https://artdevotee.com/preview/next" +
                                router?.pathname
                              }
                            >
                              <a>
                                <Assets
                                  src={
                                    "images/pinterest.png"
                                  }
                                  alt=""
                                />
                              </a>
                            </PinterestShareButton>
                          </li>
                          <TwitterShareButton
                            url={
                              "https://artdevotee.com/preview/next" +
                              router?.pathname
                            }
                          >
                            <li>
                              <a>
                                <Assets
                                  src={
                                    "images/fa3.png"
                                  }
                                  alt=""
                                  className="hverb"
                                />
                              </a>
                            </li>
                          </TwitterShareButton>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Contact_Us;
