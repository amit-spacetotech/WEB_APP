import React from 'react'
import { useMediaQuery } from 'react-responsive'
import dynamic from "next/dynamic"

const Contact = dynamic(() => import("@/views/web/ContactUs"), { ssr: false })
const ContactRes = dynamic(() => import("@/views/responsive/ContactUs"), { ssr: false })

function Index() {

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

  return (
    isTabletOrMobile ? <ContactRes /> : <Contact />
    
  )
}

export default Index