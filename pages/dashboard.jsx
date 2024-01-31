import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApiGet, getFileImage } from "../Api/Api";
import Sidemenu from "../Componets/Sidemenu/Sidemenu";
import { useRouter } from "next/router";
import Head from "next/head";
import Dash1 from "../assets/images/dasg1.png";
import Dash2 from "../assets/images/dasg2.png";
import Dash3 from "../assets/images/dasg3.png";
import def from "../assets/images/default.png";
import Image from "next/image";

const Dashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currency = useSelector((state) => state?.currency?.currency);
  let userData = null;
  if (typeof window !== "undefined") {
    userData = JSON.parse(localStorage.getItem("userinfo"));
  }
  const [data, setData] = useState({});
  useEffect(() => {
    window.scrollTo(0, 0);
    if (userData) {
      ApiGet("dashboard", {}).then((res) => {
        if (res?.data) {
          setData(res?.data);
        }
      });
    }
  }, []);
  return (
    <div>
      <Head>
        <title>Dashboard - Artdevotee</title>
        <meta name="description" content="Dashboard - Artdevotee" />
        <meta property="og:title" content="Dashboard - Artdevotee" />
        <meta property="og:description" content="Dashboard - Artdevotee" />
        <meta
          property="og:image"
          content="https://artdevotee.com /images/how-bnr.png"
        />
        <link rel="canonical" href="https://artdevotee.com/dashboard" />
      </Head>
      <div className="dashbord_sec">
        <div className="container">
          <div className="dashbord_inr">
            <Sidemenu />
            <div className="dashbord_right">
              <div className="dashbord_right_ir">
                <div className="dash_headings_div">
                  {" "}
                  <h1>Dashboard</h1>
                </div>
                <div className="dashbord_frm">
                  <div className="dasbod_info">
                    <h2>
                      Hi, {userData?.first_name} {userData?.last_name}
                    </h2>
                    <p>
                      Lorem ipsum dolor sit amet the consectetur it adipiscing
                      the eiusmod tempor incididunt the caption laibore lorem
                      ipsum dolor aaamet caption consectetur lorem ipsum dolor
                      sit amet consectetur the adipiscing caption.
                    </p>
                  </div>

                  <div className="das_statis">
                    <div className="row">
                      <div className="col-xl-4 col-lg-6 col-md-4 col-sm-6">
                        <div className="das_statis_box">
                          <span>
                            <img alt="" src={Dash1} />
                          </span>
                          <div
                            className="stats_infos pointer"
                            onClick={() => router.push("/my-order")}
                          >
                            <h2>Total Purchase</h2>
                            <p>{data?.total_order}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-4 col-sm-6">
                        <div
                          className="das_statis_box pointer"
                          onClick={() => router.push("/my-wishlist")}
                        >
                          <span>
                            <img alt="" src={Dash2} />
                          </span>
                          <div className="stats_infos">
                            <h2>My Wishlist </h2>
                            <p>{data?.wishlist}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-4 col-sm-6">
                        <div className="das_statis_box">
                          <span>
                            <img alt="" src={Dash3} />
                          </span>
                          <div className="stats_infos">
                            <h2>Last Login</h2>
                            <p>{data?.last_login_date}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {data?.total_order !== 0 && (
                    <>
                      <h3 className="das_headingds">Recent Order</h3>
                      <p className="das_headingds44">
                        You can download a product multiple times within 2
                        months from the Order date. The download link would get
                        deactivated after 2 months.{" "}
                      </p>
                      <div className="profile-form meet-page-prof com_pad_tablle payment_areaa">
                        <div className="new-table-mr">
                          <div className="table">
                            <div className="one_row1 hidden-sm-down only_shawo">
                              <div className="cell1 tab_head_sheet">
                                Product Info
                              </div>
                              <div className="cell1 tab_head_sheet">
                                Order on
                              </div>
                              <div className="cell1 tab_head_sheet">Status</div>
                            </div>

                            {data?.last_order?.map((e, i) => {
                              return (
                                <div
                                  className="one_row1 small_screen31"
                                  key={i}
                                >
                                  <div className="cell1 tab_head_sheet_1 half-boxes">
                                    <span className="W55_1 new_adb">
                                      Product Info
                                    </span>
                                    <div className="produ_infos">
                                      <span
                                        className="squer_boxx pointer"
                                        onClick={() =>
                                            router.push({
                                              pathname: "/order-details",
                                              query: {
                                                order_master_id: e?.id,
                                              },
                                            })
                                          }
                                      >
                                        {e?.get_order_details[0]
                                          ?.get_product_details
                                          ?.get_product_display_images
                                          ?.length !== 0 ? (
                                          <img
                                            src={getFileImage(
                                              e?.get_order_details[0]?.get_product_details?.get_product_display_images
                                                ?.filter(
                                                  (e) =>
                                                    e?.is_default_display ===
                                                    "1"
                                                )
                                                ?.shift()?.thumbnail_image
                                            )}
                                            alt=""
                                          />
                                        ) : (
                                          <img src={def} alt="" />
                                        )}
                                      </span>
                                      <div className="order_details_dash">
                                        <h3
                                          className="pointer"
                                          onClick={() =>
                                            router.push({
                                              pathname: "/order-details",
                                              query: {
                                                order_master_id: e?.id,
                                              },
                                            })
                                          }
                                        >
                                          {
                                            e?.get_order_details[0]
                                              ?.get_product_details?.title
                                          }
                                        </h3>
                                        <p>Order Id : #{e?.order_number}</p>
                                        <div className="dash_pps">
                                          {e?.get_order_details[0]
                                            ?.unit_price_original &&
                                            e?.get_order_details[0]
                                              ?.unit_price_original !==
                                              e?.get_order_details[0]
                                                ?.total_price && (
                                              <p>
                                                {currency &&
                                                  currency +
                                                    JSON.parse(
                                                      e?.get_order_details[0]
                                                        ?.unit_price_original
                                                    )?.toFixed(2)}
                                              </p>
                                            )}{" "}
                                          <h5>
                                            {currency &&
                                              currency +
                                                (e?.get_order_details[0]
                                                  ?.total_price &&
                                                  JSON.parse(
                                                    e?.get_order_details[0]
                                                      ?.total_price
                                                  )?.toFixed(2))}
                                          </h5>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="cell1 tab_head_sheet_1">
                                    <span className="W55_1">Order on</span>
                                    <p className="add_ttrr">{e?.order_date}</p>
                                  </div>

                                  <div className="cell1 tab_head_sheet_1 half-boxes">
                                    <span className="W55_1">Status</span>
                                    {e?.is_paid === "N" &&
                                      e?.status !== "I" && (
                                        <p className="add_ttrr red_colors">
                                          Failed
                                        </p>
                                      )}
                                    {e?.is_paid === "Y" &&
                                      e?.status !== "I" && (
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
                        </div>
                      </div>
                    </>
                  )}
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

export default Dashboard;
