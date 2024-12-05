import React from 'react'
import Header from '../Header'
import Footer from "../Footer"

export default function Page({ children }) {
  return (
    <div>
      <Header />
      <main style={{
        display: "flex", alignItems: "center", justifyContent: "center", minHeight: "85vh", marginTop:"5vh", marginBottom:"5vh", 
      }}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
