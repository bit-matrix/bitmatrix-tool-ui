import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { PoolGenerateTool } from "./pages/PoolGenerateTool/PoolGenerateTool";

const App = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={PoolGenerateTool} />
      </Switch>
    </Router>
  );
};
export default App;
