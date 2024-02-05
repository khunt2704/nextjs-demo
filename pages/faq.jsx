import React, { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
// import Image from "next/future/image";
import { ApiPostNoAuth } from "../Api/Api";
import Loader from "../Componets/Loader/Loader";
import No_Data_Found from "../Componets/No_data_found/No_Data_Found";
import question from "../assets/images/question.png"
import Assets from "@/Componets/Assest";

const Faq = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    ApiPostNoAuth("faq-list", {})
      .then((res) => {
        setLoading(false);
        if (res?.data?.result) {
          setData(res?.data?.result?.faq);
        } else if (res?.data?.error) {
        }
      })
      .catch(async (err) => {
        setLoading(false);
      });
  }, []);
  return (
    <>
      <Head>
        <title>FAQ - Artdevotee</title>
        <meta name="description" content="FAQ - Artdevotee" />
        <meta property="og:title" content="FAQ - Artdevotee" />
        <meta property="og:description" content="FAQ - Artdevotee" />
        <meta
          property="og:image"
          content="https://artdevotee.com /images/faq-bnr.png"
        />
        <link rel="canonical" href="https://artdevotee.com/faq" />
      </Head>
      {loading && <Loader />}
      <div className="contact-bnr faq-bnr">
        <div className="container">
          <div className="contct-bnr-txt faq-bnr-txt">
            <h1>Frequently Asked Questions</h1>

            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>

                <li className="breadcrumb-item active" aria-current="page">
                  Faq
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="contact-pager faq-pager">
        <div className="container">
          <div className="faq-box">
            {data?.length !== 0 &&
              data?.map((e, i) => {
                return (
                  <div className="accordion_container" key={i}>
                    <div className="accordion_head" data-id={e?.id}>
                      <p>
                        <Assets
                          src={"images/question.png"}
                          alt=""
                        />
                        {e?.question}{" "}
                      </p>
                      <span className={`plusminus ${"plusminus" + e?.id}`}>
                        +
                      </span>
                    </div>

                    <div
                      className={`accordion_body ${"aa" + e?.id}`}
                      style={{ display: "none" }}
                    >
                      <div dangerouslySetInnerHTML={{ __html: e?.answer }} />
                    </div>
                  </div>
                );
              })}
            {!loading && data?.length === 0 && <No_Data_Found />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Faq;
