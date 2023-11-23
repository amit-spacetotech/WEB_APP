
import React from 'react'
import dynamic from "next/dynamic"
import { useMediaQuery } from 'react-responsive'
const Pricing = dynamic(() => import("@/views/web/Pricing"), { ssr: false })
const PricingRes = dynamic(() => import("@/views/responsive/Pricing"), { ssr: false })

function Index() {

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })


  return (
    !isTabletOrMobile ? <Pricing /> : <PricingRes />
  )
}

export default Index