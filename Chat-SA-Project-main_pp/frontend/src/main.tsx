import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Chatseller from './pages/ChatSeller.tsx'
import Chatbuyer from './pages/ChatBuyer.tsx'
import Test from './pages/test.tsx'
// import './ChatBuyer.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Chatseller /> */}
    <Chatbuyer />
    {/* <Chatseller /> */}
  </StrictMode>
  ,
)
