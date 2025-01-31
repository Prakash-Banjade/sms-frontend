import { RouterProvider } from "react-router-dom"
import router from "./router"
import { useLoadApperance } from "./hooks/useLoadApperance"

function App() {

  useLoadApperance(); // loads the apperance from localstorage;

  return (
    <RouterProvider router={router} />
  )
}

export default App
