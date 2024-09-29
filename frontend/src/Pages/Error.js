import { useRouteError } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";
import Footer from "../components/UI/Footer"
import PageContent from "../components/UI/PageContent";
import classes from "../Pages/RootPage.module.css"

export default function ErrorPage() {
  const error = useRouteError();

  let title = "An error occured!";
  let message = error.status

  if (error.status === 500) {
    message = error.data.message
  }

  if (error.status === 404) {
    message = "Could not find the page"
  }

  return (
    <div className={classes.wrapper}>
      <MainNavigation />
      <main className={classes.main}>
      <PageContent title={title}>
        <p>{message}</p>
      </PageContent>
      </main>
      <Footer/>
    </div>
  );
}


