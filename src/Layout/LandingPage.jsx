import { Navigate, Route, Routes } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Home } from '../pages/Home'

export const LandingPage = () => {

  return (
    <>
        <Navbar />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/*' element={<Navigate to={"/"} />} /> 
        </Routes>
    </>
  )
}
