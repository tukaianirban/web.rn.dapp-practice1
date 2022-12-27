import { NavBar, Footer, Loader, Services, Transactions, Welcome } from './components'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

const App = () => {

  return (
    <div className="min-h-screen">
      <div className='gradient-bg-welcome'>
        <NavBar />
        <Welcome />
      </div>
      <Services />
      <Transactions />
      <Footer />

    </div>
  )
}

export default App;