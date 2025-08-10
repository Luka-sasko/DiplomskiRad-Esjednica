import "./App.css";
import IndexRoutes from "./pages/IndexRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        newestOnTop
        pauseOnFocusLoss={false}
        pauseOnHover={true}
        limit={3}
        style={{ zIndex: 10000 }}
        theme="colored"
      />{" "}
      <IndexRoutes />
    </div>
  );
}

export default App;
