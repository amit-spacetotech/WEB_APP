import React from "react";
import styles from "./message.module.css";
import { connect } from "react-redux";
import { Input } from "antd";
import { useRouter } from "next/router";
import { FiSearch } from "react-icons/fi";
import { FaKeyboard } from "react-icons/fa";
import { FiImage } from "react-icons/fi";
import { GrAttachment } from "react-icons/gr";
import { FiSmile } from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import { TbLock } from "react-icons/tb";
import {
  addDoc,
  doc,
  getDoc,
  collection,
  setDoc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../config/config";
import { getUser } from "@/redux/actions/auth";
import moment from "moment";
import CommonModal from "@/components/common/modal";
import Lottie from "react-lottie";
import createProfile_end from "../../../assets/createProfile/createProfile_end.json";
import handleFileUpload from "@/utils/uploadImage";
import axios from "axios";
import AppLoader from "@/utils/AppLoader/AppLoader";
function Messages(props) {
  const router = useRouter();
  const target = React.useRef(null);
  const [loader, setLoader] = React.useState(false);
  const [showPopover, setShowPopover] = React.useState(false);
  const [payment, setPayment] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [userList, setUserList] = React.useState();
  const [msg, setMsg] = React.useState("");
  const [msgCount, setMsgCount] = React.useState(0);
  const [activeUser, setActiveUser] = React.useState("");
  const [chatList, setChatList] = React.useState([]);
  const [openMoveIn, setOpenMoveIn] = React.useState(false);
  const [imageUploading, setImageUploading] = React.useState(false);
  const [homeDetails, setHomeDetails] = React.useState();
  const [profile, setProfile] = React.useState(false);
  const { TextArea } = Input;
  const handleMyAccountClick = () => {
    setShowPopover(!showPopover);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: createProfile_end,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  // @INFO : TO SCROLL TO BOTTOM OF CHAT
  const scrollToBottom = () => {
    const container = document.getElementById("chatContainer");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };
  const fetchHomeDetails = async (id) => {
    setHomeDetails(false);
    const userChatListRef2 = collection(db, "userList");
    const userInfoDocRef2 = doc(userChatListRef2, id);
    const docSnapshot2 = await getDoc(userInfoDocRef2);
    console.log(docSnapshot2.data(), "SDSDSD");
    if (docSnapshot2.data() && docSnapshot2.data().home) {
      setHomeDetails(true);
    }
  };

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
  const deleteNewChatBetween = (senderId, recieverId) => {
    axios({
      method: "delete",
      url: `/chat/deleteChatBetween`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        senderId: senderId,
        recieverId: recieverId,
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

  const makePayment = (_id) => {
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
        setPayment(true);
        window.open(res.data.url, "_blank");
      })
      .catch((err) => {
        setPayment(false);
        console.log(err);
      });
  };
  //@INFO : UPDATE MOVEIN
  const updateMoveIN = async (activeuser) => {
    const senderChatlistRef = doc(
      db,
      `userchatlist/${props.user._id}/userInfo/${router.query._id}`
    );

    const senderChatlistListener = onSnapshot(senderChatlistRef, (snapshot) => {
      const moveInStatus = snapshot.data()?.moveIn;

      if (moveInStatus && moveInStatus !== activeuser?.moveIn) {
        setActiveUser((prevUser) => ({
          ...prevUser,
          moveIn: moveInStatus,
        }));
      }
    });

    return senderChatlistListener;
  };

  //@INFO : TO FETCH ALL THE USER TO WHICH LOGINNED USER HAS DONE CHAT
  const fetchUserInfo = async (dontUpdate) => {
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
    const filteredArray = userInfoData.filter(
      (obj) =>
        obj.userId ===
        (router.query.userId ? router.query.userId : router.query._id)
    );

    !dontUpdate &&
      setActiveUser(
        filteredArray && filteredArray.length > 0
          ? filteredArray[0]
          : userInfoData[0]
      );
    setUserList(userInfoData);
    !dontUpdate &&
      fetchMessages(
        filteredArray && filteredArray.length > 0
          ? filteredArray[0]
          : userInfoData[0]
      );
    if (
      router.query.userId ||
      (userInfoData.length > 0 && userInfoData[0].userId)
    ) {
      fetchHomeDetails(
        router.query.userId ? router.query.userId : userInfoData[0].userId
      );
    }
    userInfoData.length > 0 &&
      router.push(
        `/messages?_id=${
          router.query.userId ? router.query.userId : userInfoData[0].userId
        }&img=${
          router.query.img ? router.query.img : userInfoData[0].img
        }&firstName=${
          router.query.firstName
            ? router.query.firstName
            : userInfoData[0].firstName
        }&lastMessage=${
          router.query.lastMessage
            ? router.query.lastMessage
            : userInfoData[0].lastMessage
        }`
      );
  };

  React.useEffect(() => {
    if (props.user && props.user !== "NO_USER") {
      const userInfoCollectionRef = collection(
        db,
        "userchatlist",
        props.user._id,
        "userInfo"
      );

      const unsubscribe = onSnapshot(userInfoCollectionRef, (snapshot) => {
        const userInfoData = [];
        snapshot.forEach((doc) => {
          userInfoData.push(doc.data());
        });
        const sortedUserInfoData = userInfoData.slice().sort((a, b) => {
          if (a.date && b.date) {
            return b.date - a.date;
          }
          if (!a.date && b.date) {
            return 1;
          }
          if (a.date && !b.date) {
            return -1;
          }
          return 0;
        });

        setUserList(sortedUserInfoData);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [props.user._id]);
  //@INFO : TO UPDATE SAME MESSAGE ON RECIEVER SIDE
  const updateRecieverSide = async (recieverId, countMsg) => {
    try {
      await setDoc(
        doc(db, `userchatlist/${recieverId}/userInfo/${props.user._id}`),
        {
          firstName:
            props.user?.userProfile?.firstName +
            " " +
            props.user?.userProfile?.lastName,
          img: props.user?.userProfile?.images[0],
          userId: props.user._id,
          msgCount: countMsg ?? msgCount,
          lastMessage: msg,
        }
      );
    } catch (error) {
      console.error("Error saving custom ID document: ", error);
    }
  };

  //@INFO
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

  //@INFO : UPDATE MSG COUNT
  const updateMsgCount = async (id1, id2, count) => {
    let findActiveUserDetail = await fetchSingleUserDetails(id1, id2);
    if (findActiveUserDetail) {
      await updateDoc(doc(db, `userchatlist/${id1}/userInfo/${id2}`), {
        msgCount: count,
      });
    }
  };
  const updateLastMessage = async (id1, id2) => {
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
            `abc/${props?.user?._id}/messages/${recieverId}/messages`
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

  //@INFO : TO FETCH ACTIVE USER ALL MESSAGES
  const fetchMessages = async () => {
    try {
      const chatRef = collection(
        db,
        `chats/${props?.user?._id}/chatUsers/${router.query._id}/messages`
      );

      const unsubscribe = onSnapshot(chatRef, (snapshot) => {
        console.log(router.query._id, props.user._id);
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
        if (router.query._id && props.user._id) {
          updateMsgCount(props?.user?._id, router.query._id, 0);
        }
      });

      // Return the unsubscribe function to detach the listener when needed
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching messages: ", error);
    }
  };

  //@INFO : FUNCTION TO SEND MESSAGE
  const sendMessage = async (receiverId, img) => {
    setMsgCount(msgCount + 1);
    let finalMessage = msg;
    setMsg("");
    try {
      await addDoc(
        collection(
          db,
          `chats/${props?.user?._id}/chatUsers/${receiverId}/messages`
        ),
        {
          msg: finalMessage,
          img: img ? img : false,
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
          msg: finalMessage,
          img: img ? img : false,
          from: props?.user?._id,
          msgSeen: false,
          timestamp: new Date().toISOString(),
        }
      );

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
      updateLastMessage(receiverId ?? router.query._id, props.user._id);
      updateNewChatBetween();
    } catch (error) {
      console.error("Error adding new document: ", error);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setImageUploading(true);
    let url = handleFileUpload(file)
      .then((val) => {
        setImageUploading(false);
        sendMessage(router.query._id, val);
      })
      .catch((err) => [setImageUploading(false)]);
  };

  //@INFO TO SCROLL AT BOTTOM
  React.useEffect(() => {
    scrollToBottom();
  }, [chatList]);
  //@INFO : TO SAVE USER DETAILS FOR FIRST TIME CHAT
  React.useEffect(() => {
    const saveCustomDocumentId = async (customId) => {
      try {
        await setDoc(
          doc(db, `userchatlist/${props.user._id}/userInfo/${customId}`),
          {
            firstName: router.query.firstName + " " + router.query?.lastName,
            img: router.query.img,
            userId: customId,
            msgCount: 0,
            lastMessage: "",
          }
        );

        fetchUserInfo();
      } catch (error) {
        console.error("Error saving custom ID document: ", error);
      }
    };

    if (
      router.query.userId &&
      props.user &&
      props.user !== "NO_USER" &&
      !userList
    ) {
      saveCustomDocumentId(router.query.userId);
    }
    if (
      !router.query.userId &&
      props.user &&
      props.user !== "NO_USER" &&
      !userList
    ) {
      fetchUserInfo();
    }
    // }
  }, [props.user]);

  // @INFO : TO FETCH MESSAGES REAL TIME
  React.useEffect(() => {
    let unsubscribe;

    if (props.user && router.query._id) {
      console.log("ITS HERE");
      // updateMsgCount();
      fetchMessages()
        .then((unsub) => {
          unsubscribe = unsub;
        })
        .catch((error) => {
          console.error("Error subscribing to messages: ", error);
        });
    }
    return () => {
      //@INFO: Clean up the listener when the component unmounts
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [props.user, router.query._id]);

  React.useEffect(() => {
    let unsubscribeMove;
    console.log(activeUser);
    if (activeUser && props.user) {
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
                <>
                  {" "}
                  Once accepted you’ll be billed the <br /> success fee of 3% of
                  the annual rent amount.
                </>
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

      <div className={styles.content}>
        <div className={styles.leftContent}>
          <h2>Messages</h2>
          <Input
            size="large"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="searchAnt"
            placeholder="Search messages"
            prefix={<FiSearch />}
          />

          {userList &&
            userList.map((val, index) => {
              return (
                <>
                  {val.firstName
                    .toLowerCase()
                    .includes(search.toLowerCase()) && (
                    <div
                      key={index}
                      className={`${styles.userData} ${
                        router.query._id === val.userId && styles.activeUser
                      }`}
                      onClick={() => {
                        setLoader(true);
                        setTimeout(() => {
                          setLoader(false);
                        }, 850);
                        setTimeout(() => {
                          fetchHomeDetails(val.userId);
                          setActiveUser({ moveIn: "" });
                        }, 100);

                        router.push(
                          `/messages?_id=${val.userId}&img=${val.img}&firstName=${val.firstName}&lastName=${val?.lastName}&lastMessage=${val.lastMessage}`
                        );

                        fetchMessages(val);
                        setMsgCount(0);
                      }}
                    >
                      <div className={styles.leftUser}>
                        <img src={val?.img} />
                      </div>
                      <div className={styles.rightUser}>
                        <h3>{val?.firstName}</h3>
                        <p>{val?.lastMessage}</p>
                      </div>
                    </div>
                  )}
                </>
              );
            })}
        </div>

        <div className={styles.rightContent}>
          {loader && <AppLoader />}
          {!loader && router.query._id && (
            <>
              <div className={styles.header}>
                <div className={styles.leftHeader}>
                  <div className={styles.leftUserHead}>
                    <img src={router.query && router.query.img} />
                  </div>
                  <div className={styles.rightUserHead}>
                    <h3>{router.query && router.query.firstName}</h3>
                    <p
                      onClick={() => {
                        router.push(`/mates?_id=${router.query?._id}`);
                      }}
                    >
                      View full profile
                    </p>
                  </div>
                </div>
                <div className={styles.rightHeader}>
                  {((!homeDetails && props.home) ||
                    (!props.home && homeDetails)) &&
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
                        onClick={() => {
                          {
                            updateMoveInStatus(
                              router.query._id,
                              "GOT-BUDDY-REQUEST",
                              "BUDDY-REQUESTED"
                            );
                          }
                        }}
                      >
                        Let's Buddy up
                      </button>
                    )}
                  {activeUser && activeUser.moveIn === "REQUESTED" && (
                    <p>Request Sent</p>
                  )}
                  {activeUser && activeUser.moveIn === "BUDDY-REQUESTED" && (
                    <button>Buddy up requested</button>
                  )}
                  {activeUser && activeUser.moveIn === "BUDDIES" && (
                    <button>BUDDIES</button>
                  )}
                  {activeUser && activeUser.moveIn === "ACCEPTED" && (
                    <p>Payment Pending</p>
                  )}
                  {activeUser && activeUser.moveIn === "PAYMENT" && (
                    <button
                      onClick={() => {
                        setPayment(true);
                        makePayment();
                      }}
                    >
                      {payment ? "...Redirecting" : " Make Payment"}
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.chats} id="chatContainer">
                {activeUser && activeUser.moveIn === "GOT-REQUEST" && (
                  <div className={styles.request}>
                    <h5>
                      {router.query.firstName} has sent request to move in.
                    </h5>
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
                    <h5>
                      {router.query.firstName} has sent request to buddy up.
                    </h5>
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
                {chatList.map((val, index) => {
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
              <div className={styles.footer}>
                <div className={styles.leftFooter}>
                  <TextArea
                    size="large"
                    rows={1}
                    value={msg}
                    disabled={imageUploading ? true : false}
                    onChange={(e) => {
                      setMsg(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (msg.trim() !== "") {
                          sendMessage(router.query._id);
                        }
                      } else if (e.key === "Enter" && e.shiftKey) {
                        setMsg((prevMsg) => prevMsg + "\n");
                        e.preventDefault();
                      }
                    }}
                    className="searchAnt"
                    placeholder={
                      imageUploading
                        ? "Image Uploading Please wait..."
                        : "Type here"
                    }
                    suffix={<FaKeyboard size="1.7rem" />}
                  />
                </div>
                <div className={styles.rightFooter}>
                  {/* <GrAttachment color="#B3B3B3" size="1.7rem" /> */}
                  <div ref={target}>
                    <FiSmile
                      color="#B3B3B3"
                      size="1.7rem"
                      onClick={handleMyAccountClick}
                    />
                  </div>
                  <Overlay
                    show={showPopover}
                    target={target.current}
                    placement="top"
                    rootClose={true}
                    onHide={() => setShowPopover(false)}
                  >
                    <Popover id="popover-my-account">
                      <Popover.Body className={styles.popOverBody}>
                        <EmojiPicker
                          width="100%"
                          onEmojiClick={(e) => setMsg(msg + e.emoji)}
                        />
                      </Popover.Body>
                    </Popover>
                  </Overlay>
                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleFileInputChange}
                  />
                  <FiImage
                    color="#B3B3B3"
                    size="1.7rem"
                    onClick={() => document.getElementById("fileInput").click()}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    home: state.auth.userProperty,
  };
};

export default connect(mapStateToProps, { getUser })(Messages);
