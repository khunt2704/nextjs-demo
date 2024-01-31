import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
// import Image from "next/future/image";
import { useRouter } from "next/router";
import Head from "next/head";
import swal from "sweetalert";
import { ApiGet, ApiPost, getFileImage } from "../Api/Api";
import Loader from "../Componets/Loader/Loader";
import No_Data_Found from "../Componets/No_data_found/No_Data_Found";
import { getPosts } from "../Redux/Apidemo/apiDemoSlice";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import FormikErrorFocus from "formik-error-focus";
import rejectt from "../assets/images/rejectt.png";
import def from "../assets/images/default.png";


const Checkout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [coupon, setCoupon] = useState({});
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const currency = useSelector((state) => state?.currency?.currency);

  const [phoneStore, setPhoneStore] = useState("");
  const [addressCheckbox, setAddressCheckbox] = useState(false);
  const [radio, setRadio] = useState("1");
  const [country, setCountry] = useState([]);
  const [selectBox, setSelectBox] = useState(0);
  const calling_code = useSelector((state) => state?.currency?.calling_code);
  const [address, setAddress] = useState([]);
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
  useEffect(() => {
    setCoupon(router?.query?.coupon && JSON.parse(router?.query?.coupon));
    setData(router?.query?.data && JSON.parse(router?.query?.data));
    window.scrollTo(0, 0);
    setLoading(true);
    ApiPost("country-list", {})
      .then((res) => {
        setLoading(false);
        if (res?.data?.result) {
          setCountry(res?.data?.result?.country_with_code);
        }
      })
      .catch(async (err) => {
        setLoading(false);
      });
    ApiGet("address-list")
      .then((res) => {
        setLoading(false);

        if (res?.data?.details) {
          setAddress(res?.data?.details);
        }
      })
      .catch(async (err) => {
        setLoading(false);
      });
  }, [router.isReady]);

  var totalPrice = coupon?.total_price_after_deduction
    ? coupon?.total_price_after_deduction
    : coupon?.total_price_after_deduction === 0
    ? 0
    : data?.total_after_discount;

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
  // useEffect(() => {

  // }, []);
  const openDetailsPage = (e) => {
    router.push({
      pathname: `/product-detail/${e?.get_product_details?.slug}`,
      query: {
        image: e?.get_product_details?.get_product_display_images,
      },
    });
  };
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
    radio_check: false,
    rfname: "",
    remail: "",
    rlname: "",
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
    radio_check: Yup.boolean(),
    rfname: Yup.string().when("radio_check", {
      is: true,
      then: Yup.string().required("Please enter receiver first name!"),
    }),
    remail: Yup.string().when("radio_check", {
      is: true,
      then: Yup.string()
        .required("Please enter your receiver email address!")
        .email("Please enter a valid email address!")
        .nullable(),
    }),
    rlname: Yup.string().when("radio_check", {
      is: true,
      then: Yup.string().required("Please enter receiver last name!"),
    }),
  });
  const onSubmit = async (values, actions) => {
    if (values.radios === "1") {
      setLoading(true);
      let formData = new FormData();
      formData.append("is_save_address", values?.save ? "Y" : "N");
      formData.append("is_saved_billing_address", "N");
      formData.append("billing_fname", values?.first_name);
      formData.append("billing_lname", values?.last_name);
      formData.append("billing_street_address", values?.address);
      formData.append(
        "billing_country",
        country?.filter((e) => e?.name === values?.country)[0]?.id
      );
      formData.append("billing_address_line2", values?.state);
      formData.append("billing_city", values?.city);
      formData.append("billing_postcode", values?.postcode);
      formData.append("billing_email", values?.email);
      formData.append("billing_phone", values?.phone);
      formData.append("total_amount", totalPrice);
      formData.append("is_gift", values.radio_check === true ? "Y" : "N");
      {
        values.radio_check === true &&
          formData.append("gift_fname", values?.rfname);
      }
      {
        values.radio_check === true &&
          formData.append("gift_lname", values?.rlname);
      }
      {
        values.radio_check === true &&
          formData.append("gift_email", values?.remail);
      }
      formData.append("currency_code", calling_code);
      formData.append("total_payable_amount", data?.total_after_discount);
      formData.append(
        "gift_card_id",
        coupon?.gcard_details?.id ? coupon?.gcard_details?.id : ""
      );
      formData.append(
        "coupon_code",
        coupon?.coupon_details?.id ? coupon?.coupon_details?.id : ""
      );
      ApiPost("order-place", formData)
        .then((res) => {
          if (res?.data?.order && res?.data?.order?.order_number) {
            dispatch(getPosts());
            router.push(`/payment/${res?.data?.order?.order_number}/O`);
          }
          setLoading(false);
        })
        .catch(async (err) => {
          setLoading(false);
        });
    } else if (selectBox === 0 && address?.length !== 0 && radio === "2") {
      swal({
        title: "Warning",
        text: "Please Select Address",
        icon: "warning",
      });
      // actions.resetForm();
    } else if (selectBox !== 0 && address?.length !== 0) {
      setLoading(true);
      let formData = new FormData();
      formData.append("is_saved_billing_address", "Y");
      formData.append("address_book_id", selectBox);
      formData.append("total_amount", totalPrice);
      formData.append("currency_code", calling_code);
      formData.append("is_gift", values.radio_check === true ? "Y" : "N");
      {
        values.radio_check === true &&
          formData.append("gift_fname", values?.rfname);
      }
      {
        values.radio_check === true &&
          formData.append("gift_lname", values?.rlname);
      }
      {
        values.radio_check === true &&
          formData.append("gift_email", values?.remail);
      }
      formData.append("total_payable_amount", data?.total_after_discount);
      formData.append(
        "gift_card_id",
        coupon?.gcard_details?.id ? coupon?.gcard_details?.id : ""
      );
      formData.append(
        "coupon_code",
        coupon?.coupon_details?.id ? coupon?.coupon_details?.id : ""
      );

      ApiPost("order-place", formData)
        .then((res) => {
          if (res?.data?.order && res?.data?.order?.order_number) {
            dispatch(getPosts());
            router.push(`/payment/${res?.data?.order?.order_number}/O`)
            
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
  };
  //Subarna 19-10-22
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
        <title>Checkout - Artdevotee</title>
        <meta name="description" content="Checkout - Artdevotee" />
        <meta property="og:title" content="Checkout - Artdevotee" />
        <meta property="og:description" content="Checkout - Artdevotee" />
        <meta
          property="og:image"
          content="https://artdevotee.com /images/how-bnr.png"
        />
        <link rel="canonical" href="https://artdevotee.com/checkout" />
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
                <li>Checkout</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="product-section new_en_sec">
        <div className="container">
          <div className="row no-gutters">
            <div className="check_out_lefts">
              <div className="product_checkout_infos">
                <div className="checkout_headings">
                  <h2>Product Information</h2>
                </div>
                <div className="details_order_prod_info">
                  {data?.get_cart_details?.length !== 0 ? (
                    data?.get_cart_details?.map((e, i) => {
                      return (
                        <div className="produ_infos" key={i}>
                          <span className="squer_boxx">
                            {e?.get_product_details?.get_product_display_images
                              ?.length !== 0 ? (
                              <img
                                className="pointer"
                                src={getFileImage(
                                  e?.get_product_details?.get_product_display_images
                                    ?.filter(
                                      (e) => e?.is_default_display === "1"
                                    )
                                    ?.shift()?.thumbnail_image
                                )}
                                onClick={() => openDetailsPage(e)}
                                alt=""
                              />
                            ) : (
                              <img src={def} alt="" />
                            )}
                          </span>
                          <div className="order_details_dash">
                            <h3
                              className="pointer"
                              onClick={() => openDetailsPage(e)}
                            >
                              {e?.get_product_details?.title}
                            </h3>
                            <p>
                              Product Code: {e?.get_product_details?.product_id}
                            </p>

                            <div className="dash_pps">
                              <p>
                                {currency &&
                                e?.get_product_details?.get_product_price?.filter(
                                  (e) => e?.get_currency?.symbol === currency
                                )[0]?.global_offer_applied === "Y"
                                  ? currency &&
                                    currency +
                                      e?.get_product_details?.get_product_price?.filter(
                                        (e) =>
                                          e?.get_currency?.symbol === currency
                                      )[0]?.price
                                  : e?.get_product_details?.get_product_price?.filter(
                                      (e) =>
                                        e?.get_currency?.symbol === currency
                                    )[0]?.discount &&
                                    currency +
                                      e?.get_product_details?.get_product_price?.filter(
                                        (e) =>
                                          e?.get_currency?.symbol === currency
                                      )[0]?.price}
                              </p>
                              <h5>
                                {currency &&
                                  currency +
                                    (e?.get_product_details?.get_product_price?.filter(
                                      (e) =>
                                        e?.get_currency?.symbol === currency
                                    )[0]?.global_offer_applied === "Y"
                                      ? e?.get_product_details?.get_product_price?.filter(
                                          (e) =>
                                            e?.get_currency?.symbol === currency
                                        )[0]?.after_discount_price
                                      : e?.get_product_details?.get_product_price?.filter(
                                          (e) =>
                                            e?.get_currency?.symbol === currency
                                        )[0]?.discount
                                      ? e?.get_product_details?.get_product_price?.filter(
                                          (e) =>
                                            e?.get_currency?.symbol === currency
                                        )[0]?.after_discount_price
                                      : e?.get_product_details?.get_product_price?.filter(
                                          (e) =>
                                            e?.get_currency?.symbol === currency
                                        )[0]?.price
                                      ? e?.get_product_details?.get_product_price?.filter(
                                          (e) =>
                                            e?.get_currency?.symbol === currency
                                        )[0]?.price
                                      : 0)}
                              </h5>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <No_Data_Found />
                  )}
                </div>
              </div>

              <div className="product_checkout_infos">
                <div className="checkout_headings">
                  <h2>Payment Details</h2>
                </div>
                <div className="check_subtotal_sec">
                  <div className="sub_total_check">
                    <p>Subtotal</p>
                    <h6>
                      {currency && currency + data?.total_before_discount}
                    </h6>
                  </div>
                  <div className="sub_total_check">
                    <p>Discount</p>
                    <h6>
                      {currency &&
                        totalPrice &&
                        currency +
                          (data?.total_before_discount - totalPrice)?.toFixed(
                            2
                          )}
                    </h6>
                  </div>
                </div>
                <div className="check_total_sec">
                  <div className="check_pro_totals">
                    <h4>Total Payable Amount : </h4>
                    <p>
                      {currency &&
                        totalPrice &&
                        currency + JSON.parse(totalPrice)?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="check_out_rights">
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
                            <div className="input_froms_radio ">
                              <label
                                className="radio"
                                onClick={() => setRadio("1")}
                              >
                                <input
                                  id="radio1"
                                  type="radio"
                                  name="radios"
                                  value="1"
                                  onClick={() => setFieldValue("radios", "1")}
                                  checked={radio === "1"}
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
                              {radio === "1" && (
                                <div className="col-sm-12">
                                  <div className="forget signer-forget new_check_uls">
                                    <label className="tick">
                                      Save this billing address
                                      <Field type="checkbox" name="save" />
                                      <span className="tickmark"></span>
                                    </label>
                                  </div>
                                </div>
                              )}
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
                                            <td
                                              style={{ paddingRight: "34px" }}
                                            >
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
                          {!coupon?.gcard_details?.id &&
                            !coupon?.coupon_details?.id && (
                              <>
                                {(radio === "1" ||
                                  (radio === "2" && address?.length !== 0)) && (
                                  <div className="col-sm-12">
                                    <div className="forget signer-forget new_check_uls">
                                      <label className="tick">
                                        Gift to Other
                                        <Field
                                          type="checkbox"
                                          name="radio_check"
                                          onChange={() => {
                                            setFieldValue(
                                              "radio_check",
                                              !values.radio_check
                                            );
                                            if (values.radio_check == false) {
                                              setFieldValue("rfname", "");
                                              setFieldValue("rlname", "");
                                              setFieldValue("remail", "");
                                            }
                                          }}
                                        />
                                        <span className="tickmark"></span>
                                      </label>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          {values.radio_check === true && (
                            <>
                              <div className="col-sm-6">
                                <div className="input_froms">
                                  <label>Receiver first name</label>
                                  <Field
                                    type="text"
                                    placeholder="Enter here"
                                    name="rfname"
                                  />

                                  <span className="errorInput">
                                    <ErrorMessage name="rfname" />
                                  </span>
                                </div>
                              </div>
                              <div className="col-sm-6">
                                <div className="input_froms">
                                  <label>Receiver last name</label>
                                  <Field
                                    type="text"
                                    placeholder="Enter here"
                                    name="rlname"
                                  />

                                  <span className="errorInput">
                                    <ErrorMessage name="rlname" />
                                  </span>
                                </div>
                              </div>
                              <div className="col-sm-6">
                                <div className="input_froms">
                                  <label>Receiver email</label>
                                  <Field
                                    type="text"
                                    placeholder="Enter here"
                                    name="remail"
                                  />

                                  <span className="errorInput h_20check">
                                    <ErrorMessage name="remail" />
                                  </span>
                                </div>
                              </div>
                            </>
                          )}
                          <div className="col-sm-12">
                            <div className="checkout_btns">
                              <button type="submit">Confirm and Pay</button>

                              <button
                                className="border_btns"
                                onClick={() => router.push("/search-product")}
                              >
                                Continue shopping
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

export default Checkout;
