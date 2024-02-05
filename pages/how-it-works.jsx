import React, { useEffect,useState } from "react";
import { ApiPost } from "../Api/Api";
import Loader from "../Componets/Loader/Loader";
import Link from "next/link";
import Head from "next/head";
// import Image from "next/future/image";
import enquiry from "../assets/images/enquiry.png"
import how_gift from "../assets/images/how-gift.png"
import Assets from "@/Componets/Assest";

const How_It_Works = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    ApiPost("how-it-works", {})
      .then(async (res) => {
        if (res?.data?.result) {
          setData(res?.data?.result?.how_it_works);
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
        <title>How it Works - Artdevotee</title>
        <meta
            name="description"
            content="How it Works - Artdevotee"
        />
        <meta property="og:title" content="How it Works - Artdevotee" />
        <meta property="og:description" content="How it Works - Artdevotee" />
        <meta property="og:image" content="https://artdevotee.com /images/how-bnr.png" />
        <link rel="canonical" href="https://artdevotee.com/how-it-works" />
      </Head>
      {loading && <Loader />}
      <div className="contact-bnr how-bnr">
        <div className="container">
          <div className="contct-bnr-txt">
            <h1>{data?.page_heading}</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {data?.page_heading}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="how-pager">
        <div className="container">
          <div className="how-box">
            <div className="how-text pl-5">
              <div dangerouslySetInnerHTML={{ __html: data?.section }} />
            </div>
          </div>
          <div className="how-box box-rev">
            <div className="how-text pl-5">
              <div dangerouslySetInnerHTML={{ __html: data?.how_it_work2 }} />
            </div>
            <div className="how-img">
              <Assets src={"images/enquiry.png"} alt=""/>
            </div>
          </div>
          <div className="how-box">
            <div className="how-img">
              <Assets src={"images/how-gift.png"} alt=""/>
            </div>
            <div className="how-text pl-5">
              <div dangerouslySetInnerHTML={{ __html: data?.how_it_work3 }} />
            </div>
          </div>
          <div className="how-box box-rev">
            <div className="how-text">
              <div dangerouslySetInnerHTML={{ __html: data?.how_it_work4 }} />
            </div>
          </div>
          <h2 className="did-not">
            Still Confused? Look through our <Link href="/faq">FAQs</Link>
          </h2>
        </div>
      </div>
    </>
  );
};

export default How_It_Works;
