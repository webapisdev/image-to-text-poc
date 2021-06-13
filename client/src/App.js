import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@material-ui/core";
import Layout from "./Layout";
import AllImages from "./AllImages";
import UploadImage from "./UploadImage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1a475f",
    },
    secondary: {
      main: "#f0bd1b",
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
