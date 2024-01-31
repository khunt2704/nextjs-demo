import React, { useEffect, useState } from "react";
import { ApiPost } from "../Api/Api";
import ReactReadMoreReadLess from "react-read-more-read-less";
import swal from "sweetalert";
import Loader from "../Componets/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../Redux/Apidemo/apiDemoSlice";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import FormikErrorFocus from "formik-error-focus";
import Link from "next/link";
import { useRouter } from "next/router";
import wish from "../assets/images/wish2.png";
import defaultImg from "../assets/images/default.png";
import sendImg from "../assets/images/send.png";
// import Image from "next/future/image";
import Head from "next/head";

const Enquiry = () => {
  let userData = null;
  if (typeof window !== "undefined") {
    userData = JSON.parse(localStorage.getItem("userinfo"));
  }
  const navigate = useRouter();
  const dispatch = useDispatch();
  const [wishlist, setWishlist] = useState([]);
  const currency = useSelector((state) => state?.currency?.currency);
  const [loading, setLoading] = useState(false);
  const id = navigate?.query?.id;
  const [productData, setProductData] = useState([]);

  const addWishlist = (e) => {
    if (userData) {
      setLoading(true);
      const body = {
        params: {
          product_id: e,
        },
      };
      ApiPost("wishlists", body)
        .then((res) => {
          setLoading(false);
          if (res?.data?.result) {
            swal({
              title: "Success",
              text: res?.data?.result?.status?.meaning,
              icon: "success",
            });
            dispatch(getPosts());
            setWishlist(res?.data?.result?.wishlist);
          }
        })
        .catch(async (err) => {
          setLoading(false);
        });
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const body = {
      params: {
        product_id: id,
      },
    };
    ApiPost("get-product-details", body)
      .then((res) => {
        setLoading(false);
        if (res?.data?.details) {
          setProductData(res?.data?.details);
          setWishlist(res?.data?.wishlist);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
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
    contact: Yup.string().required("Please select atleast one option!"),
  });
  const onSubmit = (values, actions) => {
    setLoading(true);
    const body = {
      params: {
        full_name: values?.full_name,
        email: values?.email,
        phone_number: values?.phone,
        message: values?.message,
        type: values?.subject,
        contact_by: values?.contact,
      },
    };
    ApiPost("submit-enquiry", body)
      .then((res) => {
        setLoading(false);

        if (res?.data?.result) {
          swal({
            title: "Success",
            text: `Please note down the enquiry reference number(${res?.data?.result?.code}) for future reference`,
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
    <div>
      <Head>
        <title>Enquiry - Artdevotee</title>
        <meta name="description" content="Enquiry - Artdevotee" />
      </Head>
      {loading && <Loader />}
      <section className="breadcums_section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <ul className="bread_uls">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/search-product">Our Products</Link>
                </li>

                <li>Enquiry</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="product-section new_en_sec">
        <div className="container">
          <div className="row no-gutters">
            <div className="enquiry_lefts">
              <div className="enquiry_top_img">
                <span>
                  <div className="wish_enquie wish_prod">
                    <a
                      className={` ${
                        wishlist?.includes(JSON.stringify(productData?.id)) &&
                        "add_wishlist"
                      }`}
                      onClick={() => addWishlist(productData?.id)}
                    >
                      <img src={wish} alt="" />
                    </a>
                  </div>

                  {/* <img src={watermarkImage ? watermarkImage : process.env.PUBLIC_URL + "/images/enq_img.png"} /> */}
                  {/* <ReactWatermark
                                    
                                    color={'#fff'}
                                    font={'20px serif'}
                                    imagePath={process.env.PUBLIC_URL + "/images/enq_img.png"}
                                    textData={'Artdevotee'}
                                    textPosition={[20, 40]}
                                    multiple={true}
                                    transparent={5}
                                    type={'text'}
                                /> */}
                  {productData?.get_product_display_images?.length !== 0 && (
                    <div className="waterMark_Img">
                      {productData?.get_product_display_images ? (
                        <img
                          style={{ width: "100%" }}
                          src={
                            "https://artdevotee.com/preview/" +
                            productData?.get_product_display_images?.filter(
                              (e) => e?.is_default_display === "1"
                            )?.[0]?.image
                          }
                          alt="art devotee"
                        />
                      ) : (
                        <img src={defaultImg} alt="" />
                      )}
                    </div>
                  )}
                </span>
              </div>
              <div className="enquiry_btm_img">
                <h2>{productData?.title}</h2>

                <h5>Product Code : {productData?.product_id}</h5>
                <p>
                  {productData && (
                    <ReactReadMoreReadLess
                      charLimit={200}
                      readMoreText={<Link href="#">Read more</Link>}
                      readLessText={<Link href="#">Read less</Link>}
                      readMoreClassName="read-more-less--more"
                      readLessClassName="read-more-less--less"
                    >
                      {productData?.description
                        ? productData?.description
                        : " "}
                    </ReactReadMoreReadLess>
                  )}
                </p>

                <div className="en_pp">
                  {productData?.get_product_price?.filter(
                    (e) => e?.get_currency?.symbol === currency
                  )?.[0]?.discount && (
                    <span>
                      {currency &&
                        currency +
                          productData?.get_product_price?.filter(
                            (e) => e?.get_currency?.symbol === currency
                          )?.[0]?.price}
                    </span>
                  )}
                  {productData?.get_product_price?.filter(
                    (e) => e?.get_currency?.symbol === currency
                  )?.[0]?.global_offer_applied === "Y" && (
                    <span>
                      {currency &&
                        currency +
                          productData?.get_product_price?.filter(
                            (e) => e?.get_currency?.symbol === currency
                          )?.[0]?.price}
                    </span>
                  )}
                  <h6>
                    {productData?.get_product_price
                      ? productData?.get_product_price?.filter(
                          (e) => e?.get_currency?.symbol === currency
                        )?.[0]?.global_offer_applied === "Y"
                        ? currency &&
                          currency +
                            productData?.get_product_price?.filter(
                              (e) => e?.get_currency?.symbol === currency
                            )?.[0]?.after_discount_price
                        : productData?.get_product_price?.filter(
                            (e) => e?.get_currency?.symbol === currency
                          )?.[0]?.discount
                        ? currency +
                          productData?.get_product_price?.filter(
                            (e) => e?.get_currency?.symbol === currency
                          )?.[0]?.after_discount_price
                        : currency +
                          productData?.get_product_price?.filter(
                            (e) => e?.get_currency?.symbol === currency
                          )?.[0]?.price
                      : "0"}
                  </h6>
                </div>
              </div>
            </div>

            <div className="enquiry_rights">
              <div className="right_en_contents">
                <h2>Post Your Enquiry </h2>

                <p>
                  If you have any query / suggestion about the product or in
                  case you would like to use this product for business purpose,
                  Kindly contact us by filling out the following:
                </p>
              </div>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                enableReinitialize={true}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <div className="enquiry_forms">
                      <div className="row">
                        <div className="col-sm-6 col-md-12 col-lg-6">
                          <div className="input_froms">
                            <label>
                              Full Name <span>*</span>{" "}
                            </label>

                            <Field
                              type="text"
                              placeholder="Enter your full name here"
                              name="full_name"
                            />

                            <span className="errorInput">
                              <ErrorMessage name="full_name" />
                            </span>
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-12 col-lg-6">
                          <div className="input_froms">
                            <label>
                              Email address <span>*</span>{" "}
                            </label>

                            <Field
                              type="text"
                              placeholder="Enter here"
                              name="email"
                            />

                            <span className="errorInput">
                              <ErrorMessage name="email" />
                            </span>
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-12 col-lg-6">
                          <div className="input_froms">
                            <label>
                              Phone Number<span>*</span>
                            </label>

                            <Field
                              type="number"
                              placeholder="Enter here"
                              name="phone"
                            />

                            <span className="errorInput">
                              <ErrorMessage name="phone" />
                            </span>
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-12 col-lg-6">
                          <div className="input_froms">
                            <label>
                              Type<span>*</span>
                            </label>
                            <Field as="select" name="subject">
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
                        <div className="col-sm-12">
                          <div className="input_froms_radio">
                            <label>Contact by me</label>

                            <label className="radio">
                              <input
                                id="radio1"
                                type="radio"
                                name="contact"
                                value="P"
                                onChange={(e) => {
                                  setFieldValue("contact", e.target.value);
                                }}
                              />
                              <span className="outer">
                                <span className="inner"></span>
                              </span>
                              Phone
                            </label>

                            <label className="radio">
                              <input
                                id="radio2"
                                type="radio"
                                name="contact"
                                value="E"
                                onChange={(e) => {
                                  setFieldValue("contact", e.target.value);
                                }}
                              />
                              <span className="outer">
                                <span className="inner"></span>
                              </span>
                              Email
                            </label>
                          </div>
                          <span className="errorInput">
                            <ErrorMessage name="subject" />
                          </span>
                        </div>

                        <div className="col-sm-12">
                          <div className="input_froms">
                            <label>
                              Message<span>*</span>
                            </label>

                            <Field
                              as="textarea"
                              maxLength={500}
                              placeholder="Enter your details query here...."
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

                            <span className="errorInput h_21">
                              <ErrorMessage name="message" />
                            </span>
                          </div>
                        </div>

                        <div className="col-sm-12 mx-auto">
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
                              <img
                                src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
                                alt=""
                              />

                              <p>reCAPTCHA</p>

                              <small>Privacy - Terms</small>
                            </div>
                          </div>

                          <span className="errorInput h_20">
                            <ErrorMessage name="captcha" />
                          </span>
                        </div>

                        <div className="col-sm-12">
                          <button type="submit" className="qu_sub_btns">
                            Submit Query <img src={sendImg} alt="" />
                          </button>
                        </div>
                      </div>
                    </div>
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
      </section>
    </div>
  );
};

export default Enquiry;
