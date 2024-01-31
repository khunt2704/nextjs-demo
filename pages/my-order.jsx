import { Pagination } from "@mui/material";
import { Stack } from "@mui/system";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ApiPost } from "../Api/Api";
import Sidemenu from "../Componets/Sidemenu/Sidemenu";
import DatePicker from "react-datepicker";
import Loader from "../Componets/Loader/Loader";
import No_Data_Found from "../Componets/No_data_found/No_Data_Found";
import Head from "next/head";
import { useRouter } from "next/router";
// import Image from "next/future/image";
import calendar from "../assets/images/calendar.png"
import search1 from "../assets/images/search1.png"

const My_Order = () => {
  const currency = useSelector((state) => state?.currency?.currency);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState([]);
  const [gift, setGift] = useState([]);
  const [receivegift, setReceiveGift] = useState([]);
  const [status, setStatus] = useState("");
  const [from_date, setFrom_date] = useState("");
  const [end_date, setEnd_date] = useState("");
  const [totalpage, settotalpage] = useState(1);
  const [currentpage, setcurrentpage] = useState(1);
  const [status2, setStatus2] = useState("");
  const [from_date2, setFrom_date2] = useState("");
  const [end_date2, setEnd_date2] = useState("");
  const [totalpage2, settotalpage2] = useState(1);
  const [currentpage2, setcurrentpage2] = useState(1);
  const [status3, setStatus3] = useState("");
  const [from_date3, setFrom_date3] = useState("");
  const [end_date3, setEnd_date3] = useState("");
  const [totalpage3, settotalpage3] = useState(1);
  const [currentpage3, setcurrentpage3] = useState(1);
  const handlePageChange = (e, i) => {
    getOrder(i, status, from_date, end_date);
  };
  const handlePageChange2 = (e, i) => {
    getGift(i, status2, from_date2, end_date2);
  };
  const handlePageChange3 = (e, i) => {
    getGift(i, status3, from_date3, end_date3);
  };
  const getOrder = (p, s, f, e) => {
    setLoading(true);
    const body = {
      params: {
        page_no: p,
        status: s,
        from_date: f ? moment(f)?.format("yyyy-MM-DD") : "",
        to_date: e ? moment(e)?.format("yyyy-MM-DD") : "",
      },
    };
    ApiPost("order-history", body)
      .then((res) => {
        if (res?.data?.orderlist) {
          setOrder(res?.data?.orderlist);
          settotalpage(res?.data?.page_count);
          setcurrentpage(res?.data?.page_no);
        }
        setLoading(false);
      })
      .catch(async (err) => {
        setLoading(false);
      });
  };
  const getGift = (p, s, f, e) => {
    setLoading(true);
    const body = {
      params: {
        page_no: p,
        status: s,
        from_date: f ? moment(f)?.format("yyyy-MM-DD") : "",
        to_date: e ? moment(e)?.format("yyyy-MM-DD") : "",
      },
    };
    ApiPost("my-gifts", body)
      .then((res) => {
        if (res?.data?.orderlist) {
          setGift(res?.data?.orderlist);
          settotalpage2(res?.data?.page_count);
          setcurrentpage2(res?.data?.page_no);
        }
        setLoading(false);
      })
      .catch(async (err) => {
        setLoading(false);
      });
  };
  const receiveGift = (p, s, f, e) => {
    setLoading(true);
    const body = {
      params: {
        page_no: p,
        status: s,
        from_date: f ? moment(f)?.format("yyyy-MM-DD") : "",
        to_date: e ? moment(e)?.format("yyyy-MM-DD") : "",
      },
    };
    ApiPost("my-received-gifts", body)
      .then((res) => {
        if (res?.data?.orderlist) {
          setReceiveGift(res?.data?.orderlist);
          settotalpage3(res?.data?.page_count);
          setcurrentpage3(res?.data?.page_no);
        }
        setLoading(false);
      })
      .catch(async (err) => {
        setLoading(false);
      });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById("London").style.display = "block";
    getOrder(currentpage, status, from_date, end_date);
    getGift(currentpage2, status2, from_date2, end_date2);
    receiveGift(currentpage3, status3, from_date3, end_date3);
  }, []);
  function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  }
  return (
    <div>
      <Head>
        <title>My Order - Artdevotee</title>
        <meta
            name="description"
            content="My Order - Artdevotee"
        />
        <meta property="og:title" content="My Order - Artdevotee" />
        <meta property="og:description" content="My Order - Artdevotee" />
        <meta property="og:image" content="https://artdevotee.com /images/how-bnr.png" />
        <link rel="canonical" href="https://artdevotee.com/my-order" />
      </Head>
      {loading && <Loader />}
      <div className="dashbord_sec">
        <div className="container">
          <div className="dashbord_inr">
            <Sidemenu />
            <div className="dashbord_right">
              <div className="dashbord_right_ir">
                <div className="dash_headings_div pad-no">
                  <div className="tab ordr-lst001 d-flex">
                    <button
                      className="tablinks active"
                      onClick={(e) => openCity(e, "London")}
                    >
                      <h1>My&nbsp;Order</h1>
                    </button>
                    <button
                      className="tablinks"
                      onClick={(e) => openCity(e, "Paris")}
                    >
                      <h1>My&nbsp;Gifts</h1>
                    </button>
                    <button
                      className="tablinks"
                      onClick={(e) => openCity(e, "canada")}
                    >
                      <h1>Receive&nbsp;Gifts</h1>
                    </button>
                  </div>
                </div>

                {/* <!-- Tab content --> */}
                <div id="London" className="tabcontent ordr-tab001">
                  <div className="dashbord_frm">
                    <form action="">
                      <div className="row">
                        <div className="col-sm-6 col-md-4 col-lg-6 col-xl-4">
                          <div className="input_froms">
                            <label>Status</label>
                            <select
                              value={status}
                              onChange={(e) => setStatus(e?.target?.value)}
                            >
                              <option value="">Select</option>
                              <option value="N">Failed</option>
                              <option value="Y">Completed</option>
                              <option value="I">Initiated</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-4 col-lg-6 col-xl-3">
                          <div className="input_froms">
                            <label>From date </label>
                            <div className="po_real">
                              {/* <input type="text" placeholder="From date" id="datepicker" /> */}
                              <DatePicker
                                placeholderText="From Date"
                                name="dob"
                                selected={from_date}
                                value={from_date}
                                onChange={(e) => setFrom_date(e)}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                dropdownMode="select"
                                showMonthDropdown
                                showYearDropdown
                                adjustDateOnChange
                              />
                              <span className="absoul_spans">
                                <img
                                  src={
                                    calendar
                                  }
                                  alt=""
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 col-md-4 col-lg-6 col-xl-3">
                          <div className="input_froms">
                            <label>To date </label>
                            <div className="po_real">
                              {/* <input type="text" placeholder="To date" id="datepicker2" /> */}
                              <DatePicker
                                placeholderText="To Date"
                                name="dob"
                                selected={end_date}
                                value={end_date}
                                onChange={(e) => setEnd_date(e)}
                                dateFormat="dd/MM/yyyy"
                                minDate={from_date}
                                className="form-control"
                                dropdownMode="select"
                                showMonthDropdown
                                showYearDropdown
                                adjustDateOnChange
                              />
                              <span className="absoul_spans">
                                <img
                                  src={
                                    calendar
                                  }
                                  alt=""
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 col-md-4 col-lg-6 col-xl-2">
                          <button
                            className="sea_btns btn-order"
                            type="button"
                            onClick={() =>
                              getOrder(currentpage, status, from_date, end_date)
                            }
                          >
                            <img
                              src={
                                search1
                              }
                              alt=""
                            />{" "}
                            Search
                          </button>
                        </div>
                        <div className="col-12">
                          <p className="multiple">
                            You can download a product multiple times within{" "}
                            <span>3 months</span> from the Order date. The
                            download link would get deactivated after 90 days.
                          </p>
                          <span className="o_info">Please click and open following order(s) to view details and to access Product download link.</span>
                        </div>
                      </div>
                    </form>

                    <div className="profile-form meet-page-prof com_pad_tablle payment_areaa">
                      <div className="new-table-mr">
                        <div className="table">
                          <div className="one_row1 hidden-sm-down only_shawo">
                            <div className="cell1 tab_head_sheet">Order Info</div>
                            <div className="cell1 tab_head_sheet">Order Date</div>
                            <div className="cell1 tab_head_sheet">Order Amount</div>
                            <div className="cell1 tab_head_sheet">
                              Payment Status
                            </div>
                          </div>
                          {/* <!-- --------------------row-1------------------------------------ --> */}
                          {order?.length !== 0 &&
                            order?.map((e,i) => {
                              return (
                                <div className="one_row1 small_screen31" key={i}>
                                  <div className="cell1 tab_head_sheet_1 half-boxes">
                                    <span className="W55_1 new_adb">
                                      Product Info
                                    </span>
                                    <div className="produ_infos">
                                      <div className="order_details_dash w-op">
                                        <h3>
                                          <a
                                          onClick={() =>
                                            router.push({
                                              pathname: "/order-details",
                                              query: {
                                                order_master_id: e?.id,
                                              },
                                            })
                                          }
                                            
                                          >
                                            Order Id : #{e?.order_number}
                                          </a>
                                        </h3>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="cell1 tab_head_sheet_1">
                                    <span className="W55_1">Order Date</span>
                                    <p className="add_ttrr">{e?.order_date}</p>
                                  </div>
                                  <div className="cell1 tab_head_sheet_1">
                                    <span className="W55_1">Order Amount</span>
                                    <p className="add_ttrr">
                                      {currency &&
                                        currency +
                                          (e?.total_amount &&
                                            JSON.parse(
                                              e?.total_amount
                                            )?.toFixed(2))}
                                    </p>
                                  </div>
                                  <div className="cell1 tab_head_sheet_1 half-boxes">
                                    <span className="W55_1">Status</span>
                                    {e?.is_paid === "N" &&  e?.status !== "I" &&(
                                     <p className="add_ttrr red_colors">Failed</p>
                                    )}
                                    {e?.is_paid === "Y" && e?.status !== "I" &&(
                                      <p className="add_ttrr ren_colors">
                                        Complete
                                      </p>
                                    )}
                                    {e?.status === "I" && (
                                      <p className="add_ttrr yel_colors">
                                        Initiated
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                        {order?.length === 0 && <No_Data_Found />}
                      </div>
                      {totalpage > 1 && (
                        <Stack spacing={2}>
                          <Pagination
                            count={totalpage}
                            page={currentpage}
                            onChange={handlePageChange}
                            variant="outlined"
                            shape="rounded"
                            className="pagination_ pag-box meet-pag smllr mt-2 mb-2"
                          />
                        </Stack>
                      )}
                    </div>
                  </div>
                </div>

                <div id="Paris" className="tabcontent ordr-tab001">
                  <div className="dashbord_frm">
                    <form action="">
                      <div className="row">
                        <div className="col-sm-6 col-md-4 col-lg-6 col-xl-4">
                          <div className="input_froms">
                            <label>Status</label>
                            <select
                              value={status2}
                              onChange={(e) => setStatus2(e?.target?.value)}
                            >
                              <option value="">Select</option>
                              <option value="N">Failed</option>
                              <option value="Y">Completed</option>
                              <option value="I">Initiated</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-4 col-lg-6 col-xl-3">
                          <div className="input_froms">
                            <label>From date </label>
                            <div className="po_real">
                              {/* <input type="text" placeholder="From date" id="datepicker" /> */}
                              <DatePicker
                                placeholderText="From Date"
                                name="dob"
                                selected={from_date2}
                                value={from_date2}
                                onChange={(e) => setFrom_date2(e)}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                dropdownMode="select"
                                showMonthDropdown
                                showYearDropdown
                                adjustDateOnChange
                              />
                              <span className="absoul_spans">
                                <img
                                  src={
                                    calendar
                                  }
                                  alt=""
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 col-md-4 col-lg-6 col-xl-3">
                          <div className="input_froms">
                            <label>To date </label>
                            <div className="po_real">
                              {/* <input type="text" placeholder="To date" id="datepicker2" /> */}
                              <DatePicker
                                placeholderText="To Date"
                                name="dob"
                                selected={end_date2}
                                value={end_date2}
                                onChange={(e) => setEnd_date2(e)}
                                dateFormat="dd/MM/yyyy"
                                minDate={from_date2}
                                className="form-control"
                                dropdownMode="select"
                                showMonthDropdown
                                showYearDropdown
                                adjustDateOnChange
                              />
                              <span className="absoul_spans">
                                <img
                                  src={
                                    calendar
                                  }
                                  alt=""
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 col-md-4 col-lg-6 col-xl-2">
                          <button
                            className="sea_btns btn-order"
                            type="button"
                            onClick={() =>
                              getGift(
                                currentpage2,
                                status2,
                                from_date2,
                                end_date2
                              )
                            }
                          >
                            <img
                              src={
                                search1
                              }
                              alt=""
                            />{" "}
                            Search
                          </button>
                        </div>
                        <div className="col-12">
                          <p className="multiple">
                            You can download a product multiple times within{" "}
                            <span>3 months</span> from the Order date. The
                            download link would get deactivated after 90 days.
                          </p>
                          <span className="o_info">Please click and open following order(s) to view details and to access Product download link.</span>
                        </div>
                      </div>
                    </form>

                    <div className="profile-form meet-page-prof com_pad_tablle payment_areaa">
                      <div className="new-table-mr">
                        <div className="table">
                          <div className="one_row1 hidden-sm-down only_shawo">
                            <div className="cell1 tab_head_sheet">Order Info</div>
                            <div className="cell1 tab_head_sheet">Order Date</div>
                            <div className="cell1 tab_head_sheet">Order Amount</div>
                            <div className="cell1 tab_head_sheet">
                              Payment Status
                            </div>
                          </div>
                          {/* <!-- --------------------row-1------------------------------------ --> */}
                          {gift?.length !== 0 &&
                            gift?.map((e,i) => {
                              return (
                                <div className="one_row1 small_screen31" key={i}>
                                  <div className="cell1 tab_head_sheet_1 half-boxes">
                                    <span className="W55_1 new_adb">
                                      Product Info
                                    </span>
                                    <div className="produ_infos">
                                      <div className="order_details_dash w-op">
                                        <h3 className="g_name">
                                          <a
                                            onClick={() =>
                                              router.push({
                                                pathname: "/order-details",
                                                query: {
                                                  order_master_id: e?.id,
                                                },
                                              })
                                              
                                            }
                                          >
                                            Order Id : #{e?.order_number}
                                          </a>
                                          <span>Gifted to: {e?.gift_fname && e?.gift_lname &&  e.gift_fname + e.gift_lname}</span>
                                        </h3>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="cell1 tab_head_sheet_1">
                                    <span className="W55_1">Order Date</span>
                                    <p className="add_ttrr">{e?.order_date}</p>
                                  </div>
                                  <div className="cell1 tab_head_sheet_1">
                                    <span className="W55_1">Order Amount</span>
                                    <p className="add_ttrr">
                                      {currency &&
                                        currency +
                                          (e?.total_amount &&
                                            JSON.parse(
                                              e?.total_amount
                                            )?.toFixed(2))}
                                    </p>
                                  </div>
                                  <div className="cell1 tab_head_sheet_1 half-boxes">
                                    <span className="W55_1">Status</span>
                                    {e?.is_paid === "N" &&  e?.status !== "I" &&(
                                      <p className="add_ttrr red_colors">Failed</p>
                                    )}
                                    {e?.is_paid === "Y" &&  e?.status !== "I" &&(
                                      <p className="add_ttrr ren_colors">
                                        Complete
                                      </p>
                                    )}
                                    {e?.status === "I" && (
                                      <p className="add_ttrr yel_colors">
                                        Initiated
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                        {gift?.length === 0 && <No_Data_Found />}
                      </div>
                      {totalpage2 > 1 && (
                        <Stack spacing={2}>
                          <Pagination
                            count={totalpage2}
                            page={currentpage2}
                            onChange={handlePageChange2}
                            variant="outlined"
                            shape="rounded"
                            className="pagination_ pag-box meet-pag smllr mt-2 mb-2"
                          />
                        </Stack>
                      )}
                    </div>
                  </div>
                </div>
                <div id="canada" className="tabcontent ordr-tab001">
                  <div className="dashbord_frm">
                    <form action="">
                      <div className="row">
                        <div className="col-sm-6 col-md-4 col-lg-6 col-xl-4">
                          <div className="input_froms">
                            <label>Status</label>
                            <select
                              value={status3}
                              onChange={(e) => setStatus3(e?.target?.value)}
                            >
                              <option value="">Select</option>
                              <option value="N">Failed</option>
                              <option value="Y">Completed</option>
                              <option value="I">Initiated</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-4 col-lg-6 col-xl-3">
                          <div className="input_froms">
                            <label>From date </label>
                            <div className="po_real">
                              {/* <input type="text" placeholder="From date" id="datepicker" /> */}
                              <DatePicker
                                placeholderText="From Date"
                                name="dob"
                                selected={from_date3}
                                value={from_date3}
                                onChange={(e) => setFrom_date3(e)}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                dropdownMode="select"
                                showMonthDropdown
                                showYearDropdown
                                adjustDateOnChange
                              />
                              <span className="absoul_spans">
                                <img
                                  src={
                                    calendar
                                  }
                                  alt=""
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 col-md-4 col-lg-6 col-xl-3">
                          <div className="input_froms">
                            <label>To date </label>
                            <div className="po_real">
                              {/* <input type="text" placeholder="To date" id="datepicker2" /> */}
                              <DatePicker
                                placeholderText="To Date"
                                name="dob"
                                selected={end_date3}
                                value={end_date3}
                                minDate={from_date3}
                                onChange={(e) => setEnd_date3(e)}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                dropdownMode="select"
                                showMonthDropdown
                                showYearDropdown
                                adjustDateOnChange
                              />
                              <span className="absoul_spans">
                                <img
                                  src={
                                    calendar
                                  }
                                  alt=""
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 col-md-4 col-lg-6 col-xl-2">
                          <button
                            className="sea_btns btn-order"
                            type="button"
                            onClick={() =>
                              receiveGift(
                                currentpage3,
                                status3,
                                from_date3,
                                end_date3
                              )
                            }
                          >
                            <img
                              src={
                                search1
                              }
                              alt=""
                            />{" "}
                            Search
                          </button>
                        </div>
                        <div className="col-12">
                          <p className="multiple">
                            You can download a product multiple times within{" "}
                            <span>3 months</span> from the Order date. The
                            download link would get deactivated after 90 days.
                          </p>
                          <span className="o_info">Please click and open following order(s) to view details and to access Product download link.</span>
                        </div>
                      </div>
                    </form>

                    <div className="profile-form meet-page-prof com_pad_tablle payment_areaa">
                      <div className="new-table-mr">
                        <div className="table">
                          <div className="one_row1 hidden-sm-down only_shawo">
                            <div className="cell1 tab_head_sheet">Order Info</div>
                            <div className="cell1 tab_head_sheet">Order Date</div>
                            <div className="cell1 tab_head_sheet">Order Amount</div>
                            <div className="cell1 tab_head_sheet">
                              Payment Status
                            </div>
                          </div>
                          {/* <!-- --------------------row-1------------------------------------ --> */}
                          {receivegift?.length !== 0 &&
                            receivegift?.map((e,i) => {
                              return (
                                <div className="one_row1 small_screen31" key={i}>
                                  <div className="cell1 tab_head_sheet_1 half-boxes">
                                    <span className="W55_1 new_adb">
                                      Product Info
                                    </span>
                                    <div className="produ_infos">
                                      <div className="order_details_dash w-op">
                                        <h3>
                                          <a
                                            onClick={() =>
                                              router.push({
                                                pathname: "/order-details",
                                                query: {
                                                  order_master_id: e?.id,
                                                  type: "R",
                                                },
                                              })
                                              
                                            }
                                          >
                                            Order Id : #{e?.order_number}
                                          </a>
                                        </h3>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="cell1 tab_head_sheet_1">
                                    <span className="W55_1">Order Date</span>
                                    <p className="add_ttrr">{e?.order_date}</p>
                                  </div>
                                  <div className="cell1 tab_head_sheet_1">
                                    <span className="W55_1">Order Amount</span>
                                    <p className="add_ttrr">
                                      {currency &&
                                        currency +
                                          (e?.total_amount &&
                                            JSON.parse(
                                              e?.total_amount
                                            )?.toFixed(2))}
                                    </p>
                                  </div>
                                  <div className="cell1 tab_head_sheet_1 half-boxes">
                                    <span className="W55_1">Status</span>
                                    {e?.is_paid === "N" &&  e?.status !== "I" &&(
                                      <p className="add_ttrr red_colors">Failed</p>
                                    )}
                                    {e?.is_paid === "Y" &&  e?.status !== "I" &&(
                                      <p className="add_ttrr ren_colors">
                                        Complete
                                      </p>
                                    )}
                                    {e?.status === "I" && (
                                      <p className="add_ttrr yel_colors">
                                        Initiated
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                        {receivegift?.length === 0 && <No_Data_Found />}
                      </div>
                      {totalpage3 > 1 && (
                        <Stack spacing={2}>
                          <Pagination
                            count={totalpage3}
                            page={currentpage3}
                            onChange={handlePageChange3}
                            variant="outlined"
                            shape="rounded"
                            className="pagination_ pag-box meet-pag smllr mt-2 mb-2"
                          />
                        </Stack>
                      )}
                    </div>
                  </div>
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

export default My_Order;
