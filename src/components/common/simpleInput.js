import React, { useState } from "react";

function SimpleInput(props) {
  const [isFocused, setIsFocused] = useState(false);

  const {
    placeholder = "",
    value = "",
    editable = false,
    onChange = () => {},
    OnEdit = () => {},
    name = "",
    groupClassName = "",
    style = {},
    inputStyle = {},
    type = "",
    disabled,
    maxLength = "",
    isEditable = true,
    required = false,
    verify,
    title,
    error,
  } = props;

  return (
    <div className={groupClassName} style={{ position: "relative", ...style }}>
      {required ? <span style={{ color: "red" }}> * </span> : null}
      {title ? <label style={{ fontWeight: "bolder" }}>{title}</label> : null}
      <div className="d-flex align-items-center">
        {isEditable ? (
          <input
            style={{
              fontSize: "14px",
              color: "black",
              height: "45px",
              fontFamily: "var(--poppins-font)",
              borderBottom: error ? "solid 1px red" : "1.5px solid #9F9F9F",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              padding: "10px 10px 10px 0px",
              backgroundColor: "white",
              width: "100%",
              ...inputStyle,
            }}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={() => {
              setIsFocused(true);
            }}
            value={value}
            name={name}
            type={type}
            disabled={disabled}
          />
        ) : (
          <div style={{ fontSize: 16.5, fontWeight: 500 }}>
            {value ? value : "-"}
          </div>
        )}
        {editable && (
          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginLeft: "10px",
              cursor: "pointer",
            }}
            onClick={OnEdit}
          >
            <p>Edit</p>
          </div>
        )}
      </div>

      {verify && (
        <div style={{ position: "absolute", top: "33px", right: "45px" }}>
          {/* <img src={verifyImg} /> */}
          <img
            src="/assets/new_icons/verify.png"
            style={{ width: "86%", cursor: "pointer" }}
            alt="logo"
          />
        </div>
      )}

      {error ? (
        <label
          className="simple-select-error"
          style={{
            fontSize: "0.7rem",
            color: "red",
            textAlign: "left",
            width: "100%",
          }}
        >
          *{error}
        </label>
      ) : null}
    </div>
  );
}

export default SimpleInput;
