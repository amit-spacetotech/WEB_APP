import React from 'react'
import dynamic from "next/dynamic"
import { useMediaQuery } from 'react-responsive'
const AboutUs = dynamic(() => import("@/views/web/AboutUs"), { ssr: false })
const AboutUsRes = dynamic(() => import("@/views/responsive/AboutUs"), { ssr: false })

function Index() {

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

  return (
    isTabletOrMobile ?  <AboutUsRes /> : <AboutUs />
  )
}

export default Index