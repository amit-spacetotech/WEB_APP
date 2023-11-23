import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/config";
import { connect } from "react-redux";
function Index(props) {
  const router = useRouter();
  let ownerId = null;
  let nonce = null;

  if (typeof window !== "undefined") {
    const queryParams = new URLSearchParams(window.location.search);
    ownerId = queryParams.get("ownerId");
    nonce = queryParams.get("nonce");
  }
  console.log(ownerId, nonce);
  const updateMoveInStatus = async () => {
    try {
      console.log("COMING HERE1", ownerId, props.auth._id);
      await updateDoc(
        doc(db, `userchatlist/${ownerId}/userInfo/${props.auth._id}`),
        {
          moveIn: "PAYMENT_DONE",
        }
      );
      console.log("COMING HERE2");
      await updateDoc(
        doc(db, `userchatlist/${props.auth._id}/userInfo/${ownerId}`),
        {
          moveIn: "PAYMENT_DONE",
        }
      );
      console.log("COming here3");
      router.push("/");
    } catch (error) {
      console.error("Error saving custom ID document: ", error);
    }
  };
  const updatePayment = () => {
    axios({
      method: "put",
      url: `/paymnet/updatePayment`,
      basic: true,
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: { nonce: nonce },
    })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };


  return (
    <div
      style={{
        width: "100%",
        height: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {" "}
      Payment Successfull, Redirecting to homescreen Please wait...
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth.user,
  };
};

export default connect(mapStateToProps, null)(Index);
