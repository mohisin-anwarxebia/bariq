import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Vision from './pages/Vision'
import Experience from './pages/Experience'
import Forecast from './pages/Forecast'
import Recommendations from './pages/Recommendations'
import Audit from './pages/Audit'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="vision" element={<Vision />} />
          <Route path="experience" element={<Experience />} />
          <Route path="forecast" element={<Forecast />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="audit" element={<Audit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
