import React, { useEffect, useState } from "react";
import { ApiPost } from "../Api/Api";
import Loader from "../Componets/Loader/Loader";
import Link from "next/link";
import Head from "next/head";
// import Image from "next/future/image";
import image_big from "../assets/images/image-big.png";
import image_small from "../assets/images/image-small.png";
import image_small1 from "../assets/images/image-small1.PNG";
import image_big2 from "../assets/images/image-big2.png";
import Assets from "@/Componets/Assest";

const About_Us = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    ApiPost("about-us", {})
      .then(async (res) => {
        if (res?.data?.result) {
          setData(res?.data?.result?.about_us);
        }
        setLoading(false);
      })
      .catch(async (err) => {
        setLoading(false);
      });
  }, []);

  return (
    <>
    <Head>
        <title>About Us - Artdevotee</title>
        <meta
            name="description"
            content="About Us - Artdevotee"
        />
        <meta property="og:title" content="About Us - Artdevotee" />
        <meta property="og:description" content="About Us - Artdevotee" />
        <meta property="og:image" content="https://artdevotee.com /images/about-bnr.png" />
        <link rel="canonical" href="https://artdevotee.com/about-us" />
      </Head>
    <div>
      {loading && <Loader />}
      <div className="contact-bnr about-bnr">
        <div className="container">
          <div className="contct-bnr-txt">
            <h1>{data?.page_heading}</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  About
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="contact-pager about-pager">
        <div className="container">
          <div className="about-inr">
            <div className="row">
              <div className="col-lg-6">
                <div className="about-img">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="img-big">
                        <Assets
                          src={"images/image-big.png"}
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="img-small sml-fst">
                        <Assets
                          src={
                            "images/image-small.png"
                          }
                          alt=""
                        />
                      </div>
                      <div className="img-small">
                        <Assets
                          src={
                            "images/image-small1.PNG"
                          }
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="img-big2">
                        <Assets
                          src={
                            "images/image-big2.png"
                          }
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-12">
                <div className="about-text">
                  <div dangerouslySetInnerHTML={{ __html: data?.section }} />
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

export default About_Us;
