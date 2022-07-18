import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Nav, Navbar } from "rsuite";
import { CommitmentOutputTool } from "./pages/CommitmentOutputTool/CommitmentOutputTool";
import { CommitmentOutputToPoolTool } from "./pages/CommitmentOutputToPoolTool/CommitmentOutputToPool";
import { CreateIssueTool } from "./pages/CreateIssueTool/CreateIssueTool";
import { LdkTool2 } from "./pages/LdkTool2/LdkTool2";
import { PoolGenerateTool } from "./pages/PoolGenerateTool/PoolGenerateTool";
import { PoolTransaction } from "./pages/PoolTransaction/PoolTransaction";
import "./App.css";
import { Aggreagator } from "./pages/Aggregator/Aggregator";

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Navbar>
        <Nav className="nav">
          <Nav.Item href="/">Home</Nav.Item>
          <Nav.Item href="/createissue"> Create Issue</Nav.Item>
          <Nav.Item href="/ldk">Ldk</Nav.Item>
          <Nav.Item href="/commitmentoutput">Commitment Output</Nav.Item>
          <Nav.Item href="/commitmentoutputtopool">Commitment Output To Pool</Nav.Item>
          <Nav.Item href="/pooltransaction">Pool Transaction</Nav.Item>
          <Nav.Item href="/aggregator">Aggreagator</Nav.Item>
        </Nav>
      </Navbar>
      <Routes>
        <Route path="/" element={<PoolGenerateTool />} />
        <Route path="/createissue" element={<CreateIssueTool />} />
        <Route path="/ldk" element={<LdkTool2 />} />
        <Route path="/commitmentoutput" element={<CommitmentOutputTool />} />
        <Route path="/commitmentoutputtopool" element={<CommitmentOutputToPoolTool />} />
        <Route path="/pooltransaction" element={<PoolTransaction />} />
        <Route path="/aggregator" element={<Aggreagator />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
