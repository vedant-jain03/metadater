import React from "react";
import { createPopper } from "@popperjs/core";

const NotificationDropdown = ({ Id, initialLoad }) => {

  const server = process.env.REACT_APP_SERVER_IP;


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const response = await fetch(`${server}/update-vehicle-warning`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
        },
        body: JSON.stringify({
          id: Id,
          warning: 1
        })
      });

      const data = await response.json();

      if (data.status === "SUCCESS") {
        alert(data?.message);
        setDropdownPopoverShow(false);
        initialLoad();
        return;
      }
      else if (data.status === "FAILED" && data.message === "Validation Errors") {
        alert(data?.validationErrorsList[data?.validationErrorsList?.length - 1]?.message);
        return;
      }
      else {
        alert(data?.message);
        return;
      }

    } catch (error) {
      alert(error?.message);
      return;
    }

  }


  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "left-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  return (
    <>
      <a
        className="text-blueGray-500 py-1 px-3"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <i className="fas fa-ellipsis-v"></i>
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        <a
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
          onClick={(e) => handleSubmit(e)}
        >
          add warning
        </a>
        {/* <a
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
          onClick={(e) => e.preventDefault()}
        >
          Another action
        </a>
        <a
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
          onClick={(e) => e.preventDefault()}
        >
          Something else here
        </a> */}
      </div>
    </>
  );
};

export default NotificationDropdown;
