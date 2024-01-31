import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import { ApiGet, ApiPost } from "../Api/Api";
import Loader from "../Componets/Loader/Loader";
import No_Data_Found from "../Componets/No_data_found/No_Data_Found";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import FormikErrorFocus from "formik-error-focus";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import rejectt from "../assets/images/rejectt.png";


const Gift_Card_Checkout = () => {
  const currency = useSelector((state) => state?.currency?.currency);
  const calling_code = useSelector((state) => state?.currency?.calling_code);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [data2, setData2] = useState([]);
  const [phoneStore, setPhoneStore] = useState("");
  const [addressCheckbox, setAddressCheckbox] = useState(false);
  const [country, setCountry] = useState([]);
  const [selectBox, setSelectBox] = useState(0);
  const [address, setAddress] = useState([]);
  const [radio, setRadio] = useState("1");
  const [show, setShow] = useState(false);
  const [deleteAdd, setDeleteAddress] = useState("");

  const openModal = (e) => {
    setShow(true);
    setDeleteAddress(e);
  };
  const closeModal = () => {
    setShow(false);
    setDeleteAddress({});
  };
  console.log("data", data, data2);

  const getAddress = () => {
    ApiGet("address-list")
      .then((res) => {
        if (res?.data?.details) {
          setAddress(res?.data?.details);
        }
      })
      .catch(async (err) => {});
  };
  const deleteAddress = () => {
    const body = {
      params: {
        address_id: deleteAdd,
      },
    };
    ApiPost("address-delete", body)
      .then((res) => {
        if (res?.data?.result?.status) {
          closeModal();
          swal({
            title: "Success",
            text: res?.data?.result?.status,
            icon: "success",
          });
          ApiGet("address-list")
            .then((res) => {
              if (res?.data?.details) {
                setAddress(res?.data?.details);
              }
            })
            .catch(async (err) => {});
        }
      })
      .catch(async (err) => {});
  };
  useEffect(() => {
    setData(router.query.data && JSON.parse(router.query.data));
    setData2(router.query.data2 && JSON.parse(router.query.data2));
    window.scrollTo(0, 0);
    ApiPost("country-list", {})
      .then((res) => {
        if (res?.data?.result) {
          setCountry(res?.data?.result?.country_with_code);
        }
      })
      .catch(async (err) => {});
    getAddress();
  }, [router.isReady]);

  //Subarna 19-10-22
  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    postcode: "",
    address: "",
    country: "",
    save: false,
    radios: "1",
  };
  const validationSchema = Yup.object({
    radios: Yup.string(),
    first_name: Yup.string().when("radios", {
      is: "1",
      then: Yup.string().required("Please enter your first name!"),
    }),
    last_name: Yup.string().when("radios", {
      is: "1",
      then: Yup.string().required("Please enter your last name!"),
    }),
    email: Yup.string().when("radios", {
      is: "1",
      then: Yup.string()
        .required("Please enter your email address!")
        .email("Please enter a valid email address!")
        .nullable(),
    }),
    phone: Yup.string().when("radios", {
      is: "1",
      then: Yup.string()
        .required("Please enter your phone number!")
        .matches(/^([0-9\s\-+()]*)$/, "Invalid phone number!")
        .min(7, "Phone number must be at least 7 characters!")
        .max(15, "Phone number contains maximum 15 characters!"),
    }),
    country: Yup.string().when("radios", {
      is: "1",
      then: Yup.string().required("Please select your country!"),
    }),
    state: Yup.string().when("radios", {
      is: "1",
      then: Yup.string().required("Please enter your state!"),
    }),
    city: Yup.string().when("radios", {
      is: "1",
      then: Yup.string().required("Please enter your city!"),
    }),
    postcode: Yup.string().when("radios", {
      is: "1",
      then: Yup.string().required("Please enter your post code!"),
    }),
    address: Yup.string().when("radios", {
      is: "1",
      then: Yup.string().required("Please enter your full address!"),
    }),
  });

  const onSubmit = (values, actions) => {
    if (values.radios === "1") {
      setLoading(true);
      let formData = new FormData();
      formData.append("billing_fname", values?.first_name);
      formData.append("billing_lname", values?.last_name);
      formData.append("billing_email", values?.email);
      formData.append("billing_phone", values?.phone);
      formData.append(
        "billing_country",
        country?.filter((e) => e?.name === values?.country)[0]?.id
      );
      formData.append("billing_state", values?.state);
      formData.append("billing_city", values?.city);
      formData.append("billing_postcode", +values?.postcode);
      formData.append("billing_street_address", values?.address);
      formData.append("is_saved_billing_address", "N");
      formData.append("cart_id", data?.id);
      formData.append("is_saved_address", values?.save ? "Y" : "N");
      formData.append("total_amount", data?.total_amount);
      formData.append("currency_code", calling_code);
      ApiPost("giftcard-order-place", formData)
        .then((res) => {
          if (res?.data?.order && res?.data?.order?.order_number) {
            router.push({
              pathname: "/payment",
              query: {
                order_number: res?.data?.order?.order_number,
                status: "G",
              },
            });
          }
          setLoading(false);
        })
        .catch(async (err) => {
          setLoading(false);
        });
    } else {
      if (selectBox === 0 && address?.length !== 0 && radio === "2") {
        swal({
          title: "Warning",
          text: "Please Select Address",
          icon: "warning",
        });
      } else if (selectBox !== 0 && address?.length !== 0) {
        setLoading(true);
        let formData = new FormData();
        formData.append("address_book_id", selectBox);
        formData.append("is_saved_billing_address", "Y");
        formData.append("cart_id", data?.id);
        formData.append("is_saved_address", values?.save ? "Y" : "N");
        formData.append("total_amount", data?.total_amount);
        formData.append("currency_code", calling_code);
        ApiPost("giftcard-order-place", formData)
          .then((res) => {
            if (res?.data?.order && res?.data?.order?.order_number) {
              router.push({
                pathname: "/payment",
                query: {
                  order_number: res?.data?.order?.order_number,
                  status: "G",
                },
              });
            }
            setLoading(false);
          })
          .catch(async (err) => {
            setLoading(false);
          });
      } else if (address?.length === 0) {
        swal({
          title: "Warning",
          text: "You currently have no addresses saved.",
          icon: "warning",
        });
        actions.resetForm();
      }
    }
  };
  const selecttedBox = (e) => {
    setSelectBox(selectBox !== e ? e : 0);
  };
  const changeCheckbox = (e, y) => {
    setSelectBox(y?.target?.checked ? e : 0);
    setAddressCheckbox(y?.target?.checked);
  };
  const bbb = country.map((e) => e?.name);
  const bbbb = bbb.filter((e) => {
    if (e?.toLowerCase()?.includes(phoneStore.toLowerCase())) {
      return e;
    }
  });

  return (
    <div>
      <Head>
        <title>Gift Card Checkout - Artdevotee</title>
        <meta name="description" content="Gift Card Checkout - Artdevotee" />
        <meta property="og:title" content="Gift Card Checkout - Artdevotee" />
        <meta
          property="og:description"
          content="Gift Card Checkout - Artdevotee"
        />
        <meta
          property="og:image"
          content="https://artdevotee.com /images/how-bnr.png"
        />
        <link
          rel="canonical"
          href="https://artdevotee.com/checkout-gift-card"
        />
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
                <li>Card Checkout</li>
              </ul>
            </div>
          </div>
          <div className="container"></div>
        </div>
      </section>
      <section className="product-section new_en_sec">
        <div className="container">
          <div className="row no-gutters">
            <div className="check_out_lefts ">
              <div className="product_checkout_infos">
                <div className="checkout_headings">
                  <h2>Payment Details</h2>
                </div>
                <div className="check_subtotal_sec">
                  <div className="sub_total_check">
                    <p>Total Number of Cards</p>
                    <h6>
                      {data?.total_card_quantity
                        ? data?.total_card_quantity
                        : 1}
                    </h6>
                  </div>
                </div>

                {/* {data && ( */}
                {data2 && (
                  <>
                    <ul>
                      {data2?.map((e, i) => {
                        return (
                          <li key={i}>
                            <div className="produ_infos border-top py-2 pl-0">
                              <div className="order_details_dash pl-0">
                                <h3 className="pointer">
                                  {e?.get_product_details?.title}{" "}
                                </h3>
                                <div className="dash_pps">
                                  <h5>
                                    {currency &&
                                      currency +
                                        e?.get_gift_card_details?.price}
                                  </h5>
                                </div>
                                <p>
                                  card number:{" "}
                                  {e?.get_gift_card_details?.card_number}
                                </p>
                                <p>
                                  validity days:{" "}
                                  {e?.get_gift_card_details?.validity_days}
                                </p>
                                <p className="dash_pps">
                                  <h5>
                                    This gift card is a gift for {e?.name}
                                  </h5>
                                </p>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
                {!loading && !data2 && <No_Data_Found type="gift-cart" />}

                <div className="check_total_sec">
                  <div className="check_pro_totals">
                    <h4>Total Payable Amount : </h4>
                    <p>{currency && currency + data?.total_amount}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="check_out_rights ">
              <div className="product_checkout_infos">
                <div className="checkout_headings">
                  <h2>Billing Information</h2>
                </div>
                <div className="enquiry_forms mt-0">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                    enableReinitialize={true}
                  >
                    {({ values, setFieldValue }) => (
                      <Form>
                        <div className="row">
                          <div className="col-sm-12">
                            <div className="input_froms_radio marb_20">
                              <label
                                className="radio"
                                onClick={() => setRadio("1")}
                              >
                                <input
                                  id="radio1"
                                  type="radio"
                                  name="radios"
                                  value="1"
                                  checked={radio === "1"}
                                  onClick={() => setFieldValue("radios", "1")}
                                />
                                <span className="outer">
                                  <span className="inner"></span>
                                </span>
                                Create New Address
                              </label>
                              <label
                                className="radio"
                                onClick={() => setRadio("2")}
                              >
                                <input
                                  id="radio2"
                                  type="radio"
                                  name="radios"
                                  value="2"
                                  onClick={() => setFieldValue("radios", "2")}
                                />
                                <span className="outer">
                                  <span className="inner"></span>
                                </span>
                                Use Saved Address
                              </label>
                            </div>
                            {radio === "2" && address?.length !== 0 && (
                              <label className="mb-3 Note">
                                Note: Select from below
                              </label>
                            )}
                          </div>
                          {radio === "1" && (
                            <>
                              <div className="col-sm-6">
                                <div className="input_froms">
                                  <label>First Name</label>
                                  <Field
                                    type="text"
                                    placeholder="Enter here"
                                    name="first_name"
                                  />

                                  <span className="errorInput">
                                    <ErrorMessage name="first_name" />
                                  </span>
                                </div>
                              </div>
                              <div className="col-sm-6">
                                <div className="input_froms">
                                  <label>Last Name </label>
                                  <Field
                                    type="text"
                                    placeholder="Enter here"
                                    name="last_name"
                                  />

                                  <span className="errorInput">
                                    <ErrorMessage name="last_name" />
                                  </span>
                                </div>
                              </div>
                              <div className="col-sm-6">
                                <div className="input_froms">
                                  <label>Email address </label>
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
                              <div className="col-sm-6">
                                <div className="input_froms">
                                  <label>Phone Number</label>
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
                              <div className="col-sm-6">
                                <div className="input_froms">
                                  <label>Country </label>
                                  <a className="sort_open country_input">
                                    {values?.country
                                      ? values?.country
                                      : "select"}
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
                                    <ul className="sort_open show_phone_code_list">
                                      {phoneStore &&
                                        [...new Set(bbbb)]?.map((e, i) => (
                                          <li key={i}>
                                            <a
                                              onClick={() =>
                                                setFieldValue("country", e)
                                              }
                                            >
                                              +{e}
                                            </a>
                                          </li>
                                        ))}
                                      {!phoneStore &&
                                        [...new Set(bbb)]?.map((e, i) => (
                                          <li key={i}>
                                            <a
                                              onClick={() =>
                                                setFieldValue("country", e)
                                              }
                                            >
                                              +{e}
                                            </a>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>

                                  <span className="errorInput extra_error">
                                    <ErrorMessage name="country" />
                                  </span>
                                </div>
                              </div>
                              <div className="col-sm-6 mt_44">
                                <div className="input_froms">
                                  <label>State</label>
                                  <Field
                                    type="text"
                                    placeholder="Enter here"
                                    name="state"
                                  />

                                  <span className="errorInput">
                                    <ErrorMessage name="state" />
                                  </span>
                                </div>
                              </div>
                              <div className="col-sm-6">
                                <div className="input_froms">
                                  <label>City</label>
                                  <Field
                                    type="text"
                                    placeholder="Enter here"
                                    name="city"
                                  />

                                  <span className="errorInput">
                                    <ErrorMessage name="city" />
                                  </span>
                                </div>
                              </div>
                              <div className="col-sm-6">
                                <div className="input_froms">
                                  <label>Post Code</label>
                                  <Field
                                    type="number"
                                    placeholder="Enter here"
                                    name="postcode"
                                  />

                                  <span className="errorInput">
                                    <ErrorMessage name="postcode" />
                                  </span>
                                </div>
                              </div>
                              <div className="col-sm-12">
                                <div className="input_froms">
                                  <label>Full Address</label>
                                  <Field
                                    type="text"
                                    placeholder="Enter here"
                                    name="address"
                                  />

                                  <span className="errorInput">
                                    <ErrorMessage name="address" />
                                  </span>
                                </div>
                              </div>

                              <div className="col-sm-12">
                                <div className="forget signer-forget new_check_uls">
                                  <label className="tick">
                                    Save this billing address
                                    <Field type="checkbox" name="save" />
                                    <span className="tickmark"></span>
                                  </label>
                                </div>
                              </div>
                            </>
                          )}

                          {radio === "2" && (
                            <>
                              {address?.length !== 0 ? (
                                address.map((e, i) => {
                                  return (
                                    <div className="col-sm-6" key={i}>
                                      <label
                                        className="tick"
                                        style={{
                                          position: "absolute",
                                          top: "28px",
                                          left: "25px",
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          value={addressCheckbox}
                                          onChange={(y) =>
                                            changeCheckbox(e?.id, y)
                                          }
                                          checked={e?.id === selectBox && true}
                                        />
                                        <span className="tickmark address_checkbox"></span>{" "}
                                      </label>
                                      <div
                                        className={`use_saved_box ${
                                          selectBox === e?.id && "selected"
                                        }`}
                                        onClick={() => selecttedBox(e?.id)}
                                      >
                                        <table className="mt-4">
                                          <tr>
                                            <td>Name</td>
                                            <td>
                                              {e?.first_name} {e?.last_name}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>Address</td>
                                            <td>
                                              {e?.address && e?.address + ","}{" "}
                                              {e?.city && e?.city + ","}{" "}
                                              {e?.state}
                                              {e?.postcode && "-" + e?.postcode}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>Phone</td>
                                            <td>{e?.mobile}</td>
                                          </tr>
                                          <tr>
                                            <td>Email</td>
                                            <td>{e?.email}</td>
                                          </tr>
                                        </table>
                                      </div>
                                      <a
                                        className="css-tooltip-top color-blue meet-rvw uu0 prod-del"
                                        onClick={() => openModal(e?.id)}
                                        style={{
                                          position: "absolute",
                                          top: "10px",
                                          right: "25px",
                                        }}
                                      >
                                        {" "}
                                        <p>Delete</p>
                                        <img
                                          src={rejectt}
                                          className="blue-show"
                                          alt=""
                                        />
                                      </a>
                                    </div>
                                  );
                                })
                              ) : (
                                <No_Data_Found />
                              )}
                            </>
                          )}
                          {((radio === "2" && address?.length !== 0) ||
                            radio === "1") && (
                            <div className="col-sm-12">
                              <div className="checkout_btns crd-chck-btn">
                                <button type="submit">Confirm and Pay</button>
                              </div>
                            </div>
                          )}
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
          </div>
        </div>
      </section>
      <div
        className={`modal fade ${show && "show"}`}
        style={{ display: show ? "block" : "none" }}
        id="exampleModalCenter"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div className="log-page">
                <div className="container">
                  <button type="button" className="close" onClick={closeModal}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <div className="log-page-inr">
                    <div className="login-box">
                      <div className="log-box-top">
                        <div className="loger-top for-got">
                          <h2>Remove Address</h2>
                        </div>
                        <div className="loger-inr">
                          <form action="" role="form">
                            <h3>
                              Are you sure you want to remove this address from
                              the address-list?
                            </h3>
                            <div className="d-flex">
                              <button
                                type="button"
                                className="log-sbmt bg-white text-dark border mt-4 mr-3"
                                onClick={closeModal}
                              >
                                {" "}
                                Cancle
                              </button>
                              <button
                                type="button"
                                className="log-sbmt mt-4"
                                onClick={deleteAddress}
                              >
                                {" "}
                                Remove
                              </button>
                            </div>
                          </form>
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
    </div>
  );
};

export default Gift_Card_Checkout;
