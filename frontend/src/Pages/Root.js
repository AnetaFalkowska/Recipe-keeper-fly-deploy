import { Outlet } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";
import ScrollToTop from "../components/UI/ScrollToTop";
import Footer from "../components/UI/Footer";
import classes from "../Pages/RootPage.module.css"

function RootPage() {
  return (
    <div className={classes.wrapper}>
      <ScrollToTop/>
      <MainNavigation />
      <main className={classes.main}>
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
}

export default RootPage;
