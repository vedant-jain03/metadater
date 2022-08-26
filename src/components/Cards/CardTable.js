import React, { useState, useEffect } from 'react'
import Validator from '../../utils/Validator';
import PropTypes from "prop-types";


// components

import TableDropdown from "components/Dropdowns/TableDropdown.js";




function Popup({ setPopup, Id, initialLoad }) {

  const serverIP = process.env.REACT_APP_SERVER_IP;


  const [truckNumber, setTruckNumber] = useState("");
  const [location, setLocation] = useState("");
  const [authority, setAuthority] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [warnings, setWarnings] = useState(0);

  const [validator, showValidationMessage] = Validator();


  const getVehicleDetails = async () => {
    try {

      const response = await fetch(`${serverIP}/get-vehicle-details-by-id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
        },
        body: JSON.stringify({
          id: Id
        })
      });

      const data = await response.json();
      if (data.status === 'SUCCESS') {
        setTruckNumber(data?.vehicle?.number);
        setLocation(data?.vehicle?.location);
        setAuthority(data?.vehicle?.authority);
        setMobileNumber(data?.vehicle?.mobileNumber);
        setWarnings(data?.vehicle?.warning);
        return;
      }
      else {
        alert(data?.message);
        setPopup(false);
        return;
      }

    }
    catch (error) {
      alert(error?.message);
      return;
    }
  }

  useEffect(() => {
    getVehicleDetails();
  }, []);




  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      // validation Check
      if (!validator.allValid()) {
        showValidationMessage(true)
        return false;
      }

      const response = await fetch(`${serverIP}/update-vehicle-details`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
        },
        body: JSON.stringify({
          id: Id,
          number: truckNumber,
          location,
          authority,
          mobileNumber,
          warning: warnings,
        }),
      });

      const data = await response.json();

      if (data.status === "SUCCESS") {
        setPopup(false);
        alert(data?.message);
        return;
      }
      else if (data.status === "FAILED" && data.message === "Validation Errors") {
        setPopup(false);
        alert(data?.validationErrorsList[data?.validationErrorsList?.length - 1]?.message);
        return;
      }
      else {
        setPopup(false);
        alert(data?.message);
        return;
      }

    }
    catch (err) {
      alert(err?.message);
      setPopup(false);
      return;
    }
  }


  return (
    <>
      <div className="container mx-auto px-1 h-full popup_container">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    Update Vehicle Information
                  </h6>
                  <span className="cross-popup absolute" onClick={() => setPopup(false)} >x</span>
                </div>
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <form>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Truck Number
                    </label>
                    <input
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Truck Number" onChange={(e) => setTruckNumber(e.target.value)}
                      value={truckNumber}
                    />

                    {
                      validator.message("truckNumber", truckNumber, "required|min:10|max:12", {
                        messages: {
                          required: "Truck Number is required"
                        },
                        submitHandler: handleSubmit
                      })}

                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Location
                    </label>
                    <input
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="location"
                      onChange={(e) => setLocation(e.target.value)}
                      value={location}
                    />
                    {
                      validator.message("location", location, "required|min:3|max:50", {
                        messages: {
                          required: "Location is required"
                        },
                        submitHandler: handleSubmit
                      })}
                  </div>


                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Authority name
                    </label>
                    <input
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Authority/Org Name"
                      onChange={(e) => setAuthority(e.target.value)}
                      value={authority}
                    />
                    {
                      validator.message("authority", authority, "required|min:3|max:50", {
                        messages: {
                          required: "Authority is required"
                        },
                        submitHandler: handleSubmit
                      })}
                  </div>


                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Mobile Number
                    </label>
                    <input
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Enter your mobile number"
                      type="phone"
                      onChange={(e) => setMobileNumber(e.target.value)}
                      value={mobileNumber}
                    />
                    {
                      validator.message("mobileNumber", mobileNumber, "required|min:10|max:10", {
                        messages: {
                          required: "Mobile number is required"
                        },
                        submitHandler: handleSubmit
                      })}
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      warnings
                    </label>
                    <input
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Enter your number of warnings"
                      type="number"
                      onChange={(e) => setWarnings(e.target.value)}
                      value={warnings}
                    />
                    {
                      validator.message("warnings", warnings, "required|min:0|max:100", {
                        messages: {
                          required: "warnings number is required"
                        },
                        submitHandler: handleSubmit
                      })}
                  </div>


                  <div className="text-center mt-6">
                    <button
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="button"

                      onClick={(e) => { handleSubmit(e) }}

                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}



export default function CardTable({ color }) {


  const [vehicles, setVehicles] = useState([]);

  const [IsLoading, setIsLoading] = useState(false);

  const [popup, setPopup] = useState(false);

  const [Id, setId] = useState("");

  const server = process.env.REACT_APP_SERVER_IP;

  const initialLoad = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${server}/get-vehicles`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
        },
      });

      const data = await response.json();
      setVehicles(data?.vehicles);
      setIsLoading(false);
      return;
    }
    catch (error) {
      alert(error?.message);
      setIsLoading(false);
      return;
    }
  }

  useEffect(() => {
    initialLoad();
  }, []);


  return (
    <>
      {(popup) ? <Popup setPopup={setPopup} Id={Id} initialLoad={initialLoad} /> : ""}

      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="flex relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                Truck Details
              </h3>
              <i className="fas fa-redo ml-2 text-lg text-white-400 cursor-pointer" onClick={() => { window.location.reload(); }}></i>

            </div>
          </div>
        </div>

        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Truck Number
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Location
                </th>
                {/* <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Status
                </th> */}
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Authority
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Warnings
                </th>
                {/* <th
                  className={
                    "px-6 align-middle border border-solid py-1 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  action
                </th> */}
              </tr>
            </thead>
            <tbody>
              {
                IsLoading ?
                  <tr>
                    <th colSpan="5" className="text-center p-5">
                      <h4 className="text-center">Loading...</h4>
                    </th>
                  </tr> :
                  <>
                    {
                      vehicles.length === 0 ? <tr>
                        <th colSpan="5" className="text-center p-5">
                          <h4 className="text-center">No Data!</h4>
                        </th>
                      </tr> : ""
                    }
                    {
                      vehicles?.map((vehicle, index) => {

                        return (

                          <tr key={index} >
                            <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                              <span
                                className={
                                  "ml-3 font-bold " +
                                  +(color === "light" ? "text-blueGray-600" : "text-white")
                                }
                              >
                                {vehicle?.number}
                              </span>
                            </th>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                              {vehicle?.location}
                            </td>
                            {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <i className="fas fa-circle text-red-500 mr-2"></i> Over
                      </td> */}
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                              {vehicle?.authority}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                              <div className="flex items-center">
                                <span className="mr-2">{(vehicle?.warning == 0)?1:vehicle?.warning}</span>
                                {/* <div className="relative w-full">
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-red-200">
                              <div
                                style={{ width: "100%" }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                              ></div>
                            </div>
                          </div> */}
                              </div>
                            </td>
                            {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                              <TableDropdown Id={vehicle?._id} initialLoad={initialLoad} />
                              <button className="bg-lightBlue-500 text-white active:bg-lightBlue-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 mt-3 ease-linear transition-all duration-150" onClick={() => { setPopup(true); setId(vehicle?._id) }}>Edit</button>
                            </td> */}
                          </tr>

                        );
                      })
                    }
                  </>
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

CardTable.defaultProps = {
  color: "light",
};

CardTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
