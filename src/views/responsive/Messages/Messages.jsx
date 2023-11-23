import React from "react";
import styles from "./messages.module.css";
import { connect } from "react-redux";
import { getContent } from "../../../redux/actions/contentAction";
import { BiSearch } from "react-icons/bi";
import {
  doc,
  collection,
  setDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../config/config";
import { useRouter } from "next/router";
function Messages(props) {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const router = useRouter();
  const [userList, setUserList] = React.useState();
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
    setUserList(userInfoData);
  };

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
      router.push(
        `/chat?_id=${
          router.query.userId ? router.query.userId : router.query?._id
        }&img=${router.query.img ? router.query.img : ""}&firstName=${
          router.query.firstName ? router.query.firstName : ""
        }&lastMessage=${router.query.lastMessage ?? ""}`
      );
      fetchUserInfo();
    } catch (error) {
      console.error("Error saving custom ID document: ", error);
    }
  };
  React.useEffect(() => {
    if (props.user) {
      fetchUserInfo();
    }
    if (router.query.userId && props.user && !userList) {
      saveCustomDocumentId(router.query.userId);
    }
  }, [props.user]);
  React.useEffect(() => {
    if (props.user) {
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Messages</h2>
        {!searchOpen && (
          <BiSearch
            color="white"
            size="1.1rem"
            onClick={() => setSearchOpen(true)}
          />
        )}
        {searchOpen && (
          <input
            placeholder="Search here"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
      </div>
      <div className={styles.userList}>
        {userList &&
          userList.map((val, index) => {
            return (
              <>
                {val.firstName.includes(search) && (
                  <div
                    className={`${styles.user} ${
                      val.msgCount > 0 && styles.activeUser
                    }`}
                    key={index}
                    onClick={() => {
                      setSearchOpen(false);
                      router.push(
                        `/chat?_id=${val.userId}&img=${val.img}&firstName=${val.firstName}`
                      );
                    }}
                  >
                    <div className={styles.leftList}>
                      <img src={val.img} />
                    </div>
                    <div className={styles.rightList}>
                      <h3>{val?.firstName}</h3>
                      <p>{val?.lastMessage}</p>
                    </div>
                    <div className={styles.endList}>
                      {val.msgCount > 0 && (
                        <p>{val.msgCount > 0 && val.msgCount}</p>
                      )}
                    </div>
                  </div>
                )}
              </>
            );
          })}
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};
export default connect(mapStateToProps, { getContent })(Messages);
