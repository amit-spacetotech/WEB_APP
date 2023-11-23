import Image from 'next/image'
import React from 'react'
import NewImg from "../../../assets/new.png"
import styles from "./blog.module.css"

function Card() {
  return (
    <div >
      <img src="assets/new.png" className={styles.thumbnail}   />
        <p className={styles.title} >7 activities to do with your homemate at your house</p>
        <p className={styles.date}  >March 21,2023</p>
    </div>
  )
}

export default Card