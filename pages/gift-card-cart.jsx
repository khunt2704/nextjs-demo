import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import { ApiGet, ApiPost } from "../Api/Api";
import Loader from "../Componets/Loader/Loader";
import No_Data_Found from "../Componets/No_data_found/No_Data_Found";
import rejectt from "../assets/images/rejectt.png";
import Image from "next/image";


const Gift_Card_Cart = () => {
  const currency = useSelector((state) => state?.currency?.currency);
  const calling_code = useSelector((state) => state?.currency?.calling_code);
  let userData = null;
  if (typeof window !== "undefined") {
    userData = JSON.parse(localStorage.getItem("userinfo"));
  }
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [couponData, setCouponData] = useState({});
  const [deleteProduct, setDeleteProduct] = useState({});
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  console.log("data", data, data2);
  var validRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const openModal = (e) => {
    setShow(true);
    setDeleteProduct(e);
  };
  const closeModal = () => {
    setShow(false);
    setDeleteProduct({});
  };
  const removeCart = (e) => {
    if (userData) {
      const body = {
        params: {
          cart_details_id: deleteProduct?.id,
        },
      };
      ApiPost("remove-giftcard-from-cart", body).then((res) => {
        if (res?.data?.result) {
          swal({
            title: "Success",
            text: res?.data?.result?.status?.meaning,
            icon: "success",
          });
          closeModal();
          getData();
        } else if (res?.data?.error) {
          swal({
            title: "Warning",
            text: res?.data?.error?.meaning,
            icon: "warning",
          });
        }
      });
    } else {
      router.push("/login");
    }
  };
  const storeEmail = (value, data) => {
    let dummy = data2?.map((y) => {
      if (data?.id === y?.id) {
        return {
          ...data,
          email: value?.target?.value,
          error: !value?.target?.value?.match(validRegex) ? true : false,
        };
      }
      if (!value?.target?.value?.match(validRegex)) {
        setError(true);
      } else {
        setError(false);
      }
      return y;
    });

    setData2(dummy);
  };
  const storeName = (value, data) => {
    let dummy = data2?.map((y) => {
      if (data?.id === y?.id) {
        return { ...data, name: value?.target?.value };
      }
      return y;
    });
    setData2(dummy);
  };

  const getData = () => {
    setLoading(true);
    ApiGet("get-giftcard-cart-list", {})
      .then((res) => {
        if (res?.data?.cartList) {
          setData(res?.data?.cartList[0]);
          setData2(res?.data?.cartList[0]?.get_cart_details);
        }
        setLoading(false);
      })
      .catch(async (err) => {
        setLoading(false);
      });
  };
  const checkoutGift = (e) => {
    e?.preventDefault();
    if (!error) {
      const bbb = data2.map((e) => {
        return {
          id: e?.id,
          email: e?.email ? e?.email : "",
          name: e?.name ? e?.name : "",
        };
      });
      const body = {
        params: {
          get_each_card_details: bbb,
          currency_code: calling_code,
          cart_id: data?.id,
        },
      };
      setLoading(true);
      ApiPost("checkout-gift-card-cart", body)
        .then((res) => {
          if (res?.data?.status?.result) {
            router.push({
              pathname: "/checkout-gift-card",
              query: {
                data: JSON.stringify(data),
                data2: JSON.stringify(data2),
              },
            });
          }
          setLoading(false);
        })
        .catch(async (err) => {
          setLoading(false);
        });
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getData();
  }, []);
  return (
    <div>
      <Head>
        <title>Gift Card Cart - Artdevotee</title>
        <meta name="description" content="Gift Card Cart - Artdevotee" />
        <meta property="og:title" content="Gift Card Cart - Artdevotee" />
        <meta property="og:description" content="Gift Card Cart - Artdevotee" />
        <meta
          property="og:image"
          content="https://artdevotee.com /images/how-bnr.png"
        />
        <link rel="canonical" href="https://artdevotee.com/gift-card-cart" />
      </Head>
      {loading && <Loader />}
      <form onSubmit={checkoutGift}>
        <div className="shopping-sec">
          <div className="container">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb shop-crumb">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Gift Cart
                </li>
              </ol>
            </nav>
            <div className="row">
              <div className={data ? "col-lg-8" : "col-sm-12"}>
                <div className="cart-list-box">
                  {data && (
                    <>
                      <h2>{data?.total_card_quantity} Cards In Cart</h2>
                      <ul>
                        {data2?.map((e, i) => {
                          return (
                            <li key={i}>
                              <div className="produ_infos">
                                <div className="order_details_dash">
                                  <h3 className="pointer">
                                    {e?.get_product_details?.title}
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

                                  <div className="row">
                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                      <div className="input_froms">
                                        <label>Email</label>
                                        <input
                                          type="email"
                                          placeholder="Enter here"
                                          value={e?.email}
                                          onChange={(y) => storeEmail(y, e)}
                                          required
                                        />
                                        <span className="errorInput">
                                          {e?.error
                                            ? "Invalid email address!"
                                            : ""}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                      <div className="input_froms">
                                        <label>Name</label>
                                        <input
                                          type="text"
                                          placeholder="Enter here"
                                          value={e?.name}
                                          onChange={(y) => storeName(y, e)}
                                          required
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <a
                                className="css-tooltip-top color-blue meet-rvw uu0 prod-del"
                                onClick={() => openModal(e)}
                              >
                                {" "}
                                <p>Remove</p>
                                <img
                                  src={rejectt}
                                  className="blue-show"
                                  alt=""
                                />
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                  {!loading && !data && <No_Data_Found type="gift-cart" />}
                </div>
              </div>
              {data && (
                <div className="col-lg-4">
                  <div className="payment-box">
                    <h2>Payment Deatils</h2>
                    <div className="pay-calc">
                      <h4>
                        Total Payable Amount :{" "}
                        <span>{currency && currency + data?.total_amount}</span>
                      </h4>
                    </div>

                    <ul className="pay-btns">
                      <li>
                        <button className="chck-btn" type="submit">
                          Continue Checkout
                        </button>
                      </li>
                      <li>
                        <Link href="/purchase-gift-card">
                          {/* <a className="shop-btn">Continue Buy Gift Card</a> */}
                        </Link>
                      </li>
                    </ul>
                    <div className="gurantee"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
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
                          <h2>Remove from Cart</h2>
                        </div>
                        <div className="loger-inr">
                          <form action="" role="form">
                            <h3>
                              Are you sure you want to remove this card from the
                              cart?
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
                                onClick={removeCart}
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

export default Gift_Card_Cart;
