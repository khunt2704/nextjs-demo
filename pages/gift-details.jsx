import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ApiPost, getFileImage } from "../Api/Api";
import Loader from "../Componets/Loader/Loader";
import Sidemenu from "../Componets/Sidemenu/Sidemenu";
import def from "../assets/images/default.png";
// import Image from "next/future/image";


const Gift_Details = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const currency = useSelector((state) => state?.currency?.currency);
  const openDetailsPage = async (e) => {
    setLoading(true);
    setData({
      ...data,
      get_product_display_images: "",
    });
    const body = {
      params: {
        giftcard_master_id: e,
      },
    };
    await ApiPost("giftcard-detail-page-data", body)
      .then((res) => {
        setLoading(false);
        if (res?.data?.result) {
          setData(res?.data?.result?.gift_card_master_details);
        }
      })
      .catch(async (err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    openDetailsPage(router?.query?.id);
  }, [router.isReady]);
  
  return (
    <>
      <Head>
        <title>Gift Card Details - Artdevotee</title>
        <meta name="description" content="Gift Card Details - Artdevotee" />
        <meta property="og:title" content="Gift Card Details - Artdevotee" />
        <meta
          property="og:description"
          content="Gift Card Details - Artdevotee"
        />
        <meta
          property="og:image"
          content="https://artdevotee.com /images/how-bnr.png"
        />
        <link
          rel="canonical"
          href={`https://artdevotee.com/gift-details/${router?.query?.id}`}
        />
      </Head>
      <div className="dashbord_sec">
        {loading && <Loader />}
        <div className="container">
          <Sidemenu />
          <div className="dashbord_right">
            <div className="dashbord_right_ir">
              <div className="dash_headings_div">
                <h1>Gift Card Details</h1>
              </div>
              <div className="dashbord_frm">
                <div className="order_boxs_sha">
                  <ul className="row w-100 new_des">
                    <li className="col-sm-6">
                      <span>Order No. </span>: {data?.giftcard_name}
                    </li>
                    <li className="col-sm-6">
                      <span>Purchase Date </span>: {data?.purchased_on}
                    </li>
                    <li className="col-sm-6">
                      <span>Price per Card </span>:{" "}
                      {currency + (+data?.total_amount)?.toFixed(2)}
                    </li>
                    <li className="col-sm-6">
                      <span className="w-auto">Used Price</span>:{" "}
                      {currency + (+data?.used_amount)?.toFixed(2)}
                    </li>
                    <li className="col-sm-6">
                      <span className="w-auto">Available Value</span>:{" "}
                      {currency + data?.available_amount}
                    </li>
                    <li className="col-sm-6">
                      <span className="w-auto">Validity Date</span>:{" "}
                      {data?.validity}
                    </li>
                  </ul>
                </div>
                {data?.receiver_email && (
                  <>
                    <h3 className="das_headingds">Gift Recipients Info</h3>
                    <div className="gifting">
                      <h2>{data?.receiver_name}</h2>
                      <div className="order_boxs_sha">
                        <ul className="w-100">
                          <li>
                            <span>Email address </span>: {data?.receiver_email}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </>
                )}

                {data?.order_data?.length !== 0 && (
                  <>
                    <h3 className="das_headingds">Product Info</h3>
                    {data?.order_data?.map((e, i) => {
                      return (
                        <div className="gifting" key={i}>
                          <h2>
                            {e?.billing_fname} {e?.billing_lname}
                          </h2>
                          <div className="order_boxs_sha">
                            <ul className="w-100">
                              <li>
                                <span>Email address </span>: {e?.billing_email}
                              </li>
                              <li>
                                <span>Phone No. </span>: {e?.billing_phone}
                              </li>
                              <li>
                                <span>Address </span>:{" "}
                                {e?.billing_street_address +
                                  ", " +
                                  e?.billing_city +
                                  ", " +
                                  e?.billing_address_line2 +
                                  ", " +
                                  e?.billing_country_id +
                                  "- " +
                                  e?.billing_postcode}
                              </li>
                            </ul>
                          </div>

                          <div className="dash_headings_div2">
                            <h1>Product Information</h1>
                          </div>
                          <div className="details_order_prod_info">
                            {e?.order_details?.map((y, i) => {
                              return (
                                <div className="produ_infos" key={i}>
                                  <span>
                                    {y?.products?.get_product_option?.length !==
                                    0 ? (
                                      <img
                                        src={getFileImage(
                                          y?.products?.get_product_option
                                            ?.filter(
                                              (e) => e?.make_default === "1"
                                            )
                                            ?.shift()?.image
                                        )}
                                        alt=""
                                      />
                                    ) : (
                                      <img src={def} alt="" />
                                    )}
                                  </span>
                                  <div className="order_details_dash">
                                    <h3>{y?.products?.title}</h3>
                                    <p>
                                      Product Code: {y?.products?.product_id}
                                    </p>
                                    <div className="dash_pps">
                                      {y?.unit_price_original !==
                                        y?.unit_price_discounted && (
                                        <p>
                                          {currency &&
                                            currency + y?.unit_price_original}
                                        </p>
                                      )}
                                      <h5>
                                        {currency &&
                                          currency + y?.unit_price_discounted}
                                      </h5>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
            <div className="clearfix"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Gift_Details;
