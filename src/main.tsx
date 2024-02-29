import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App'
import InsertionSort from './pages/InsertionSort/InsertionSort'
import BubbleSort from './pages/BubbleSort/BubbleSort'
import SelectionSort from './pages/SelectionSort/SelectionSort'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <InsertionSort />
    <BubbleSort />
    <SelectionSort />
  </React.StrictMode>,
)
