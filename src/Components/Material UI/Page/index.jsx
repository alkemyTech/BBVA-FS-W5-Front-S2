import React from 'react'
import Header from '../Header'
import Footer from "../Footer"

export default function Page({ children }) {
  return (
    <div>
      <Header />
      <main style={{
        display: "flex", justifyContent: "center",alignItems:"center", textAlign:"center", minHeight: "85vh", margin:"3vh 1vh", 
      }}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
