import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@material-ui/core";
import Layout from "./Layout";
import AllImages from "./AllImages";
import UploadImage from "./UploadImage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#da291c",
    },
    secondary: {
      main: "#000",
    },
  },
  typography: {
    fontFamily: '"Mulish","Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 12,
  },
});


function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Router>
          <Layout>
            <Switch>
              <Route exact path="/">
                <AllImages />
              </Route>
              <Route path="/getImages">
                <AllImages />
              </Route>
              <Route path="/uploadimage">
                <UploadImage />
              </Route>
            </Switch>
          </Layout>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
