import React, { useState } from "react";
import DashCard from "./dashCard";
import styles from "./home.module.css";
import { BsFillPeopleFill } from "react-icons/bs";
import { HiHome } from "react-icons/hi";
import { TbFilter } from "react-icons/tb";
import { FiSearch } from "react-icons/fi";
import { connect } from "react-redux";
import {
  getHouseMates,
  getFilteredHouseMates,
  getUser,
  getHomes,
  getFavorites,
} from "@/redux/actions/auth";
import AppLoader from "@/utils/AppLoader/AppLoader";
import { Pagination } from "react-bootstrap";
import CommonModal from "@/components/common/modal";
import HouseMateFilter from "./Filters/houseMateFilter";
import HomesFilter from "./Filters/homesFilter";
import axios from "axios";
import { useRouter } from "next/router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/config";
import { getCities } from "@/redux/actions/contentAction";

function HomePage(props) {
  const router = useRouter();
  const [selected, setSelected] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = React.useState("");
  const [favoritesList, setFavoritesList] = React.useState([]);
  const [modal, setModal] = React.useState({
    home: false,
    houseMate: false,
  });
  const [homes, setHome] = React.useState({
    search: "",
    currentPage: 1,
    minRent: 0,
    maxRent: 20000,
    isPetsAllowed: "",
    bedRooms: 0,
    bathRooms: 0,
    minSize: 0,
    maxSize: 2500,
  });

  const [houseMates, setHouseMates] = React.useState({
    minRent: 0,
    maxRent: 20000,
    minAge: 0,
    havePets: true,
    maxAge: 30,
    interest: [],
    gender: [],
  });

  //@INFO : HOUSEMATE API FUNCTION FOR FILTER AND RESULTS
  const getHouseMateData = (pageNumber) => {
    let link = "";
    if (houseMates.interest.length > 0) {
      houseMates.interest.forEach((item) => {
        link += `&interest=${item}`;
      });
    }

    if (houseMates.gender.length > 0) {
      houseMates.gender.forEach((item) => {
        link += `&gender=${item}`;
      });
    }

    let pets = modal.houseMate ? houseMates.havePets : "";

    props.getHouseMates(
      pageNumber ?? 1,
      9,
      search,
      props.auth._id ?? "",
      houseMates.minRent,
      houseMates.maxRent,
      houseMates.minAge,
      houseMates.maxAge,
      pets,
      link
    );
  };

  //@INFO : GET HOMES DATA
  const getHomesData = (pageNumber, filter, data) => {
    console.log(
      data && String(data.isPetsAllowed)
        ? data.isPetsAllowed
        : homes.isPetsAllowed
    );
    props.getHomes(
      pageNumber ?? 1,
      9,
      homes.search,
      props.auth._id ?? "",
      data && data.bathRooms ? data.bathRooms : homes.bathRooms,
      data && data.bedRooms ? data.bedRooms : homes.bedRooms,
      data && String(data.isPetsAllowed)
        ? data.isPetsAllowed
        : homes.isPetsAllowed,
      data && data.minRent ? data.minRent : homes.minRent,
      data && data.maxRent ? data.maxRent : homes.maxRent,
      data && data.minSize ? data.minSize : homes.minSize,
      data && data.maxSize ? data.maxSize : homes.maxSize,
      filter,
      filter || data?.allowPet
    );
  };
  //@INFO : FOR TABS SWITCHING
  const handleClick = (pageNumber) => {
    if (selected === 1) {
      getHouseMateData(pageNumber);
      setCurrentPage(pageNumber);
      console.log(pageNumber, "j");
      return;
    }
    if (selected === 2) {
      getHomesData(pageNumber, false);
      setHome({ ...homes, currentPage: pageNumber });
      console.log(pageNumber, "l");
      return;
    }
  };

  React.useEffect(() => {
    if (props.auth && props.guest && !router.query.location) {
      router.push("/");
    }
  }, [props.auth, props.guest]);
  React.useEffect(() => {
    props.getCities();
  }, []);

  const updatePayment = () => {
    axios({
      method: "put",
      url: `/paymnet/updatePayment`,
      basic: true,
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: { nonce: router.query.nonce },
    })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };
  const updateMoveInStatus = async () => {
    try {
      await updateDoc(
        doc(
          db,
          `userchatlist/${router.query.ownerId}/userInfo/${props.auth._id}`
        ),
        {
          moveIn: "PAYMENT_DONE",
        }
      );

      await updateDoc(
        doc(
          db,
          `userchatlist/${props.auth._id}/userInfo/${router.query.ownerId}`
        ),
        {
          moveIn: "PAYMENT_DONE",
        }
      );
    } catch (error) {
      console.error("Error saving custom ID document: ", error);
    }
  };

  React.useEffect(() => {
    if (router.query.nonce) {
      updatePayment();
      updateMoveInStatus();
    }
  }, []);

  //@INFO : TO GENERATE LINK
  const generateLink = (data) => {
    let { maxRent, interest, minAge, maxAge, gender, minRent, havePets } =
      houseMates;
    if (data && data.havePets) {
      havePets = data.havePets;
    }
    if (data && data.age && data.minAge && data.maxAge) {
      minAge = data.age.minAge;
      maxAge = data.age.maxAge;
    }

    let link = `/utils/getAllMates?page=1&limit=1&minRent=${
      data && data.rent ? data.rent.minRent : minRent
    }&maxRent=${data && data.rent ? data.rent.maxRent : maxRent}&minAge=${
      data && data.age ? data.age.minAge : minAge
    }&maxAge=${data && data.age ? data.age.maxAge : maxAge}&_id=${
      props.auth._id ?? ""
    }&havePets=${havePets ? havePets : ""}`;
    if (data && data.interest) {
      interest = data.interest;
    }
    if (data && data.gender) {
      gender = data.gender;
    }

    if (interest.length > 0) {
      interest.forEach((item) => {
        link += `&interest=${item}`;
      });
    }

    if (gender.length > 0) {
      gender.forEach((item) => {
        link += `&gender=${item}`;
      });
    }

    return link;
  };

  const handleHouseFilter = (data) => {
    let link = generateLink(data);
    props.getFilteredHouseMates(link);
  };

  React.useEffect(() => {
    if (props.guest) {
      props.getHouseMates(1, 9, "", "");
    }
  }, []);
  //@INFO : SEARCH BAR HANDLER
  const handleSearch = (searchVal) => {
    if (selected === 1) {
      setSearch(searchVal);
      props.getHouseMates(1, 9, searchVal, props.auth._id);
    }
    if (selected === 2) {
      setHome({ ...homes, search: searchVal });
      props.getHomes(1, 9, homes.search, props.auth._id);
    }
  };

  const deleteProfileFavorite = (_id) => {
    const updatedArray = favoritesList.filter(
      (obj) => obj.userProfileId !== _id
    );
    alert("Favorite removed successfully");
    setFavoritesList(updatedArray);
    axios({
      method: "delete",
      url: `/favorites/removeFavorite`,
      basic: true,
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: { userProfileId: _id },
    })
      .then((res) => {
        props.getFavorites("userProfile");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addProfileFavorite = (_id) => {
    if (props.guest) {
      alert("Please login to make it favorite");
      return;
    }
    alert("Favorite added successfully");
    let newObject = { userProfileId: _id };
    setFavoritesList((prevArray) => [...prevArray, newObject]);
    axios({
      method: "post",
      url: `/favorites/addFavorites`,
      basic: true,
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: { userProfileId: _id },
    })
      .then((res) => {
        props.getFavorites("userProfile");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const addHomeFavorite = (_id) => {
    if (props.guest) {
      alert("Please login to make it favorite");
      return;
    }
    let newObject = { homeId: _id };
    setFavoritesList((prevArray) => [...prevArray, newObject]);
    axios({
      method: "post",
      url: `/favorites/addFavorites`,
      basic: true,
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: { homeId: _id },
    })
      .then((res) => {
        props.getFavorites("home");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteHomeFavorite = (_id) => {
    const updatedArray = favoritesList.filter((obj) => obj.homeId !== _id);
    setFavoritesList(updatedArray);
    axios({
      method: "delete",
      url: `/favorites/removeFavorite`,
      basic: true,
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: { homeId: _id },
    })
      .then((res) => {
        props.getFavorites("home");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const generatePageNumbers = (totalPage) => {
    let pageNumbers = [];

    for (let i = 1; i <= totalPage; i++) {
      pageNumbers.push(
        <Pagination.Item
          key={i}
          active={selected === 1 ? i === currentPage : i === homes.currentPage}
          onClick={() => handleClick(i)}
          activeclassname={styles.activePage}
        >
          {i}
        </Pagination.Item>
      );
    }

    return pageNumbers;
  };

  React.useEffect(() => {
    if (selected === 1 && !props.houseMates) {
      props.getHouseMates(1, 9, search, props.auth._id);
      !props.guest && props.getFavorites("userProfile");
    }
    if (selected === 2 && !props.homes) {
      props.getHomes(1, 9, homes.search, props.auth._id);
      !props.guest && props.getFavorites("home");
    }
  }, [selected]);

  React.useEffect(() => {
    if (favoritesList.length <= 0 && props.userFavorites) {
      setFavoritesList(props.userFavorites);
    }
  }, [props.userFavorites]);

  return (
    <div className={styles.container}>
      <CommonModal
        hide={true}
        className="filter"
        show={modal.houseMate}
        setShow={() => {
          setModal({ ...modal, houseMate: false });
        }}
        bodyContent={
          <HouseMateFilter
            setShow={() => {
              setModal({ ...modal, houseMate: false });
            }}
            getHouseMateData={getHouseMateData}
            houseMates={houseMates}
            handleHouseFilter={handleHouseFilter}
            setHouseMates={(val) => setHouseMates({ ...val })}
            count={props.houseMateFilterCount && props.houseMateFilterCount}
          />
        }
      />

      <CommonModal
        className="filter"
        show={modal.home}
        hide={true}
        setShow={() => {
          setModal({ ...modal, home: false });
        }}
        bodyContent={
          <HomesFilter
            setShow={() => {
              setModal({ ...modal, home: false });
            }}
            homes={homes}
            count={props.homeFilterContent && props.homeFilterContent}
            setHome={setHome}
            getHomesData={getHomesData}
          />
        }
      />

      <div className={styles.headContainer}>
        <div className={styles.head1}>
          <div
            className={`${selected === 1 && styles.active} ${styles.tab}`}
            onClick={() => {
              setSelected(1);
              props.getHouseMates(
                1,
                9,
                "",
                props.auth && props.auth._id ? props.auth._id : ""
              );
              props.getFavorites("userProfile");
            }}
          >
            <BsFillPeopleFill />

            <p
              className="fw-bolder"
              style={{ cursor: "pointer", marginBottom: "0.1rem" }}
            >
              Housemates
            </p>
            {selected == 1 && <div className={styles.hightLight}></div>}
          </div>
          <div
            className={`${selected === 2 && styles.active} ${styles.tab}`}
            onClick={() => {
              setSelected(2);
              props.getHomes(
                1,
                9,
                "",
                props.auth && props.auth._id ? props.auth._id : ""
              );
              props.getFavorites("home");
            }}
          >
            <HiHome />

            <p
              className="fw-bolder "
              style={{ cursor: "pointer", marginBottom: "0.1rem" }}
            >
              Homes
            </p>
            {selected == 2 && <div className={styles.hightLight}></div>}
          </div>
        </div>
        <div className={styles.head2}>
          <div className={styles.searchComp}>
            <FiSearch className={styles.searchIcon} fontSize="1.7rem" />
            <input
              type="input"
              value={selected === 1 ? search : homes.search}
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
              className={styles.searchBar}
              placeholder="Search Here"
            />
          </div>

          <div
            className={styles.filter}
            onClick={() => {
              if (selected === 1) {
                handleHouseFilter();
                setModal({ ...modal, houseMate: true });
              }
              if (selected === 2) {
                getHomesData(1, true, {
                  isPetsAllowed: false,
                });
                setModal({ ...modal, home: true });
              }
            }}
          >
            <TbFilter />
            <p>Filter</p>
          </div>
        </div>
      </div>

      {selected === 1 && (
        <>
          {!props.houseMates && <AppLoader />}
          {props.houseMates && props.houseMates.length === 0 && (
            <p className={styles.noData}>No Data Found</p>
          )}
          {props.houseMates && (
            <>
              <div className={styles.content}>
                {props.houseMates &&
                  props.houseMates?.map((v, i) => {
                    return (
                      <div className={styles.dashCard} key={i}>
                        <DashCard
                          guest={props.guest ? true : false}
                          _id={v?.userProfile?._id}
                          userId={props.auth && props.auth?._id}
                          deleteFavorite={deleteProfileFavorite}
                          addFavorite={addProfileFavorite}
                          favoritesList={favoritesList}
                          image={
                            v.userProfile &&
                            v.userProfile.images &&
                            v.userProfile.images.length > 0 &&
                            v.userProfile.images[0]
                          }
                          dob={v.userProfile && v.userProfile.dob}
                          firstName={v.userProfile && v.userProfile.firstName}
                          rent={
                            v.userHomeDetail
                              ? v.userHomeDetail.rent
                              : v.userProfile && v.userProfile.rentalBudget
                          }
                          haveHome={v.userHomeDetail ? true : false}
                          location={v.userProfile && v.userProfile.location}
                          showSecurity={true}
                          key={i}
                          loginedUser={
                            props.auth && props.auth !== "NO_USER"
                              ? true
                              : false
                          }
                          userProfileCheck={
                            props.auth && props.auth.userProfile ? true : false
                          }
                        />
                      </div>
                    );
                  })}
              </div>
              {props.metaData?.totalPage > 1 && (
                <Pagination className={styles.pagination}>
                  <Pagination.Prev
                    disabled={currentPage === 1}
                    onClick={() => handleClick(currentPage - 1)}
                  />
                  {generatePageNumbers(props.metaData?.totalPage)}
                  <Pagination.Next
                    disabled={currentPage === props.metaData?.totalPage}
                    onClick={() => handleClick(currentPage + 1)}
                  />
                </Pagination>
              )}
            </>
          )}
        </>
      )}

      {selected === 2 && (
        <>
          {!props.homes && <AppLoader />}
          {props.homes && props.homes.length < 1 && (
            <p className={styles.noData}>No Data Found</p>
          )}
          {props.homes && props.homes.length > 0 && (
            <>
              <div className={styles.content}>
                {props.homes &&
                  props.homes?.map((v, i) => {
                    return (
                      <div className={styles.dashCard} key={i}>
                        <DashCard
                          guest={props.guest ? true : false}
                          _id={v?._id}
                          deleteFavorite={deleteHomeFavorite}
                          favoritesList={favoritesList}
                          addFavorite={addHomeFavorite}
                          image={v.images && v.images.length > 0 && v.images[0]}
                          userImg={
                            v.userProfile &&
                            v.userProfile.images &&
                            v.userProfile.images.length > 0 &&
                            v.userProfile.images[0]
                          }
                          dob={v.userProfile && v.userProfile.dob}
                          firstName={v.userProfile && v.userProfile.firstName}
                          rent={v?.rent}
                          location={v.userProfile && v.userProfile.location}
                          key={i}
                          loginedUser={
                            props.auth && props.auth !== "NO_USER"
                              ? true
                              : false
                          }
                          userProfileCheck={
                            props.auth && props.auth.userProfile ? true : false
                          }
                        />
                      </div>
                    );
                  })}
              </div>
              {props.homesMetaData.totalPage > 2 && (
                <Pagination className={styles.pagination}>
                  <Pagination.Prev
                    disabled={homes.currentPage === 1}
                    onClick={() => handleClick(homes.currentPage - 1)}
                  />
                  {generatePageNumbers(props.homesMetaData.totalPage)}
                  <Pagination.Next
                    disabled={
                      homes.currentPage === props.homesMetaData.totalPage
                    }
                    onClick={() => handleClick(currentPage + 1)}
                  />
                </Pagination>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth.user,
    homes: state.auth.homes,
    homesMetaData: state.auth.homesMetaData,
    houseMates: state.auth.houseMates,
    homesMetaData: state.auth.homesMetaData,
    metaData: state.auth.houseMatesMeta,
    userFavorites: state.auth.userFavorites,
    houseMateFilterCount: state.auth.filteredHouseMateCount,
    homeFilterContent: state.auth.filteredHomesCount,
  };
};

export default connect(mapStateToProps, {
  getUser,
  getHouseMates,
  getHomes,
  getCities,
  getFavorites,
  getFilteredHouseMates,
})(HomePage);
