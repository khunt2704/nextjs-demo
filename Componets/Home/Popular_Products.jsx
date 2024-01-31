import React, { useEffect, useState } from "react";
import { ApiGet, ApiGetNoAuth, ApiPost, getFileImage } from "../../Api/Api";
import swal from "sweetalert";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../Redux/Apidemo/apiDemoSlice";
import Link from "next/link";
// import Image from "next/future/image";
import { useRouter } from "next/router";
import Loader from "../Loader/Loader";
import No_Data_Found from "../No_data_found/No_Data_Found";
import { LazyLoadImage } from "react-lazy-load-image-component";
import btn_r8_arw from "../../public/images/btn-r8-arw.png";
import heart_white from "../../public/images/heart-white.png";
import bag_3 from "../../public/images/bag-3.png";
import def from "../../public/images/default.png"
import Assets from "../Assest";

const Popular_Products = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  let userData = null;
  if (typeof window !== 'undefined') {
  userData = JSON.parse(localStorage.getItem("userinfo"));
  }
  const currency = useSelector((state) => state?.currency?.currency);
  const calling_code = useSelector((state) => state?.currency?.calling_code);

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

  const addWishlist = (e) => {
    if (userData) {
      setLoading(true);
      const body = {
        params: {
          product_id: e,
        },
      };
      ApiPost("wishlists", body)
        .then((res) => {
          setLoading(false);
          if (res?.data?.result) {
            swal({
              title: "Success",
              text: res?.data?.result?.status?.meaning,
              icon: "success",
            });
            dispatch(getPosts());
            setWishlist(res?.data?.result?.wishlist);
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
          const body = {
            params: {
              page_type: userData && "L",
              currency_code: calling_code,
            },
          };
          ApiPost("get-search-product-result", body)
            .then((res) => {
              if (res?.data?.details) {
                setWishlist(res?.data?.wishlist);
                setCartlist(res?.data?.cartlist);
              }
            })
            .catch(async (err) => {});
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
    window.scrollTo(0, 0);
    ApiGetNoAuth("popular-product", {})
      .then((res) => {
        if (res?.data?.popular_product) {
          setData(res?.data?.popular_product);
        }
      })
      .catch(async (err) => {});
    getData();
  }, []);
  useEffect(() => {
    const body = {
      params: {
        page_type: userData && "L",
        currency_code: calling_code,
      },
    };
    ApiPost("get-search-product-result", body)
      .then((res) => {
        if (res?.data?.details) {
          setWishlist(res?.data?.wishlist);
          setCartlist(res?.data?.cartlist);
        }
      })
      .catch(async (err) => {});
  }, [wishlist?.length, cartlist?.length, calling_code]);
  return (
    <section className="popular">
      {loading && <Loader />}
      <div className="container">
        <div className="recnt-head">
          <h2>Popular products</h2>
          <Link href="/search-product">
            {/* <a> */}
            View All
            <Assets src={"images/btn-r8-arw.png"} alt="" />
            {/* </a> */}
          </Link>
        </div>
        <div className="pop-inr">
          {data?.length !== 0 && (
            <div className="row">
              {data?.map((e, i) => {
                return (
                  <>
                    {i < 8 && (
                      <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                        <div className="pop-box">
                          <a className="heart">
                            <Assets src={"images/heart-white.png"} alt="" />
                          </a>
                          <a className="new_bag_hover">
                            <Assets src={"images/bag-3.png"} alt="" />
                          </a>
                          <a
                            className={`heart ${
                              wishlist?.includes(JSON.stringify(e?.id)) &&
                              "add_wishlist"
                            }`}
                            onClick={() => addWishlist(e?.id)}
                          >
                            <Assets src={"images/heart-white.png"} alt="" />
                          </a>
                          <a
                            className={`new_bag_hover ${
                              cartlist?.includes(JSON.stringify(e?.id)) &&
                              "add_cartList"
                            }`}
                            onClick={() => addCart(e)}
                          >
                            <Assets src={"images/bag-3.png"} alt="" />
                          </a>
                          <div className="pop_next_img">
                            <a
                              className="pop-box-img recent-img"
                              onClick={() => openDetailsPage(e)}
                            >
                              <span>
                                {e?.get_product_display_images.length !== 0
                                      ?
                                <LazyLoadImage
                                  src={
                                     getFileImage(
                                          e?.get_product_display_images
                                            ?.filter(
                                              (e) =>
                                                e?.is_default_display === "1"
                                            )
                                            ?.shift()?.thumbnail_image
                                        )
                                      }
                                  loading="lazy"
                                  // width={600} height={400}
                                  alt="Image Alt"
                                />
                                :
                                <Assets src={"images/default.png"} alt=""/>
                                }
                                {/* <img
                                  src={
                                    e?.get_product_display_images.length !== 0
                                      ? getFileImage(
                                          e?.get_product_display_images
                                            ?.filter(
                                              (e) =>
                                                e?.is_default_display === "1"
                                            )
                                            ?.shift()?.thumbnail_image
                                        )
                                      : process.env.PUBLIC_URL +
                                        "/images/default.png"
                                  }
                                  alt=""
                                /> */}
                              </span>
                            </a>
                          </div>
                          <div className="pop-txt">
                            <div className="pop-prc">
                              <a
                                className="pop-nm"
                                onClick={() => openDetailsPage(e)}
                              >
                                {e?.title}
                              </a>
                              <span>
                                {currency &&
                                  currency +
                                    (e?.get_product_price?.filter(
                                      (e) =>
                                        e?.get_currency?.symbol === currency
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
                            <p className="description">{e?.description}</p>
                            <div className="pop-cta">
                              {e?.product_id && (
                                <h3>Product Code: {e?.product_id}</h3>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })}
            </div>
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

export default Popular_Products;
