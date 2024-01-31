import { Pagination, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ApiPost } from "../Api/Api";
import Loader from "../Componets/Loader/Loader";
import No_Data_Found from "../Componets/No_data_found/No_Data_Found";
import Sidemenu from "../Componets/Sidemenu/Sidemenu";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";


const Gift_Card = () => {
  const router = useRouter();
  const currency = useSelector((state) => state?.currency?.currency);
  const calling_code = useSelector((state) => state?.currency?.calling_code);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [receiveData, setReceiveData] = useState([]);
  const [amount, setAmount] = useState({});

  useEffect(() => {
    document.getElementById("london").style.display = "block";
    setLoading(true);
    window.scrollTo(0, 0);
    getOrder(1);
    getOrder2(1);
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
  const [totalpage, settotalpage] = useState(1);
  const [currentpage, setcurrentpage] = useState(1);
  const [totalpage2, settotalpage2] = useState(1);
  const [currentpage2, setcurrentpage2] = useState(1);
  const handlePageChange = (e, i) => {
    getOrder(i);
  };
  const handlePageChange2 = (e, i) => {
    getOrder2(i);
  };
  const getOrder = (page) => {
    setLoading(true);
    const body = {
      params: {
        page_no: page,
        currency_code: calling_code,
      },
    };
    ApiPost("get-gift-card", body)
      .then((res) => {
        if (res?.data?.user_gift_card) {
          setData(res?.data?.user_gift_card);
          setAmount(res?.data);
          settotalpage(res?.data?.page_count);
          setcurrentpage(res?.data?.page_no);
        }
        setLoading(false);
      })
      .catch(async (err) => {
        setLoading(false);
      });
  };
  const getOrder2 = (page) => {
    setLoading(true);
    const body = {
      params: {
        page_no: page,
        currency_code: calling_code,
      },
    };
    ApiPost("received-gift-card", body)
      .then((res) => {
        if (res?.data?.received_gift_card) {
          setReceiveData(res?.data?.received_gift_card);
          setAmount(res?.data);
          settotalpage2(res?.data?.page_count);
          setcurrentpage2(res?.data?.page_no);
        }
        setLoading(false);
      })
      .catch(async (err) => {
        setLoading(false);
      });
  };
  return (
    <div>
      <Head>
        <title>Gift Card - Artdevotee</title>
        <meta name="description" content="Gift Card - Artdevotee" />
        <meta property="og:title" content="Gift Card - Artdevotee" />
        <meta property="og:description" content="Gift Card - Artdevotee" />
        <meta
          property="og:image"
          content="https://artdevotee.com /images/how-bnr.png"
        />
        <link rel="canonical" href="https://artdevotee.com/gift-card" />
      </Head>
      {loading && <Loader />}
      <div className="dashbord_sec">
        <div className="container">
          <div className="dashbord_inr">
            <Sidemenu />
            <div className="dashbord_right">
              <div className="dashbord_right_ir">
                <div className="dash_headings_div hd-wt-btn">
                  <h1>Gift Cards</h1>
                  <div className="d-flex flex-wrap">
                    <Link
                      href="/purchase-gift-card"
                      passHref
                    >
                      {/* <a className="gift_top_button"> */}
                      Purchase Gift Card
                      {/* </a> */}
                    </Link>
                    <Link href="/gift-card-cart" passHref>
                      {/* <a className="gift_top_button"> */}
                      View Cart
                      {/* </a> */}
                    </Link>
                  </div>
                </div>
                <div className="dashbord_frm">
                  <div className="order_boxs_sha outline-grn">
                    <ul>
                      <li>
                        <span>Gift&nbsp;Cards&nbsp;Purchased&nbsp;</span>:{" "}
                        {amount?.total_card_count
                          ? amount?.total_card_count
                          : 0}
                      </li>
                    </ul>
                    <ul className="">
                      <li>
                        <span>Total&nbsp;INR&nbsp;Price&nbsp;</span>:{" "}
                        {"₹" +
                          (amount?.total_IN_price ? amount?.total_IN_price : 0)}
                      </li>
                    </ul>
                    <ul>
                      <li>
                        <span>Total&nbsp;USD&nbsp;Price&nbsp;</span>:{" "}
                        {"$" +
                          (amount?.total_US_price ? amount?.total_US_price : 0)}
                      </li>
                    </ul>
                  </div>
                  <div className="dash_headings_div pad-no">
                    <div className="tab ordr-lst001">
                      <button
                        className="tablinks active"
                        onClick={(e) => openCity(e, "london")}
                      >
                        <h1>My&nbsp;Gift&nbsp;Cards</h1>
                      </button>
                      <button
                        className="tablinks"
                        onClick={(e) => openCity(e, "canada")}
                      >
                        <h1>My Received&nbsp;Gift&nbsp;Cards</h1>
                      </button>
                    </div>
                  </div>
                  <span className="o_info">
                    Note: Please click on the following gift card(s), to view
                    the details.
                  </span>
                  <div id="london" className="tabcontent ordr-tab001">
                    {data?.length !== 0 &&
                      data?.map((e) => {
                        return (
                          <>
                            <div className="order_boxs_sha">
                              <ul
                                className="row w-100 new_des pointer"
                                onClick={() => {
                                  router.push({
                                    pathname:"/gift-details",
                                    query:{
                                      id:e?.id
                                    }});
                                }}
                              >
                                <li className="col-sm-6">
                                  <span className="w-auto">Gift Card No. </span>
                                  : {e?.giftcard_name}
                                </li>
                                <li className="col-sm-6">
                                  <span className="w-auto">Purchase Date </span>
                                  : {e?.purchased_on}
                                </li>
                                <li className="col-sm-6">
                                  <span className="w-auto">
                                    Price per Card{" "}
                                  </span>
                                  : {currency + (+e?.total_amount)?.toFixed(2)}
                                </li>
                                <li className="col-sm-6">
                                  <span className="w-auto">Used Price</span>:{" "}
                                  {currency + (+e?.used_amount)?.toFixed(2)}
                                </li>
                                <li className="col-sm-6">
                                  <span className="w-auto">
                                    Available Value
                                  </span>
                                  : {currency + e?.available_amount}
                                </li>
                                <li className="col-sm-6">
                                  <span className="w-auto">Validity Date</span>:{" "}
                                  {e?.validity}
                                </li>
                                <li className="col-sm-6">
                                  {e?.receiver_email && e?.receiver_name && (
                                    <p className="dash_pps">
                                      <h5>
                                        This gift card is a gift for{" "}
                                        {e?.receiver_name}
                                      </h5>
                                    </p>
                                  )}
                                </li>
                              </ul>
                            </div>
                          </>
                        );
                      })}
                    {!loading && data?.length === 0 && <No_Data_Found />}
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
                  <div id="canada" className="tabcontent ordr-tab001">
                    {receiveData?.length !== 0 &&
                      receiveData?.map((e) => {
                        return (
                          <>
                            <div className="order_boxs_sha">
                              <ul
                                className="row w-100 new_des pointer"
                                onClick={() => {
                                  router.push({
                                    pathname:"/gift-details",
                                    query:{
                                      id:e?.id
                                    }});
                                }}
                              >
                                <li className="col-sm-6">
                                  <span>Gift Card No. </span>:{" "}
                                  {e?.giftcard_name}
                                </li>
                                <li className="col-sm-6">
                                  <span>Purchase Date </span>: {e?.purchased_on}
                                </li>
                                <li className="col-sm-6">
                                  <span>Price per Card </span>:{" "}
                                  {currency + (+e?.total_amount)?.toFixed(2)}
                                </li>
                                <li className="col-sm-6">
                                  <span className="w-auto">Used Price</span>:{" "}
                                  {currency + (+e?.used_amount)?.toFixed(2)}
                                </li>
                                <li className="col-sm-6">
                                  <span className="w-auto">
                                    Available Value
                                  </span>
                                  : {currency + e?.available_amount}
                                </li>
                                <li className="col-sm-6">
                                  <span className="w-auto">Validity Date</span>:{" "}
                                  {e?.validity}
                                </li>
                                <li className="col-sm-6">
                                  <span className="w-auto">Send By</span>:{" "}
                                  {e?.order_master?.user_details?.email}
                                </li>
                              </ul>
                            </div>
                          </>
                        );
                      })}
                    {!loading && receiveData?.length === 0 && <No_Data_Found />}
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
            </div>
            <div className="clearfix"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gift_Card;
