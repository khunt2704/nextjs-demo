import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import logo_image  from "../../Assest/Images/bnr-logo.png"
import { getMaintenance } from "../../Redux/Apidemo/maintananceDemoSlice";
const Maintenance = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [data, setData] = useState("")
  const maintenance = useSelector((state) => state.maintananceDemo.maintenance?.data?.maintenance_details);
  useEffect(() => {
    document.title = "Artdevotee | Maintenance";
    window.scrollTo(0, 0);
    setData(maintenance)
  }, [maintenance]);
  useEffect(() => {
    if(maintenance?.maintenance === "N"){
      navigate("/")
    }
  }, []);
  useEffect(() => {
    dispatch(getMaintenance());
  }, []);
  console.log("maintenance",maintenance,data);
  return (
    <div className="log-page">
      <div className="goto-login">
        <div className="">
            <div className="maintenance">
            <img src={logo_image} alt=""/>
              {data && <h2>{data?.message}</h2>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
