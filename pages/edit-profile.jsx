import React, { useEffect, useState } from "react";
import Sidemenu from "../Componets/Sidemenu/Sidemenu";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ApiGet, ApiPost } from "../Api/Api";
import moment from "moment";
import swal from "sweetalert";
import Loader from "../Componets/Loader/Loader";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { getPosts } from "../Redux/Apidemo/apiDemoSlice";
import Rectangle688 from "../assets/images/Rectangle688.png";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import or_edit from "../assets/images/or_edit.png";
import gr_edit from "../assets/images/gr_edit.png";
import calendar from "../assets/images/calendar.png";
import clickhe from "../assets/images/clickhe.png";


const Edit_Profile = () => {
  const dispatch = useDispatch();
  const [states, setStates] = useState([]);
  const [phoneStore, setPhoneStore] = useState("");
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);
  let userData = null;
  if (typeof window !== "undefined") {
    userData = JSON.parse(localStorage.getItem("userinfo"));
  }
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    state: "",
    city: "",
    postcode: "",
    address: "",
    country: "",
    phonecode: "",
    newsletter_receive: false,
  });
  const [selectDate, setSelectDate] = useState();
  const [country, setCountry] = useState([]);
  const [image, setImage] = useState("");
  const [sendImage, setSendImage] = useState("");
  const [errors, setError] = useState({});
  const [errorMsg, seterrorMsg] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [show, setShow] = useState(false);
  const bbb = country.map((e) => e?.phonecode);

  const bbbb = bbb.filter((e) => {
    if (e.includes(phoneStore?.replace("+", ""))) {
      return e;
    }
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    if (bbbb.includes(phoneStore?.replace("+", ""))) {
      setData({
        ...data,
        phonecode: phoneStore?.replace("+", ""),
      });
    }
  };
  const closeModal = () => setShow(false);
  var validRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const handlerChange = (e) => {
    if (e?.target?.name) {
      const { name, value } = e?.target;
      if (name === "newsletter_receive") {
        setData({ ...data, newsletter_receive: e.target.checked ? "Y" : "N" });
      } else {
        setData({
          ...data,
          [name]: value,
        });
      }
      if (name === "phonecode") {
        setData({
          ...data,
          phonecode: value,
          country: "",
        });
      }
    } else {
      setData({
        ...data,
        dob: e,
      });
      setSelectDate(e);
    }
  };
  const [countrySelect, setCountrySelect] = useState([]);
  useEffect(() => {
    setCountrySelect(country?.filter((e) => e?.phonecode === data?.phonecode));
    if (data && data.country && !data.phonecode) {
      setData({
        ...data,
        phonecode: data?.country.slice(-3, -1),
      });
    }
  }, [data?.phonecode]);

  const onImageChange = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setImage(img);

    setSendImage(e.target.files[0]);
  };

  const validateForm = () => {
    let errors = {};
    let formIsValid = true;
    if (!data?.first_name) {
      formIsValid = false;
      errors["first_name"] = "Please enter your first name";
    }
    if (!data?.last_name) {
      formIsValid = false;
      errors["last_name"] = "Please enter your last name";
    }
    if (!data?.phone) {
      formIsValid = false;
      errors["phone"] = "Please enter your phone number";
    }
    if (data?.phone?.length > 11) {
      formIsValid = false;
      errors["phone_number"] = "Invalid phone number";
    }
    if (data?.phone?.length <= 7) {
      formIsValid = false;
      errors["phone_number2"] = "Invalid phone number";
    }
    if (!data?.dob) {
      formIsValid = false;
      errors["dob"] = "Please select your dob";
    }
    if (!data?.address) {
      formIsValid = false;
      errors["address"] = "Please enter your address";
    }
    if (data?.postcode === "") {
      formIsValid = false;
      errors["postcode"] = "Please enter your postcode";
    }
    if (!data?.city) {
      formIsValid = false;
      errors["city"] = "Please enter your city";
    }
    if (!data?.state) {
      formIsValid = false;
      errors["state"] = "Please enter your state";
    }
    if (!data?.gender) {
      formIsValid = false;
      errors["gender"] = "Please Select your gender";
    }
    setError(errors);

    return formIsValid;
  };
  const validateForm2 = () => {
    let errors = {};
    let formIsValid = true;
    if (!newEmail) {
      formIsValid = false;
      errors["newEmail"] = "Please enter email";
    } else if (!newEmail.match(validRegex)) {
      formIsValid = false;
      errors["newEmails"] = "Invalid email address!";
    }
    setError(errors);
    return formIsValid;
  };
  const saveNewEmail = (e, y) => {
    y.preventDefault();
    if (validateForm2()) {
      setLoading(true);
      const body = {
        params: { email: newEmail, change_email_status: e },
      };
      ApiPost("change-email", body)
        .then((res) => {
          setLoading(false);
          if (res?.data?.error) {
            seterrorMsg(res?.data?.error?.meaning);
          } else if (res?.data?.result) {
            swal({
              title: "Success",
              text: res?.data?.result?.status?.meaning,
              icon: "success",
            });
            closeModal();
            ApiGet("email-change-status", {})
              .then((res) => {
                if (res?.data?.status) {
                  setEmailCode(res?.data?.status?.email_change_status);
                }
              })
              .catch(async (err) => {});
            setData(res?.data?.result?.userData);
            if (typeof window !== "undefined") {
              localStorage.setItem(
                "userinfo",
                JSON.stringify(res?.data?.result?.userData)
              );
            }
          }
        })
        .catch(async (err) => {});
    }
  };

  const saveAllData = () => {
    window.scrollTo(0, 0);
    if (validateForm()) {
      setLoading(true);
      var formData = new FormData();
      formData.append("first_name", data?.first_name);
      formData.append("last_name", data?.last_name);
      formData.append("email", data?.email);
      formData.append("phonecode", data?.phonecode);
      formData.append("phone", data?.phone);
      formData.append("gender", data?.gender);
      formData.append("dob", moment(data?.dob).format("yyyy/MM/DD"));
      formData.append(
        "country",
        countrySelect?.length === 1
          ? countrySelect[0]?.name
          : data?.country
          ? data?.country
          : countrySelect[0]?.name
      );
      formData.append("state", data?.state);
      formData.append("city", data?.city);
      formData.append("postcode", +data?.postcode);
      formData.append("address", data?.address);
      {
        sendImage && formData.append("profile_pic", sendImage);
      }
      formData.append("newsletter_receive", data?.newsletter_receive);

      ApiPost("edit-profile", formData)
        .then((res) => {
          if (res?.data?.result) {
            swal({
              title: "Success",
              text: res?.data?.result?.status?.meaning,
              icon: "success",
            });
            setData(res?.data?.result?.userData);
            if (typeof window !== "undefined") {
              localStorage.setItem(
                "userinfo",
                JSON.stringify(res?.data?.result?.userData)
              );
            }
            navigate.push("/");
          }
          setLoading(false);
        })
        .catch(async (err) => {
          setLoading(false);
        });
    }
  };
  const openModal = () => {
    if (
      data?.temp_email_verified === "Y" ||
      data?.temp_email_verified === null ||
      !emailCode ||
      emailCode === "2"
    ) {
      setShow(true);
    } else if (data?.temp_email_verified === "N" && emailCode === "0") {
      Swal.fire({
        title: "<strong>Warning</strong>",
        icon: "warning",
        html:
          "We have already send the email to complete the process (please check both inbox & spam folder), if still did not receive the message then " +
          "<a>Click Process button</a>" +
          " to receive the mail (again).",
        showCancelButton: true,
        confirmButtonText: "Process",
      }).then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          const body = {
            params: { change_email_status: true },
          };
          ApiPost("change-email", body)
            .then((res) => {
              setLoading(false);
              if (res?.data?.error) {
                seterrorMsg(res?.data?.error?.meaning);
              } else if (res?.data?.result) {
                swal({
                  title: "Success",
                  text: res?.data?.result?.success,
                  icon: "success",
                });
                closeModal();
                ApiGet("email-change-status", {}).then((res) => {
                  if (res?.data?.status) {
                    setEmailCode(res?.data?.status?.email_change_status);
                  }
                });
              }
            })
            .catch(async (err) => {});
        }
      });
    } else if (data?.temp_email_verified === "N" && emailCode === "1") {
      Swal.fire({
        title: "<strong>Warning</strong>",
        icon: "warning",
        html:
          "We have already send the email to complete the process (please check both inbox & spam folder), if still did not receive the message then " +
          "<a>Click Process button</a>" +
          " to receive the mail (again).",
        showCancelButton: true,
        confirmButtonText: "Process",
      }).then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          const body = {
            params: { change_email_status: true },
          };
          ApiPost("change-email", body)
            .then((res) => {
              setLoading(false);
              if (res?.data?.error) {
                seterrorMsg(res?.data?.error?.meaning);
              } else if (res?.data?.result) {
                swal({
                  title: "Success",
                  text: res?.data?.result?.success,
                  icon: "success",
                });
                closeModal();
                ApiGet("email-change-status", {}).then((res) => {
                  if (res?.data?.status) {
                    setEmailCode(res?.data?.status?.email_change_status);
                  }
                });
              }
            })
            .catch(async (err) => {});
        }
      });
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    if (userData) {
      setLoading(true);
      ApiPost("user-details", {}).then((res) => {
        if (res?.data?.result) {
          setData(res?.data?.result?.userData);
          setImage(
            res?.data?.result?.userData?.profile_image && {
              preview:
                "https://artdevotee.com/preview/storage/app/public/profile_picture/" +
                res?.data?.result?.userData?.profile_image,
            }
          );
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "userinfo",
              JSON.stringify(res?.data?.result?.userData)
            );
          }
          setLoading(false);
        }
      });
      ApiPost("country-list", {}).then((res) => {
        if (res?.data?.result) {
          setCountry(res?.data?.result?.country_list);
          setStates(res?.data?.result?.state_list);
          setLoading(false);
        }
      });
      ApiGet("email-change-status", {}).then((res) => {
        if (res?.data?.status) {
          setEmailCode(res?.data?.status?.email_change_status);
        }
      });
    }
  }, []);
  return (
    <>
      <Head>
        <title>Edit Profile - Artdevotee</title>
        <meta name="description" content="Edit Profile - Artdevotee" />
        <meta property="og:title" content="Edit Profile - Artdevotee" />
        <meta property="og:description" content="Edit Profile - Artdevotee" />
        <meta
          property="og:image"
          content="https://artdevotee.com /images/how-bnr.png"
        />
        <link rel="canonical" href="https://artdevotee.com/edit-profile" />
      </Head>
      <div className={`${show && "modal-open"}`}>
        {loading && <Loader />}
        <div className="dashbord_sec">
          <div className="container">
            <div className="dashbord_inr">
              <Sidemenu />
              <div className="dashbord_right">
                <div className="dashbord_right_ir">
                  <div className="dash_headings_div">
                    {" "}
                    <h1>Edit Profile </h1>
                  </div>
                  <div className="dashbord_frm">
                    <div className="row">
                      <div className="col-sm-6 col-md-4 col-lg-6 col-xl-4">
                        <div className="input_froms">
                          <label>
                            First Name <span>*</span>{" "}
                          </label>
                          <input
                            type="text"
                            placeholder="Enter here"
                            name="first_name"
                            value={data?.first_name}
                            onChange={handlerChange}
                          />
                        </div>
                        <span className="errorInput">
                          {data?.first_name?.length > 0
                            ? ""
                            : errors["first_name"]}
                        </span>
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-6 col-xl-4">
                        <div className="input_froms">
                          <label>
                            Last Name <span>*</span>{" "}
                          </label>
                          <input
                            type="text"
                            placeholder="Enter here"
                            name="last_name"
                            value={data?.last_name}
                            onChange={handlerChange}
                          />
                          <span className="errorInput">
                            {data?.last_name?.length > 0
                              ? ""
                              : errors["last_name"]}
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-6 col-xl-4">
                        <div className="input_froms">
                          <label>
                            Email address <span>*</span>{" "}
                          </label>
                          <div className="po_real">
                            <input
                              type="text"
                              className="pr-5"
                              placeholder="Enter here"
                              name="email"
                              value={data?.email}
                              onChange={handlerChange}
                              disabled
                            />
                            <span className="absoul_spans">
                              <a className="pointer" onClick={openModal}>
                                <img
                                  src={or_edit}
                                  alt=""
                                  className="hoverb"
                                />
                                <img
                                  src={gr_edit}
                                  alt=""
                                  className="hovern"
                                />
                              </a>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-6 col-xl-4">
                        <div className="input_froms">
                          <label>
                            Phone Number <span>*</span>{" "}
                          </label>
                          <div className="po_real">
                            <input
                              type="number"
                              placeholder="Enter here"
                              className="phone_drops"
                              name="phone"
                              value={data?.phone}
                              onChange={handlerChange}
                            />

                            <span className="errorInput">
                              {data?.phone?.length > 0 ? "" : errors["phone"]}
                            </span>
                            <span className="errorInput">
                              {data?.phone?.length < 12
                                ? ""
                                : errors["phone_number"]}
                            </span>
                            <span className="errorInput">
                              {data?.phone?.length > 5
                                ? ""
                                : errors["phone_number2"]}
                            </span>
                            <span className="select_spans">
                              <div className="form-group sort-frm">
                                <a className="sort_open">
                                  {data?.phonecode
                                    ? "+" + data?.phonecode
                                    : "select"}
                                </a>
                                <div className="sort_lst show_phone_code">
                                  <form onSubmit={handleSubmit}>
                                    <input
                                      className="phone_input"
                                      value={phoneStore}
                                      onChange={(e) => {
                                        setPhoneStore(e?.target?.value);
                                      }}
                                    />
                                    <button className="d-none" type="submit">
                                      Submit
                                    </button>
                                  </form>
                                  <ul className="sort_open show_phone_code_list">
                                    {phoneStore &&
                                      [...new Set(bbbb)]?.map((e, i) => (
                                        <li key={i}>
                                          <a
                                            onClick={() => {
                                              setData({
                                                ...data,
                                                phonecode: e,
                                              });
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
                                              setData({
                                                ...data,
                                                phonecode: e,
                                              });
                                            }}
                                          >
                                            +{e}
                                          </a>
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              </div>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-6 col-xl-4">
                        <div className="input_froms">
                          <label>
                            Gender <span>*</span>
                          </label>
                          <select
                            name="gender"
                            value={data?.gender}
                            onChange={handlerChange}
                          >
                            <option value="">select</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                          </select>
                          <span className="errorInput">
                            {data?.gender?.length > 0 ? "" : errors["gender"]}
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-6 col-xl-4">
                        <div className="input_froms">
                          <label>
                            D.O.B <span>*</span>{" "}
                          </label>
                          <div className="po_real">
                            <DatePicker
                              placeholderText="Enter here"
                              selected={selectDate}
                              name="dob"
                              value={
                                data?.dob &&
                                moment(data?.dob).format("DD/MM/yyyy")
                              }
                              maxDate={moment().subtract(18, "years")._d}
                              onChange={handlerChange}
                              dateFormat="dd/MM/yyyy"
                              className="form-control"
                              dropdownMode="select"
                              showMonthDropdown
                              showYearDropdown
                              adjustDateOnChange
                            />
                            <span className="absoul_spans">
                              <img src={calendar} alt="" />
                            </span>
                            <span className="errorInput">
                              {data?.dob ? "" : errors["dob"]}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-12 col-lg-12">
                        <div className="uplodimg edit-prof-big">
                          <span>Profile Image</span>
                          <div className=" img-upld">
                            <div className="uplodimgfil">
                              <input
                                type="file"
                                name="file-1[]"
                                id="file-1"
                                className="inputfile inputfile-1"
                                data-multiple-caption="{count} files selected"
                                multiple
                                onChange={onImageChange}
                              />

                              <label for="file-1">
                                Click here to upload{" "}
                                <img src={clickhe} alt="" />
                              </label>
                            </div>
                            <div className="uplodimg_pick">
                              {!image?.preview ? (
                                <img src={Rectangle688} alt="" />
                              ) : (
                                <img src={image?.preview} alt="" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h3 className="das_headingds">Address Info</h3>

                    <div className="row">
                      <div className="col-sm-6 col-md-4 col-lg-6 col-xl-4">
                        <div className="input_froms">
                          <label>
                            Country <span>*</span>
                          </label>
                          <select
                            name="country"
                            value={data?.country}
                            onChange={handlerChange}
                            style={{
                              fontSize:
                                countrySelect.length === 0 ? "13px" : "15px",
                            }}
                          >
                            {countrySelect.length !== 0 &&
                              countrySelect?.map((e, i) => (
                                <option value={e?.name} key={i}>
                                  {e?.name}
                                </option>
                              ))}
                            {countrySelect.length === 0 && (
                              <option value="">
                                Please enter phone number first
                              </option>
                            )}
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-6 col-xl-4">
                        <div className="input_froms">
                          <label>
                            State <span>*</span>
                          </label>
                          <select
                            disabled={data?.phonecode === "91" ? false : true}
                            placeholder="Enter here"
                            name="state"
                            value={data?.phonecode === "91" ? data?.state : ""}
                            onChange={handlerChange}
                          >
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
                          </select>
                          <span className="errorInput">
                            {data?.state?.length > 0 ? "" : errors["state"]}
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-6 col-xl-4">
                        <div className="input_froms">
                          <label>
                            City <span>*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Enter here"
                            name="city"
                            value={data?.city}
                            onChange={handlerChange}
                          />
                          <span className="errorInput">
                            {data?.city?.length > 0 ? "" : errors["city"]}
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-6 col-xl-4">
                        <div className="input_froms">
                          <label>
                            Post Code <span>*</span>
                          </label>
                          <input
                            type="number"
                            placeholder="Enter here"
                            name="postcode"
                            value={data?.postcode}
                            onChange={handlerChange}
                          />
                          <span className="errorInput">
                            {data?.postcode?.length > 0
                              ? ""
                              : errors["postcode"]}
                          </span>
                        </div>
                      </div>

                      <div className="col-sm-12 col-md-8 col-lg-12 col-xl-8">
                        <div className="input_froms">
                          <label>
                            Full Address <span>*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Enter here"
                            name="address"
                            value={data?.address}
                            onChange={handlerChange}
                          />
                          <span className="errorInput">
                            {data?.address?.length > 0 ? "" : errors["address"]}
                          </span>
                        </div>
                      </div>
                      <div
                        className="col-sm-12 col-md-8 col-lg-12 col-xl-8"
                        style={{ marginTop: "10px" }}
                      >
                        <label className="tick">
                          Do you want to receive the newsletter?
                          <input
                            type="checkbox"
                            name="newsletter_receive"
                            value={data?.newsletter_receive}
                            onChange={handlerChange}
                            checked={data?.newsletter_receive === "Y" && true}
                          />
                          <span className="tickmark"></span>
                        </label>
                      </div>
                    </div>

                    <div className="boirder"></div>
                    <div className="edit-frm-btns">
                      <button
                        type="submit"
                        className="save"
                        onClick={saveAllData}
                      >
                        Save all changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="clearfix"></div>
            </div>
          </div>
        </div>

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
                    <button
                      type="button"
                      className="close"
                      onClick={closeModal}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                    <div className="log-page-inr">
                      <div className="login-box">
                        <div className="log-box-top">
                          {errorMsg && <h6 className="errorMsg">{errorMsg}</h6>}
                          <div className="loger-top for-got">
                            <h2>Change Email</h2>
                          </div>
                          <div className="loger-inr">
                            <form
                              action=""
                              role="form"
                              onSubmit={(e) => saveNewEmail(false, e)}
                            >
                              <div className="log-inpt">
                                <label for="exampleInputEmail1">
                                  New Email address
                                </label>
                                <input
                                  type="email"
                                  className="form-control"
                                  placeholder="Enter email"
                                  value={newEmail}
                                  onChange={(e) => setNewEmail(e.target.value)}
                                />
                                <span className="errorInput">
                                  {newEmail?.length > 0
                                    ? ""
                                    : errors["newEmail"]}
                                </span>
                                <span className="errorInput">
                                  {newEmail.match(validRegex)
                                    ? ""
                                    : errors["newEmails"]}
                                </span>
                              </div>
                              <button type="submit" className="log-sbmt mt-2">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit_Profile;
