
import React from 'react'
import dynamic from "next/dynamic"


const Createaccount = dynamic(() => import("../../views/responsive/CreateAccount/index"), { ssr: false })

function index() {

  return (
    <Createaccount responsive login={true} />
  )
}

export default index