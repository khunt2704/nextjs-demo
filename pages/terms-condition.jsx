import React, { useEffect } from "react";
import { useState } from "react";
import { ApiPost } from "../Api/Api";
import Loader from "../Componets/Loader/Loader";
import No_Data_Found from "../Componets/No_data_found/No_Data_Found";
import Head from "next/head";

const Terms_Condition = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    ApiPost("terms-condition", {})
      .then(async (res) => {
        if (res?.data?.result) {
          setData(res?.data?.result?.terms_condition);
        }
        setLoading(false);
      })
      .catch(async (err) => {
        setLoading(false);
      });
  }, []);
  return (
    <div>
      <Head>
        <title>Terms & Conditions - Artdevotee</title>
        <meta
            name="description"
            content="Terms & Conditions - Artdevotee"
        />
        <meta property="og:title" content="Terms & Conditions - Artdevotee" />
        <meta property="og:description" content="Terms & Conditions - Artdevotee" />
        <meta property="og:image" content="https://artdevotee.com /images/how-bnr.png" />
        <link rel="canonical" href="https://artdevotee.com/terms-condition" />
      </Head>
      {loading && <Loader />}
      <div className="privacy-pg">
        {data?.length !== 0 && (
          <div className="container">
            <h1>{data?.page_heading}</h1>
            <div className="pri-top">
              <div dangerouslySetInnerHTML={{ __html: data?.section }} />
            </div>

            <div className="pri-inr">
              <div dangerouslySetInnerHTML={{ __html: data?.subsection }} />
            </div>
          </div>
        )}
        {data?.length === 0 && <No_Data_Found />}
      </div>
    </div>
  );
};

export default Terms_Condition;
