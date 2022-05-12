import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { CommitmentOutputTool } from "./pages/CommitmentOutputTool/CommitmentOutputTool";
import { CreateIssueTool } from "./pages/CreateIssueTool/CreateIssueTool";
import { LdkTool2 } from "./pages/LdkTool2/LdkTool2";
import { PoolGenerateTool } from "./pages/PoolGenerateTool/PoolGenerateTool";
import { TestPage } from "./pages/TestPage/TestPage";

const App = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={PoolGenerateTool} />
        <Route exact path="/createissue" component={CreateIssueTool} />
        <Route exact path="/ldk" component={LdkTool2} />
        <Route exact path="/commitmentoutput" component={CommitmentOutputTool} />
        <Route exact path="/test" component={TestPage} />
      </Switch>
    </Router>
  );
};
export default App;
