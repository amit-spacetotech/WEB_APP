import React from "react";
import styles from "./messages.module.css";
import { connect } from "react-redux";
import { getContent } from "../../../redux/actions/contentAction";
import { Input } from "antd";
import { FaKeyboard } from "react-icons/fa";
import AppLoader from "@/utils/AppLoader/AppLoader";
import { TbLock } from "react-icons/tb";
import CommonModal from "@/components/common/modal";
import moment from "moment";
import {
  addDoc,
  doc,
  collection,
  setDoc,
  updateDoc,
  getDocs,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../config/config";
import { useRouter } from "next/router";
import Lottie from "react-lottie";
import createProfile_end from "../../../assets/createProfile/createProfile_end.json";
import axios from "axios";
import { AiOutlineSend } from "react-icons/ai";
function UserChat(props) {
  const router = useRouter();
  const [userList, setUserList] = React.useState([]);
  const [msg, setMsg] = React.useState("");
  const [payment, setPayment] = React.useState(false);
  const [msgCount, setMsgCount] = React.useState(0);
  const [activeUser, setActiveUser] = React.useState();
  const [chatList, setChatList] = React.useState([]);
  const [homeDetails, setHomeDetails] = React.useState();
  const [openMoveIn, setOpenMoveIn] = React.useState(false);
  const [showLoader, setShowLoader] = React.useState(true);

  const { TextArea } = Input;

  const scrollToBottom = () => {
    const container = document.getElementById("chatContainer");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: createProfile_end,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [chatList]);

  const fetchHomeDetails = async (id) => {
    setHomeDetails(false);
    const userChatListRef2 = collection(db, "userList");
    const userInfoDocRef2 = doc(userChatListRef2, id);
    const docSnapshot2 = await getDoc(userInfoDocRef2);
    if (docSnapshot2.data() && docSnapshot2.data().home) {
      setHomeDetails(true);
    }
  };
  React.useEffect(() => {
    setTimeout(() => {
      setShowLoader(false);
    }, 2000);
    fetchHomeDetails(router.query._id);
  }, [router.query._id]);
  const fetchUserInfo = async () => {
    const userInfoCollectionRef = collection(
      db,
      "userchatlist",
      props.user._id,
      "userInfo"
    );
    const querySnapshot = await getDocs(userInfoCollectionRef);

    const userInfoData = [];
    querySnapshot.forEach((doc) => {
      userInfoData.push(doc.data());
    });
    fetchHomeDetails(
      router.query._id ? router.query._id : userInfoData[0].userId
    );
    setUserList(userInfoData);
  };

  const fetchSingleUserDetails = async (id1, id2) => {
    if (!props.user) return; // Exit early if props.user is falsy

    const userChatListRef = collection(db, "userchatlist");
    const userInfoDocRef = doc(userChatListRef, id1, "userInfo", id2);
    const docSnapshot = await getDoc(userInfoDocRef);
    if (docSnapshot.exists()) {
      const userInfoData = docSnapshot.data();
      return userInfoData;
    }
  };

  React.useEffect(() => {
    if (props.user && props.user !== "NO_USER") {
      fetchUserInfo();
      fetchSingleUserDetails(props.user._id, router.query._id)
        .then((val) => {
          setActiveUser(val);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [props.user]);

  const handleMoveIn = (status, intiatedBy, ownerId) => {
    axios({
      method: "post",
      url: `/moveIn/addMoveIns`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        ownerId,
        intiatedBy,
        moveInStatus: status,
      },
    })
      .then((res) => {})
      .catch((err) => {});
  };
  const makePayment = (_id) => {
    setPayment(true);
    axios({
      method: "post",
      url: `/paymnet/createPayment`,
      basic: true,
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: { userId: props.home ? router.query._id : props.user._id },
    })
      .then((res) => {
        setPayment(false);
        window.open(res.data.url, "_blank");
      })
      .catch((err) => {
        setPayment(false);
        console.log(err);
      });
  };
  //   React.useEffect(() => {
  //     scrollToBottom();
  //   }, [chatList]);

  //@INFO : TO FETCH SINGLE USER DETAIL
  const fetchUserMsgCount = async (id1, id2) => {
    if (!props.user) return; // Exit early if props.user is falsy

    const userChatListRef = collection(db, "userchatlist");
    const userInfoDocRef = doc(userChatListRef, id1, "userInfo", id2);
    const docSnapshot = await getDoc(userInfoDocRef);
    if (docSnapshot.exists()) {
      const userInfoData = docSnapshot.data();
      return userInfoData.msgCount;
    }
  };

  //@INFO : UPDATE MSG COUNT
  const updateMsgCount = async (id1, id2, count) => {
    let findActiveUserDetail = await fetchSingleUserDetails(id1, id2);
    if (findActiveUserDetail) {
      await updateDoc(doc(db, `userchatlist/${id1}/userInfo/${id2}`), {
        msgCount: count,
      });
    }
  };
  const deleteNewChatBetween = (senderId, recieverId) => {
    axios({
      method: "delete",
      url: `/chat/deleteChatBetween`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        senderId: props.user._id,
        recieverId: router.query._id,
      },
    })
      .then((res) => {})
      .catch((err) => {});
  };
  const updateNewChatBetween = () => {
    axios({
      method: "post",
      url: `/chat/updateChatBetween`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        senderId: props.user._id,
        recieverId: router.query._id,
      },
    })
      .then((res) => {
        deleteNewChatBetween(router.query._id, props.user._id);
      })
      .catch((err) => {});
  };

  const fetchMessages = async (activeData) => {
    try {
      const chatRef = collection(
        db,
        `chats/${props?.user?._id}/chatUsers/${router.query._id}/messages`
      );

      const unsubscribe = onSnapshot(chatRef, (snapshot) => {
        deleteNewChatBetween(router.query._id, props.user._id);
        const messages = [];
        snapshot.forEach((doc) => {
          messages.push(doc.data());
        });

        const sortedMessages = messages.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        setChatList(sortedMessages);
      });

      // Return the unsubscribe function to detach the listener when needed
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching messages: ", error);
    }
  };

  const updateLastMessage = async (id1, id2, msg) => {
    let findActiveUserDetail = await fetchSingleUserDetails(id1, id2);
    if (findActiveUserDetail) {
      await updateDoc(doc(db, `userchatlist/${id1}/userInfo/${id2}`), {
        lastMessage: msg,
        date: new Date(),
      });
    }
    await updateDoc(doc(db, `userchatlist/${id2}/userInfo/${id1}`), {
      lastMessage: msg,
      date: new Date(),
    });
  };
  React.useEffect(() => {
    let unsubscribe;

    if (router.query._id && props.user && props.user !== "NO_USER") {
      updateMsgCount(props.user._id, router.query._id, 0);
      fetchMessages()
        .then((unsub) => {
          unsubscribe = unsub;
        })
        .catch((error) => {
          console.error("Error subscribing to messages: ", error);
        });
    }

    return () => {
      // Clean up the listener when the component unmounts
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [router.query, props.user]);

  const updateRecieverSide = async (recieverId) => {
    try {
      await setDoc(
        doc(db, `userchatlist/${recieverId}/userInfo/${props.user._id}`),
        {
          firstName: props.user?.userProfile?.firstName,
          img: props.user?.userProfile?.images[0],
          userId: props.user._id,
          msgCount: msgCount,
          lastMessage: msg,
        }
      );
    } catch (error) {
      console.error("Error saving custom ID document: ", error);
    }
  };

  const sendMessage = async (receiverId) => {
    setMsgCount(msgCount + 1);
    try {
      await addDoc(
        collection(
          db,
          `chats/${props?.user?._id}/chatUsers/${receiverId}/messages`
        ),
        {
          msg: msg,
          from: props?.user?._id,
          msgSeen: false,
          timestamp: new Date().toISOString(),
        }
      );
      fetchMessages();

      await addDoc(
        collection(
          db,
          `chats/${receiverId}/chatUsers/${props?.user?._id}/messages`
        ),
        {
          msg: msg,
          from: props?.user?._id,
          msgSeen: false,
          timestamp: new Date().toISOString(),
        }
      );

      setMsg("");
      let recieverData = await fetchSingleUserDetails(
        receiverId,
        props.user._id
      );

      !recieverData && updateRecieverSide(receiverId, 1);

      let oldMsgCount = await fetchUserMsgCount(receiverId, props.user._id);
      updateMsgCount(
        receiverId ?? router.query._id,
        props.user._id,
        !isNaN(oldMsgCount) ? Number(oldMsgCount ?? 0) + 1 : 1
      );
      updateLastMessage(receiverId ?? router.query._id, props.user._id, msg);
      updateNewChatBetween();
    } catch (error) {
      console.error("Error adding new document: ", error);
    }
  };

  //@INFO : UPDATE MOVEIN
  const updateMoveIN = async (activeuser) => {
    console.log("TETTEVHBFS");
    const senderChatlistRef = doc(
      db,
      `userchatlist/${props.user && props.user._id}/userInfo/${
        router.query._id
      }`
    );

    const senderChatlistListener = onSnapshot(senderChatlistRef, (snapshot) => {
      const moveInStatus = snapshot.data()?.moveIn;

      if (moveInStatus && moveInStatus !== activeuser?.moveIn) {
        setActiveUser({ moveIn: "" });
        setActiveUser((prevUser) => ({
          ...prevUser,
          moveIn: moveInStatus,
        }));
      }
    });

    return senderChatlistListener;
  };

  //@INFO UPDATE MOVIN INFO
  const updateMoveInStatus = async (recieverId, statusA, statusB) => {
    try {
      let recieverData = await fetchSingleUserDetails(
        recieverId,
        props.user._id
      );

      if (recieverData) {
        await updateDoc(
          doc(db, `userchatlist/${recieverId}/userInfo/${props.user._id}`),
          {
            moveIn: statusA,
          }
        );
      }

      if (!recieverData) {
        await setDoc(
          doc(db, `userchatlist/${recieverId}/userInfo/${props.user._id}`),
          {
            firstName:
              props.user?.userProfile?.firstName +
              " " +
              props.user?.userProfile?.lastName,
            img: props.user?.userProfile?.images[0],
            userId: props.user._id,
            msgCount: 0,
          }
        );
      }
      await updateDoc(
        doc(db, `userchatlist/${props.user._id}/userInfo/${recieverId}`),
        {
          moveIn: statusB,
        }
      );

      if (statusA === "GOT-REQUEST") {
        await addDoc(
          collection(
            db,
            `chats/${props?.user?._id}/chatUsers/${recieverId}/messages`
          ),
          {
            msg: "",
            request: "SENT",
            msgSeen: false,
            timestamp: new Date().toISOString(),
          }
        );

        await addDoc(
          collection(
            db,
            `chats/${recieverId}/chatUsers/${props.user._id}/messages`
          ),
          {
            msg: "",
            request: "RECIEVED",
            msgSeen: false,
            timestamp: new Date().toISOString(),
          }
        );
      }
      // handleMoveIn(statusB);
      updateMoveIN();
      setOpenMoveIn(false);
    } catch (error) {
      console.error("Error saving custom ID document: ", error);
    }
  };

  React.useEffect(() => {
    let unsubscribeMove;
    console.log(activeUser);
    if (activeUser && props.user) {
      // Define an async function inside the effect to use `await`
      const updateMoveINAsync = async () => {
        try {
          unsubscribeMove = await updateMoveIN(activeUser);
        } catch (error) {
          console.error("Error subscribing to messages: ", error);
        }
      };

      updateMoveINAsync();

      // Cleanup function
      return () => {
        if (unsubscribeMove) {
          unsubscribeMove();
        }
      };
    }
  }, [activeUser, props.user, router.query._id]);

  return (
    <div className={styles.container}>
      {showLoader && <AppLoader />}
      {!showLoader && (
        <>
          <CommonModal
            className="userProfile"
            size="lg"
            show={openMoveIn}
            setShow={() => {
              setOpenMoveIn(false);
            }}
            bodyContent={
              <div className={styles.requestContainer}>
                <Lottie options={defaultOptions} height={250} width={250} />
                <h2>Confirm move-in request</h2>
                <p>
                  Are you sure you want to sent a move-in request to <br />{" "}
                  {router.query.firstName}?{" "}
                  {props.home && (
                    <span>
                      Once accepted you’ll be billed the <br /> success fee of
                      3% of the annual rent amount.
                    </span>
                  )}
                </p>
                <button
                  onClick={() => {
                    updateMoveInStatus(
                      router.query._id,
                      "GOT-REQUEST",
                      "REQUESTED"
                    );
                    handleMoveIn(
                      "REQUSTED",
                      props.user._id,
                      homeDetails ? router.query._id : props.user._id
                    );
                  }}
                >
                  Continue
                </button>
                <span onClick={() => setOpenMoveIn(false)}>Cancel</span>
              </div>
            }
          />
          <div className={styles.headerChat}>
            <div className={styles.leftHeader}>
              <div className={styles.leftUserHead}>
                <img src={router.query && router.query.img} />
              </div>
              <div className={styles.rightUserHead}>
                <h3>{router.query && router.query.firstName}</h3>
                <p
                  onClick={() =>
                    router.push(`mates?_id=${router.query && router.query._id}`)
                  }
                >
                  View profile
                </p>
              </div>
            </div>

            <div className={styles.rightHeader}>
              {((!homeDetails && props.home) || (!props.home && homeDetails)) &&
                !(props.home && homeDetails) &&
                activeUser &&
                !activeUser.moveIn && (
                  <button onClick={() => setOpenMoveIn(true)}>
                    Let's move in
                  </button>
                )}
              {!homeDetails &&
                !props.home &&
                activeUser &&
                !activeUser.moveIn && (
                  <button
                    onClick={() =>
                      updateMoveInStatus(
                        router.query._id,
                        "GOT-BUDDY-REQUEST",
                        "BUDDY-REQUESTED"
                      )
                    }
                  >
                    Let's Buddy up
                  </button>
                )}
              {activeUser && activeUser.moveIn === "REQUESTED" && (
                <p>Request Sent</p>
              )}
              {activeUser && activeUser.moveIn === "ACCEPTED" && (
                <p>Payment Pending</p>
              )}
              {activeUser && activeUser.moveIn === "BUDDY-REQUESTED" && (
                <button>Buddy up requested</button>
              )}
              {activeUser && activeUser.moveIn === "BUDDIES" && (
                <button>BUDDIES</button>
              )}
              {activeUser && activeUser.moveIn === "PAYMENT" && (
                <button
                  onClick={() => {
                    makePayment();
                  }}
                >
                  {payment ? "Redirecting..." : "Make Payment"}
                </button>
              )}
            </div>
          </div>
          <div className={styles.chats} id="chatContainer">
            {activeUser && activeUser.moveIn === "GOT-REQUEST" && (
              <div className={styles.request}>
                <h5>{router.query.firstName} has sent request to move in.</h5>
                <div className={styles.requestRight}>
                  <div
                    className={styles.options}
                    style={{
                      borderRight: "solid 1px lightgrey",
                    }}
                  >
                    <p
                      style={{ color: "#f8cd46" }}
                      onClick={() => {
                        updateMoveInStatus(
                          router.query._id,
                          homeDetails ? "PAYMENT" : "ACCEPTED",
                          props.home ? "PAYMENT" : "ACCEPTED"
                        );
                        handleMoveIn(
                          "ACCEPTED",
                          router.query._id,
                          homeDetails ? router.query._id : props.user._id
                        );
                      }}
                    >
                      Accept
                    </p>
                  </div>

                  <div className={styles.options}>
                    <p
                      onClick={() => {
                        updateMoveInStatus(
                          router.query._id,
                          "REJECTED",
                          "REJECTED"
                        );
                        handleMoveIn(
                          "REJECTED",
                          router.query._id,
                          homeDetails ? router.query._id : props.user._id
                        );
                      }}
                    >
                      Reject
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeUser && activeUser.moveIn === "GOT-BUDDY-REQUEST" && (
              <div className={styles.request}>
                <h5>{router.query.firstName} has sent request to buddy up.</h5>
                <div className={styles.requestRight}>
                  <div
                    className={styles.options}
                    style={{
                      borderRight: "solid 1px lightgrey",
                    }}
                  >
                    <p
                      style={{ color: "#f8cd46" }}
                      onClick={() => {
                        updateMoveInStatus(
                          router.query._id,
                          "BUDDIES",
                          "BUDDIES"
                        );
                        handleMoveIn(
                          "BUDDIES",
                          router.query._id,
                          props.user._id
                        );
                      }}
                    >
                      Accept
                    </p>
                  </div>

                  <div className={styles.options}>
                    <p
                      onClick={() => {
                        updateMoveInStatus(
                          router.query._id,
                          "REJECTED",
                          "REJECTED"
                        );
                        handleMoveIn(
                          "REJECTED",
                          router.query._id,
                          homeDetails ? router.query._id : props.user._id
                        );
                      }}
                    >
                      Reject
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className={styles.moveInReq}>
              <TbLock color="#909090" />
              <p>
                This conversation may be reviewed by HomeShare to ensure the
                safety of our users. To read more, click
                <span onClick={() => router.push("/privacy")}> here</span>
              </p>
            </div>
            {chatList &&
              chatList.map((val, index) => {
                const messageDate = moment(val.timestamp).startOf("day");
                const todayDate = moment().startOf("day");
                const yesterdayDate = moment()
                  .subtract(1, "day")
                  .startOf("day");

                let dateTag = null;
                if (messageDate.isSame(todayDate, "day")) {
                  dateTag = "Today";
                } else if (messageDate.isSame(yesterdayDate, "day")) {
                  dateTag = "Yesterday";
                }

                // Check if the current message has the same date as the previous message
                const previousMessage = chatList[index - 1];
                const previousMessageDate = previousMessage
                  ? moment(previousMessage.timestamp).startOf("day")
                  : null;
                const isSameDayAsPrevious = messageDate.isSame(
                  previousMessageDate,
                  "day"
                );

                // Only render the date tag if it's the first message of the day
                const shouldRenderDateTag =
                  !isSameDayAsPrevious && dateTag !== null;
                return (
                  <>
                    {shouldRenderDateTag && (
                      <div className={styles.dateTag}>{dateTag}</div>
                    )}
                    {val.request && val.request === "SENT" && (
                      <div className={styles.moveInReq}>
                        <p>
                          {val.request === "SENT" &&
                            `You sent ${
                              router.query.firstName
                            } a move in request • ${moment(
                              val.timestamp
                            ).format("DD MMM YYYY")} • ${moment(
                              val.timestamp
                            ).format("LT")}`}
                        </p>
                      </div>
                    )}
                    {val.msg && (
                      <div
                        className={
                          val.from !== props.user._id
                            ? styles.leftSide
                            : styles.rightSide
                        }
                        key={index}
                      >
                        <div className={styles.details}>
                          <h5>
                            {val.from === props.user._id
                              ? "You"
                              : router.query.firstName}
                          </h5>
                          <p>
                            {val.msg}

                            <span>{moment(val.timestamp).format("LT")}</span>
                          </p>
                        </div>
                      </div>
                    )}
                    {val.img && (
                      <div
                        className={
                          val.from !== props.user._id
                            ? styles.leftSide
                            : styles.rightSide
                        }
                        key={index}
                      >
                        <div className={styles.details}>
                          <p>
                            <img
                              onClick={() => window.open(val.img, "_self")}
                              src={val.img}
                              width="200"
                              height="200"
                              alt="...loading"
                            />
                            <span>{moment(val.timestamp).format("LT")}</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                );
              })}
          </div>
          <div className={styles.inputBox}>
            <TextArea
              size="large"
              autoSize={{ minRows: 1, maxRows: 3 }}
              value={msg}
              onChange={(e) => {
                setMsg(e.target.value);
              }}
              style={{ paddingRight: "35px" }}
              // onKeyDown={(e) => {
              //   if (e.key === "Enter") {
              //     if (msg.trim() !== "") {
              //       sendMessage(router.query._id);
              //     }
              //   }
              // }}
              className="searchAnt"
              placeholder="Type here"
            />
            {msg && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {" "}
                <AiOutlineSend
                  size="1.7rem"
                  onClick={() => {
                    if (msg.trim() !== "") {
                      sendMessage(router.query._id);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    home: state.auth.userProperty,
  };
};
export default connect(mapStateToProps, { getContent })(UserChat);
