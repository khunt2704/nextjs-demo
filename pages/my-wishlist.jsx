import { Pagination, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ApiGet, ApiPost, getFileImage } from "../Api/Api";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../Componets/Loader/Loader";
import Sidemenu from "../Componets/Sidemenu/Sidemenu";
import { getPosts } from "../Redux/Apidemo/apiDemoSlice";
import swal from "sweetalert";
import No_Data_Found from "../Componets/No_data_found/No_Data_Found";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Head from "next/head";
import { useRouter } from "next/router";
// import Image from "next/future/image";
import rejectt_2 from "../assets/images/rejectt-2.png";
import pop_img_3 from "../assets/images/pop-img-3.png";

const My_Wishlist = () => {
  const currency = useSelector((state) => state?.currency?.currency);
  const calling_code = useSelector((state) => state?.currency?.calling_code);

  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalpage, settotalpage] = useState(1);
  const [currentpage, setcurrentpage] = useState(1);
  const [cartlist, setCartlist] = useState([]);
  const [deleteProduct, setDeleteProduct] = useState({});
  let userData = null;
  if (typeof window !== "undefined") {
    userData = JSON.parse(localStorage.getItem("userinfo"));
  }
  const [cartID, setCartID] = useState([]);
  const [deleteProduct2, setDeleteProduct2] = useState({});
  const [show2, setShow2] = useState(false);
  const [removeCartID, setRemoveCartID] = useState([]);
  const openModal2 = (e) => {
    setShow2(true);
    setDeleteProduct2(e);
  };
  const closeModal2 = () => {
    setShow2(false);
    setDeleteProduct2({});
  };

  const [show, setShow] = useState(false);
  const openModal = (e) => {
    setShow(true);
    setDeleteProduct(e);
  };
  const closeModal = () => {
    setShow(false);
    setDeleteProduct({});
  };
  const handlePageChange = (e, i) => {
    getWishlist(i);
  };
  const getWishlist = (p) => {
    const body = {
      params: {
        page_no: p,
        currency_code: calling_code,
      },
    };
    setLoading(true);
    ApiPost("get-wishlist", body)
      .then((res) => {
        setLoading(false);
        if (res?.data) {
          setData(res?.data?.productDetails);
          settotalpage(res?.data?.page_count);
          setcurrentpage(res?.data?.page_no);
        }
      })
      .catch(async (err) => {
        setLoading(false);
      });
  };
  const addWishlist = (e) => {
    setLoading(true);

    const body = {
      params: {
        product_id: deleteProduct?.id,
      },
    };
    ApiPost("wishlists", body)
      .then((res) => {
        setLoading(false);
        if (res?.data?.result) {
          dispatch(getPosts());
          getWishlist(currentpage);
          closeModal();
          swal({
            title: "Success",
            text: res?.data?.result?.status?.meaning,
            icon: "success",
          });
        }
      })
      .catch(async (err) => {
        setLoading(false);
      });
  };
  const getData = () => {
    if (userData) {
      setLoading(true);
      ApiGet("get-cart-list", {})
        .then((res) => {
          if (res?.data?.cartList) {
            setCartID(res?.data?.cartList[0]);
          }
          setLoading(false);
        })
        .catch(async (err) => {
          setLoading(false);
        });
    }
  };
  useEffect(() => {
    setRemoveCartID(
      cartID?.get_cart_details?.filter(
        (e) => e?.get_product_details?.id === deleteProduct2?.id
      )
    );
  }, [deleteProduct2]);

  const removeCart = (e) => {
    if (userData) {
      const body = {
        params: {
          cart_details_id: removeCartID[0]?.id,
        },
      };
      ApiPost("remove-from-cart", body).then((res) => {
        if (res?.data?.result) {
          swal({
            title: "Success",
            text: res?.data?.result?.status?.meaning,
            icon: "success",
          });
          dispatch(getPosts());
          closeModal2();
          getData();
          const body = {
            params: {
              page_type: userData && "L",
              currency_code: calling_code,
            },
          };
          ApiPost("get-search-product-result", body).then((res) => {
            if (res?.data?.details) {
              setCartlist(res?.data?.cartlist);
            }
          });
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
  const addCart = (e) => {
    if (userData) {
      setLoading(true);
      const body = {
        params: {
          product_id: e?.id,
          currency_code: calling_code,
        },
      };
      ApiPost("add-to-cart", body)
        .then((res) => {
          setLoading(false);
          if (res?.data?.result) {
            swal({
              title: "Success",
              text: res?.data?.result?.status?.meaning,
              icon: "success",
            });
            getData();
            dispatch(getPosts());
            setCartlist(res?.data?.result?.cart_list);
          } else if (res?.data?.error) {
            if (res?.data?.error?.meaning === "Product is already added") {
              openModal2(e);
            }
          }
        })
        .catch(async (err) => {
          setLoading(false);
        });
    } else {
      router.push("/login");
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getWishlist(currentpage);
    getData();
    const body = {
      params: {
        page_type: userData && "L",
        currency_code: calling_code,
      },
    };
    ApiPost("get-search-product-result", body).then((res) => {
      if (res?.data?.details) {
        setCartlist(res?.data?.cartlist);
      }
    });
  }, []);
  const openDetailsPage = (e) => {
    router.push({
      pathname: `/product-detail/${e?.slug}`,
      query: {
        image: e?.get_product_display_images,
      },
    });
  };
  const dummy = data[3]?.get_product_price?.filter(
    (e) => e?.get_currency?.symbol === currency
  )[0]?.price;
  return (
    <>
      <Head>
        <title>My Wishlist - Artdevotee</title>
        <meta name="description" content="My Wishlist - Artdevotee" />
        <meta property="og:title" content="My Wishlist - Artdevotee" />
        <meta property="og:description" content="My Wishlist - Artdevotee" />
        <meta
          property="og:image"
          content="https://artdevotee.com /images/how-bnr.png"
        />
        <link rel="canonical" href="https://artdevotee.com/my-wishlist" />
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
                    <h1>My Favourite</h1>
                  </div>
                  {data?.length !== 0 && (
                    <div className="dashbord_frm">
                      <div className="favre_boxes_lists">
                        <div className="row">
                          {data?.map((e, i) => {
                            return (
                              <div
                                className="col-xl-4 col-lg-6 col-md-4 col-sm-6 col-6"
                                key={i}
                              >
                                <div className="fav_list_boxes">
                                  <div className="recent-img">
                                    {e?.get_product_display_images[0]?.image ? (
                                      <LazyLoadImage
                                        src={getFileImage(
                                          e?.get_product_display_images
                                            ?.filter(
                                              (e) =>
                                                e?.is_default_display === "1"
                                            )
                                            ?.shift()?.thumbnail_image
                                        )}
                                        className="main-im pointer"
                                        loading="lazy"
                                        alt="Image Alt"
                                        onClick={() => openDetailsPage(e)}
                                      />
                                    ) : (
                                      <img src={pop_img_3} alt="" />
                                    )}
                                    <a
                                      className="dele_produ wit-crs"
                                      onClick={() => openModal(e)}
                                    >
                                      <img
                                        src={rejectt_2}
                                        className="blue-show"
                                        alt=""
                                      />
                                    </a>
                                  </div>
                                  <div className="fav-box-txt">
                                    <a onClick={() => openDetailsPage(e)}>
                                      {e?.title}
                                    </a>
                                    <h5>Product Code: {e?.product_id}</h5>
                                    <div className="price2">
                                      <span className="prc-1">
                                        {e?.get_product_price?.filter(
                                          (e) =>
                                            e?.get_currency?.symbol === currency
                                        )[0]?.global_offer_applied === "Y"
                                          ? currency +
                                            e?.get_product_price?.filter(
                                              (e) =>
                                                e?.get_currency?.symbol ===
                                                currency
                                            )[0]?.price
                                          : e?.get_product_price?.filter(
                                              (e) =>
                                                e?.get_currency?.symbol ===
                                                currency
                                            )[0]?.discount &&
                                            currency +
                                              e?.get_product_price?.filter(
                                                (e) =>
                                                  e?.get_currency?.symbol ===
                                                  currency
                                              )[0]?.price}
                                      </span>
                                      <span className="prc-2">
                                        {currency +
                                          (e?.get_product_price?.filter(
                                            (e) =>
                                              e?.get_currency?.symbol ===
                                              currency
                                          )[0]?.global_offer_applied === "Y"
                                            ? e?.get_product_price?.filter(
                                                (e) =>
                                                  e?.get_currency?.symbol ===
                                                  currency
                                              )[0]?.after_discount_price
                                            : e?.get_product_price?.filter(
                                                (e) =>
                                                  e?.get_currency?.symbol ===
                                                  currency
                                              )[0]?.discount
                                            ? e?.get_product_price?.filter(
                                                (e) =>
                                                  e?.get_currency?.symbol ===
                                                  currency
                                              )[0]?.after_discount_price
                                            : e?.get_product_price?.filter(
                                                (e) =>
                                                  e?.get_currency?.symbol ===
                                                  currency
                                              )[0]?.price
                                            ? e?.get_product_price?.filter(
                                                (e) =>
                                                  e?.get_currency?.symbol ===
                                                  currency
                                              )[0]?.price
                                            : 0)}
                                      </span>
                                      {e?.get_product_price?.filter(
                                        (e) =>
                                          e?.get_currency?.symbol === currency
                                      )[0]?.discount && (
                                        <span className="prc-3">
                                          (
                                          {
                                            e?.get_product_price?.filter(
                                              (e) =>
                                                e?.get_currency?.symbol ===
                                                currency
                                            )[0]?.discount
                                          }
                                          % off)
                                        </span>
                                      )}
                                      {e?.get_product_price?.filter(
                                        (e) =>
                                          e?.get_currency?.symbol === currency
                                      )[0]?.global_offer_applied === "Y" && (
                                        <span className="prc-3">(10% off)</span>
                                      )}
                                    </div>
                                    <div className="fav-rcnt-btns">
                                      <a
                                        className="srch-cart"
                                        onClick={() => addCart(e)}
                                      >
                                        {cartlist?.includes(
                                          JSON.stringify(e?.id)
                                        )
                                          ? "Remove from cart"
                                          : "Add to cart"}
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          <div className="col-xl-12">
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
                    </div>
                  )}
                  {!loading && data?.length === 0 && <No_Data_Found />}
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
                          <div className="loger-top for-got">
                            <h2>Remove Wishlist</h2>
                          </div>
                          <div className="loger-inr">
                            <form action="" role="form">
                              <h3>
                                Are you sure you want to remove this item from
                                the wishlist?
                              </h3>
                              <div className="d-flex">
                                <button
                                  type="button"
                                  className="log-sbmt bg-white text-dark border mt-4 mr-3"
                                  onClick={closeModal}
                                >
                                  {" "}
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  className="log-sbmt mt-4"
                                  onClick={addWishlist}
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
        <div
          className={`modal fade ${show2 && "show"}`}
          style={{ display: show2 ? "block" : "none" }}
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
                      onClick={closeModal2}
                    >
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
                                Are you sure you want to remove this item from
                                the cart?
                              </h3>
                              <div className="d-flex">
                                <button
                                  type="button"
                                  className="log-sbmt bg-white text-dark border mt-4 mr-3"
                                  onClick={closeModal2}
                                >
                                  {" "}
                                  Cancel
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
    </>
  );
};

export default My_Wishlist;
