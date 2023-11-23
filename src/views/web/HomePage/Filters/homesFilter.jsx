import React from "react";
import styles from "./filter.module.css";
import { Slider } from "antd";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
function HomeFilter(props) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <RxCross2
          style={{
            top: "15px",
            position: "absolute",
            right: "15px",
            fontWeight: "bolder",
            fontSize: "20px",
            cursor: "pointer",
          }}
          onClick={() => {
            props.setShow();
          }}
        />

        <h2>Filters</h2>
        {/* <hr style={{ margin: 0 }} /> */}
      </div>
      <div className={styles.section}>
        <h4>Rent</h4>
        <div className={styles.flexComp}>
          <p>0 Zar</p>
          <p>20000+ Zar</p>
        </div>
        <Slider
          range
          min={0}
          max={20000}
          value={[props.homes.minRent, props.homes.maxRent]}
          className="slider"
          onChange={(values) => {
            props.setHome((prevData) => {
              const [minRent, maxRent] = values;
              if (minRent > maxRent) {
                return {
                  ...prevData,
                  minRent: maxRent,
                  maxRent: minRent,
                };
              }
              return {
                ...prevData,
                minRent,
                maxRent,
              };
            });
          }}
          onAfterChange={(values) => {
            const [minRent, maxRent] = values;
            props.getHomesData(1, true, {
              minRent,
              maxRent,
            });
          }}
        />
      </div>
      <hr />

      <div className={styles.section}>
        <h4>Pets allowed</h4>

        <div className={styles.flexComp}>
          <p>Yes</p>
          <input
            type="radio"
            checked={props.homes.isPetsAllowed}
            onChange={(values) => {
              props.setHome({
                ...props.homes,
                isPetsAllowed: true,
              });
              props.getHomesData(1, true, {
                isPetsAllowed: true,
              });
            }}
          />
        </div>
        <div className={styles.flexComp}>
          <p>No</p>
          <input
            type="radio"
            checked={!props.homes.isPetsAllowed}
            onChange={(values) => {
              props.setHome({
                ...props.homes,
                isPetsAllowed: false,
              });
              props.getHomesData(1, true, {
                isPetsAllowed: false,
              });
            }}
          />
        </div>
      </div>
      <hr />
      <div className={styles.section}>
        <h4>No of bedrooms</h4>
        <div className={styles.incDec}>
          <AiOutlineMinusCircle
            onClick={() => {
              if (Number(props.homes.bedRooms) >= 0) {
                props.setHome({
                  ...props.homes,
                  bedRooms:
                    Number(props.homes.bedRooms ? props.homes.bedRooms : 1) - 1,
                });
                props.getHomesData(1, true, { bedRooms: props.homes.bedRooms });
              }
            }}
          />
          <p>{props.homes.bedRooms}</p>
          <AiOutlinePlusCircle
            onClick={() => {
              props.setHome({
                ...props.homes,
                bedRooms: Number(props.homes.bedRooms) + 1,
              });
              props.getHomesData(1, true, { bedRooms: props.homes.bedRooms });
            }}
          />
        </div>
      </div>
      <hr />
      <div className={styles.section}>
        <h4>No of bathrooms</h4>
        <div className={styles.incDec}>
          <AiOutlineMinusCircle
            onClick={() => {
              if (Number(props.homes.bathRooms) > 0) {
                props.setHome({
                  ...props.homes,
                  bathRooms:
                    Number(props.homes.bathRooms ? props.homes.bathRooms : 1) -
                    1,
                });
                props.getHomesData(1, true, {
                  bathRooms: props.homes.bathRooms,
                });
              }
            }}
          />
          <p>{props.homes.bathRooms}</p>
          <AiOutlinePlusCircle
            onClick={() => {
              props.setHome({
                ...props.homes,
                bathRooms: Number(props.homes.bathRooms) + 1,
              });
              props.getHomesData(1, true, { bathRooms: props.homes.bathRooms });
            }}
          />
        </div>
      </div>
      <hr />
      <div className={styles.section}>
        <h4>Size of property (m^2)</h4>
        <div className={styles.flexComp}>
          <p>0 </p>
          <p>2500+ </p>
        </div>
        <Slider
          range
          min={0}
          max={2500}
          value={[props.homes.minSize, props.homes.maxSize]}
          className="slider"
          onChange={(values) => {
            props.setHome({
              ...props.homes,
              minSize: values[0],
              maxSize: values[1],
            });
            props.getHomesData(1, true, {
              minSize: values[0],
              maxSize: values[1],
            });
          }}
        />
      </div>
      <div className={styles.buttonSection}>
        <button
          onClick={() => {
            props.getHomesData(1, false, { allowPet: true });
            props.setShow();
          }}
        >
          {" "}
          Show {"("}
          {props.count}
          {")"} results{" "}
        </button>
      </div>
    </div>
  );
}

export default HomeFilter;
