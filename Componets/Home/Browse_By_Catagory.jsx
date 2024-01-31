import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getFileImage } from "../../Api/Api";
import No_Data_Found from "../No_data_found/No_Data_Found";
import Link from "next/link";
// import Image from "next/future/image";
import { useRouter } from "next/router";
import btn_r8_arw from "../../public/images/btn-r8-arw.png";
import bnr_btn_arw from "../../public/images/bnr-btn-arw.png";
import cat_2 from "../../public/images/cat-2.png"
import Assets from "../Assest";

const Browse_By_Catagory = ({ about, category }) => {
  const router = useRouter();
  return (
    <section className="catagory">
      <div className="container">
        <div className="recnt-head">
          <h2>Browse by catagory</h2>
          <Link href="/search-product">
            {/* <a> */}
            View All
            <Assets src={"images/btn-r8-arw.png"} alt="" />
            {/* </a> */}
          </Link>
        </div>
        <div className="cat-inr">
          {category?.length !== 0 && (
            <div className="cat-row row">
              {category?.map((e, i) => {
                return (
                  <>
                    <div className="col-6 col-sm-3">
                      <a
                        className="cat-box"
                        onClick={() =>
                          router.push({
                            pathname: "/search-product",
                            query: {
                              categoryId: e?.id,
                            },
                          })
                        }
                      >
                       {e?.image
                              ?
                        <LazyLoadImage
                          className="filter_img "
                          src={
                             getFileImage(e?.image)
                              
                          }
                          loading="lazy"
                          alt="Image Alt"
                        />
                        :
                        <Assets alt="" src={"images/cat-2.png"}/>
              }
                        <div className="hov-box hov-box-1"></div>
                        <div className="hov-box hov-box-2"></div>
                        <div className="hov-box hov-box-3"></div>
                        <div className="hov-box hov-box-4"></div>
                        <h3>{e?.name}</h3>
                      </a>
                    </div>
                  </>
                );
              })}
            </div>
          )}
        </div>
        {category?.length === 0 && <No_Data_Found />}
        <div className="about">
          <h2>About Artdevotee</h2>
          <p dangerouslySetInnerHTML={{ __html: about }} />
          <Link href="/about-us" className="bnr-btn">
            {/* <a > */}
            Read More
            <Assets src={"images/bnr-btn-arw.png"} alt="" />
            {/* </a> */}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Browse_By_Catagory;
