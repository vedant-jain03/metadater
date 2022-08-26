import React, { useState, useEffect } from 'react'
import Validator from '../../utils/Validator';
import "../../assets/styles/popup.css"
import CardStats from "components/Cards/CardStats.js";
import CardLineChart from "components/Cards/CardLineChart";
import "../../assets/styles/popup.css"

function Popup({ setPopup }) {
  const [truckNumber, setTruckNumber] = useState("");
  const [location, setLocation] = useState("");
  const [authority, setAuthority] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");


  const [validator, showValidationMessage] = Validator();

  const serverIP = process.env.REACT_APP_SERVER_IP;

  const handleSubmit = async (e) => {
    // e.preventDefault();
    try {


      // validation Check
      if (!validator.allValid()) {
        showValidationMessage(true)
        return false;
      }

      const response = await fetch(`${serverIP}/create-vehicle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
        },
        body: JSON.stringify({
          number: truckNumber,
          location,
          authority,
          mobileNumber
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
      <div className="container mx-auto px-4 h-full popup_container">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    Add Details
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
                    />
                    {
                      validator.message("mobileNumber", mobileNumber, "required|min:10|max:10", {
                        messages: {
                          required: "Mobile number is required"
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


export default function HeaderStats() {

  const [userDetails, setUserDetails] = useState([
    // { "warning": true, "creationDate": "2022-08-25T15:27:53.561Z", "weight": 202 },
    // { "warning": true, "creationDate": "2022-08-25T15:17:53.561Z", "weight": 222 },
    // { "warning": true, "creationDate": "2022-08-25T15:15:53.561Z", "weight": 232 },
    // { "warning": true, "creationDate": "2022-08-25T15:46:53.561Z", "weight": 262 },
    // { "warning": true, "creationDate": "2022-08-25T15:47:53.561Z", "weight": 292 },
    // { "warning": true, "creationDate": "2022-08-25T15:37:53.561Z", "weight": 262 },
    // { "warning": true, "creationDate": "2022-08-25T15:55:53.561Z", "weight": 282 },
    // { "warning": true, "creationDate": "2022-08-25T15:45:53.561Z", "weight": 282 }
  ]);

  const server = process.env.REACT_APP_SERVER_IP;


  const [popup, setPopup] = useState(false);
  const count = {};

  const truckDetails = React.useRef(null);

  useEffect(() => {

    setTimeout(async () => {

      const response = await fetch(`https://bloodanytime.com/value/getdata.php`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        }
      });

      const data = await response.json();

      if (!!data && !!data?.temperature && !!data?.humidity && !!data?.created_date) {


        // if (truckDetails?.current?.temperature === data?.temperature && truckDetails?.current?.humidity === data?.humidity) {
        //   console.log("done")
        // }
        // else {

        truckDetails.current = data;

        const response = await fetch(`${server}/update-vehicle-warning`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
          },
          body: JSON.stringify({
            number: data?.temperature,
            weight: data?.humidity,
            warning: true,
            updationDate: new Date(data?.created_date),
          })
        });
        const result = await response.json();
        // }

      }

    }, 3000);

  })



  const initialLoad = async () => {
    try {

      const response = await fetch(`${server}/get-vehicle-warning-details-for-graph`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
        },
      });

      const data = await response.json();
      setUserDetails(data.vehicles);

      return;
    }
    catch (error) {
      alert(error?.message);
      return;
    }
  }

  useEffect(() => {
    initialLoad();
  }, [truckDetails]);

  function generateData() {
    const newtemp = userDetails?.map((data) => {
      return data?.creationDate;
    });
    const temp = newtemp.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.date) - new Date(a.date);
    });
    count[0] = 0;

    for (const element of temp) {
      let dt = new Date(element);
      let ele = (parseInt(dt.getDate()))
      if (count[ele]) {
        count[ele] += 1;
      } else {
        count[ele] = 1;
      }
    }
    return;
  }

  generateData();

  function generateDataX() {
    const tempfinaldataY = []
    for (let property in count) {
      tempfinaldataY.push(count[property]);
    }

    return tempfinaldataY;
  }

  function generateDataY() {
    const tempfinaldataX = []
    for (let property in count) {
      let today = new Date(property);
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      today = mm + '/' + dd + '/' + yyyy;
      tempfinaldataX.push(property);
    }
    return tempfinaldataX;
  }

  const userData = {
    labels: generateDataY(),
    datasets: [
      {
        label: "Overloading in 5 Minutes Span, x-axis: Dates, y-axis: overload dumper",
        data: generateDataX(),
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
      },
    ],
  }

  const [vehicles, setVehicles] = useState([]);

  const [IsLoading, setIsLoading] = useState(false);
  const [totalTh, setTotalTh] = useState(0);
  const initialLoading = async () => {
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
      let counting = 0;
      data?.vehicles.map((data) => {
        if (data?.warning >= 5) counting += 1;

      })
      setTotalTh(counting);
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
    initialLoading();
  }, []);

  const [isadmin, setAdmin] = useState(false);

  const fetchUser = () => {
    const data = localStorage.getItem("userDetails");
    setAdmin(data);
  }
  useEffect(() => {
    fetchUser();
  }, [isadmin])

  return (
    <>
      {/* Header */}
      {(popup) ? <Popup setPopup={setPopup} /> : ""}

      <div className="relative bg-lightBlue-600 md:pt-32 pb-32 pt-12">
        <div className="container relative mx-auto">
          <div className="items-center flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
              <div className="pr-12">
                <h1 className="text-white font-semibold text-5xl">
                  Dashboard
                </h1>
                <p className="mt-4 text-lg text-blueGray-200">
                  The list of all trucks along with the action items!
                </p>

                {
                  isadmin ?
                    <button className="bg-lightBlue-500 text-white active:bg-lightBlue-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 mt-3 ease-linear transition-all duration-150" onClick={() => setPopup(true)}>Add Details</button>
                    :
                    ""
                }
              </div>
            </div>
          </div>
        </div>
        <div className='mt-4' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="relative bg-lightBlue-600 pt-10 mb-3 mt-4" style={{ width: "25%" }}>
            <div className="px-4 md:px-10 mx-auto">
              <div>
                {/* Card stats */}
                <div className="flex flex-wrap flex-col">
                  <div className="w-full mb-4">
                    <CardStats
                      statSubtitle="Total Warnings"
                      statTitle={userDetails?.length}
                      statArrow="up"
                      statPercent="3.48"
                      statPercentColor="text-emerald-500"
                      statDescripiron="Since last month"
                      statIconName="far fa-chart-bar"
                      statIconColor="bg-red-500"
                    />
                  </div>
                  <div className="w-full mb-4 notranslate">
                    <CardStats
                      statSubtitle="Last Detected T.Number"
                      statTitle={vehicles[vehicles.length - 1]?.number}
                      statArrow="down"
                      statPercent="3.48"
                      statPercentColor="text-red-500"
                      statDescripiron="Since last week"
                      statIconName="fas fa-chart-pie"
                      statIconColor="bg-orange-500"
                    />
                  </div>
                  <div className="w-full mb-4">
                    <CardStats
                      statSubtitle="Total threshold cross"
                      statTitle={totalTh}
                      statArrow="down"
                      statPercent="1.10"
                      statPercentColor="text-orange-500"
                      statDescripiron="Since yesterday"
                      statIconName="fas fa-users"
                      statIconColor="bg-pink-500"
                    />
                  </div>
                  <div className="w-full mb-4">
                    <CardStats
                      statSubtitle="Last Detected Location"
                      statTitle={vehicles[vehicles.length - 1]?.location}
                      statArrow="up"
                      statPercent="12"
                      statPercentColor="text-emerald-500"
                      statDescripiron="Since last month"
                      statIconName="fas fa-percent"
                      statIconColor="bg-lightBlue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='flex justify-center' style={{ width: '70%', marginRight: '2rem' }}>
            <CardLineChart generateDataX={generateDataX} generateDataY={generateDataY} />
          </div>
        </div>
      </div>
    </>
  );
}
