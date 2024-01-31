import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { ApiPost } from "../../Api/Api";
import Loader from "../../Componets/Loader/Loader";

function Payment() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paydata, setPaydata] = useState([]);
  const currency = useSelector((state) => state?.currency?.currency);
  useEffect(() => {
    document.title = "Artdevotee | Payment";
    window.scrollTo(0, 0);
    let data = {
      params: {
        order_number: router?.query?.slug?.[0],
        type: router?.query?.slug?.[1],
      },
    };
    setLoading(true);
    ApiPost("payment-page-data", data).then((resp) => {
      setLoading(false);
      if (resp?.data) {
        setPaydata(resp.data);
      }
    });
  }, [router.isReady]);
  function isDate(val) {
    return Object.prototype.toString.call(val) === "[object Date]";
  }

  function isObj(val) {
    return typeof val === "object";
  }

  function stringifyValue(val) {
    if (isObj(val) && !isDate(val)) {
      return JSON.stringify(val);
    } else {
      return val;
    }
  }

  function buildForm({ action, params }) {
    const form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", action);

    Object.keys(params).forEach((key) => {
      const input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", key);
      input.setAttribute("value", stringifyValue(params[key]));
      form.appendChild(input);
    });

    return form;
  }

  function post(details) {
    const form = buildForm(details);
    document.body.appendChild(form);
    form.submit();
    form.remove();
  }

  const pay = () => {
    let data = {
      params: {
        order_id: router?.query?.slug?.[0],
        order_type: router?.query?.slug?.[1] === "O" ? "O" : "G",
        currency_id: paydata?.currency_id,
      },
    };
    setLoading(true);
    ApiPost("payment", data).then((resp) => {
      setLoading(false);
      if (resp?.data?.result?.params) {
        var information = {
          action: "https://securegw-stage.paytm.in/theia/processTransaction",
          params: resp.data.result.params,
        };
        post(information);
      } else if (resp?.data?.message === "successfull") {
        router.push("/payment-status/S/O");
      }
    });
  };
  return (
    <>
      {loading && <Loader />}
      <section className="contact-pager">
        <div className="container">
          <div className="contact-inr">
            <div
              className="row"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className="col-lg-5">
                <div className="contact-frm-sec">
                  <div className="contact-form contform1">
                    <div className="payformhead">
                      <h2>Payment</h2>
                      <p>Complete Payment to place order</p>
                      <h3>Order Id: {router?.query?.slug?.[0]}</h3>
                    </div>
                    <div className="paySumm">
                      <h3 className="summary-title">Payment Summery</h3>
                      <div className="check_subtotal_sec">
                        <div className="sub_total_check">
                          <p>Subtotal</p>
                          <h6>
                            {currency && currency}
                            {paydata?.total_before_discount
                              ? (+paydata?.total_before_discount).toFixed(2)
                              : paydata?.total_amount
                              ? (+paydata.total_amount).toFixed(2)
                              : "0.00"}
                          </h6>
                        </div>

                        <div className="check_subtotal_sec">
                          <div className="sub_total_check">
                            <p>Discount</p>
                            <h6 className="text-right">
                              {currency && currency}
                              {paydata?.total_amount &&
                              paydata?.total_after_discount
                                ? (
                                    paydata.total_before_discount -
                                    paydata.total_amount
                                  ).toFixed(2)
                                : "0.00"}
                            </h6>
                          </div>
                        </div>
                      </div>
                      <div className="total_cart_div d-flex justify-content-between">
                        <h1>Total payable amount :</h1>
                        <h1>
                          {currency && currency}{" "}
                          {paydata?.total_amount
                            ? (+paydata.total_amount).toFixed(2)
                            : "0.00"}
                        </h1>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="conc-btn"
                      onClick={() => pay()}
                    >
                      Pay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Payment;
