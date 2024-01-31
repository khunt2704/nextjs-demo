import React, { useEffect, useState } from "react";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import dynamic from "next/dynamic";
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
  ssr: false,
});
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { ApiGet, ApiGetNoAuth, ApiPost, getFileImage } from "../../Api/Api";
import { getPosts } from "../../Redux/Apidemo/apiDemoSlice";
import Loader from "../Loader/Loader";
import No_Data_Found from "../No_data_found/No_Data_Found";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Link from "next/link";
// import Image from "next/future/image";
import { useRouter } from "next/router";
import btn_r8_arw from "../../public/images/btn-r8-arw.png"
import heart_white from "../../public/images/heart-white.png"
import bag_3 from "../../public/images/bag-3.png"
import def from "../../public/images/default.png"
import Assets from "../Assest";

const Recently_Added_Product = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currency = useSelector((state) => state?.currency?.currency);
  const calling_code = useSelector((state) => state?.currency?.calling_code);
  let userData=null;
  if (typeof window !== 'undefined') {
  userData = JSON.parse(localStorage.getItem("userinfo"));
  }
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartlist, setCartlist] = useState([]);
  const [cartID, setCartID] = useState([]);
  const [deleteProduct, setDeleteProduct] = useState({});
  const [show, setShow] = useState(false);
  const [removeCartID, setRemoveCartID] = useState([]);
  const openModal = (e) => {
    setShow(true);
    setDeleteProduct(e);
  };
  const closeModal = () => {
    setShow(false);
    setDeleteProduct({});
  };

  const owl4 = {
    loop: true,
    nav: false,
    margin: 23,
    dots: true,
    responsive: {
      0: {
        items: 2,
      },
      767: {
        items: 3,
      },
      1000: {
        items: 3,
      },
      1200: {
        items: 4,
      },
    },
  };
  const addWishlist = async (e) => {
    if (userData) {
      setLoading(true);
      const body = {
        params: {
          product_id: e,
        },
      };
      await ApiPost("wishlists", body)
        .then((res) => {
          setLoading(false);
          if (res?.data?.result) {
            swal({
              title: "Success",
              text: res?.data?.result?.status?.meaning,
              icon: "success",
            });
            setWishlist(res?.data?.result?.wishlist);
            dispatch(getPosts());
          }
        })
        .catch(async (err) => {
          setLoading(false);
        });
    } else {
      router.push("/login");
    }
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
        (e) => e?.get_product_details?.id === deleteProduct?.id
      )
    );
  }, [deleteProduct]);

  const removeCart = (e) => {
    if (userData) {
      const body = {
        params: {
          cart_details_id: removeCartID?.[0]?.id,
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
          closeModal();
          getData();
          ApiGetNoAuth("recent-product", {})
            .then((res) => {
              if (res?.data?.recent_product) {
                setData(res?.data?.recent_product);
                setLoading(false);
              }
              setLoading(false);
            })
            .catch(async (err) => {
              setLoading(false);
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
              openModal(e);
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
  const openDetailsPage = (e) => {
    router.push({
      pathname: `/product-detail/${e?.slug}`,
      query: {
        image: e?.get_product_display_images,
      },
    });
  };
  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    getData();
  }, []);
  useEffect(() => {
    ApiGetNoAuth("recent-product", {})
      .then((res) => {
        if (res?.data?.recent_product) {
          setData(res?.data?.recent_product);
          setLoading(false);
        }
        setLoading(false);
      })
      .catch(async (err) => {
        setLoading(false);
      });
  }, [currency]);
  useEffect(() => {
    const body = {
      params: {
        page_type: userData && "L",
        currency_code: calling_code,
      },
    };
    ApiPost("get-search-product-result", body).then((res) => {
      if (res?.data?.details) {
        setWishlist(res?.data?.wishlist);
        setCartlist(res?.data?.cartlist);
      }
    });
  }, [wishlist?.length, cartlist?.length, calling_code, cartID]);

  return (
    <section className="recent">
      {loading && <Loader />}
      <div className="container">
        <div className="recnt-head">
          <h2> Recently added products</h2>
          <Link href="/search-product">
            {/* <a> */}
            View All
            <Assets
              src={"images/btn-r8-arw.png"}
              alt=""
            />
            {/* </a>/ */}
          </Link>
        </div>
        {/* <!--<div className="recent-para">
            
            <p>Looking for unique <span>Gift</span> ideas that suit for all the occurrences and every person?<br>
                Art Devotee is the correct place for you.</p>
        </div>--> */}
        <div className="recent-inr">
          {data?.length !== 0 && (
            <OwlCarousel
              className="owl-carousel owl-theme owl-recent"
              {...owl4}
            >
              {data?.map((e, i) => {
                return (
                  <div className="item" key={i}>
                    <div className="recent-box">
                      <div className="recent-img">
                        <span className="pointer">
                        {e?.get_product_display_images?.length !== 0
                                ?
                          <LazyLoadImage
                            src={
                              getFileImage(
                                    e?.get_product_display_images
                                      ?.filter(
                                        (e) => e?.is_default_display === "1"
                                      )
                                      ?.shift()?.thumbnail_image
                                  )
                            }
                            loading="lazy"
                            alt="Image Alt"
                            onClick={() => openDetailsPage(e)}
                            style={{ width: "100%", height: "100%" }}
                          />
                          :
                          <Assets src={"images/default.png"} alt=""/>
                          }
                        </span>
                        {/* <img
                          src={
                            e?.get_product_display_images?.length !== 0
                              ? getFileImage(
                                  e?.get_product_display_images
                                    ?.filter(
                                      (e) => e?.is_default_display === "1"
                                    )
                                    ?.shift()?.thumbnail_image
                                )
                              : process.env.PUBLIC_URL + "/images/default.png"
                          }
                          className="main-im pointer"
                          onClick={() => openDetailsPage(e)}
                        /> */}
                        <a
                          className={`heart heart-2 ${
                            wishlist?.includes(JSON.stringify(e?.id)) &&
                            "add_wishlist"
                          }`}
                          onClick={() => addWishlist(e?.id)}
                        >
                          <Assets
                            src={
                              "images/heart-white.png"
                            }
                            alt=""
                          />
                        </a>
                        <a
                          className={`new_bag_hover d-flex ${
                            cartlist?.includes(JSON.stringify(e?.id)) &&
                            "add_cartList"
                          }`}
                          onClick={() => addCart(e)}
                        >
                          <Assets
                            src={"images/bag-3.png"}
                            alt=""
                          />
                        </a>
                      </div>
                      <div className="recent-box-txt">
                        <a onClick={() => openDetailsPage(e)}>{e?.title}</a>
                        <h5>
                          Product Code:{" "}
                          {e?.product_id ? e?.product_id : "PC08722"}
                        </h5>
                        <p className="description">{e?.description}</p>
                        {e?.get_product_price && (
                          <div className="price">
                            <span className="prc-1">
                              {currency &&
                              e?.get_product_price?.filter(
                                (e) => e?.get_currency?.symbol === currency
                              )[0]?.global_offer_applied === "Y"
                                ? currency &&
                                  currency +
                                    e?.get_product_price?.filter(
                                      (e) =>
                                        e?.get_currency?.symbol === currency
                                    )[0]?.price
                                : e?.get_product_price?.filter(
                                    (e) => e?.get_currency?.symbol === currency
                                  )[0]?.discount &&
                                  currency +
                                    e?.get_product_price?.filter(
                                      (e) =>
                                        e?.get_currency?.symbol === currency
                                    )[0]?.price}
                            </span>
                            <span className="prc-2">
                              {currency &&
                                currency +
                                  (e?.get_product_price?.filter(
                                    (e) => e?.get_currency?.symbol === currency
                                  )[0]?.global_offer_applied === "Y"
                                    ? e?.get_product_price?.filter(
                                        (e) =>
                                          e?.get_currency?.symbol === currency
                                      )[0]?.after_discount_price
                                    : e?.get_product_price?.filter(
                                        (e) =>
                                          e?.get_currency?.symbol === currency
                                      )[0]?.discount
                                    ? e?.get_product_price?.filter(
                                        (e) =>
                                          e?.get_currency?.symbol === currency
                                      )[0]?.after_discount_price
                                    : e?.get_product_price?.filter(
                                        (e) =>
                                          e?.get_currency?.symbol === currency
                                      )[0]?.price
                                    ? e?.get_product_price?.filter(
                                        (e) =>
                                          e?.get_currency?.symbol === currency
                                      )[0]?.price
                                    : 0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </OwlCarousel>
          )}
          {!loading && data?.length === 0 && <No_Data_Found />}
        </div>
      </div>
      <div
        className={`modal fade ${show && "show"}`}
        style={{ display: show ? "block" : "none" }}
        id="exampleModalCenter"
        tabIndex="-1"
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
                              Are you sure you want to remove this item from the
                              cart?
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
    </section>
  );
};

export default Recently_Added_Product;
