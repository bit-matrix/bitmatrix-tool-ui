import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CommitmentOutputTool } from "./pages/CommitmentOutputTool/CommitmentOutputTool";
import { CommitmentOutputToPoolTool } from "./pages/CommitmentOutputToPoolTool/CommitmentOutputToPool";
import { CreateIssueTool } from "./pages/CreateIssueTool/CreateIssueTool";
import { LdkTool2 } from "./pages/LdkTool2/LdkTool2";
import { PoolGenerateTool } from "./pages/PoolGenerateTool/PoolGenerateTool";
import { PoolTransaction } from "./pages/PoolTransaction/PoolTransaction";

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PoolGenerateTool />} />
        <Route path="/createissue" element={<CreateIssueTool />} />
        <Route path="/ldk" element={<LdkTool2 />} />
        <Route path="/commitmentoutput" element={<CommitmentOutputTool />} />
        <Route path="/commitmentoutputtopool" element={<CommitmentOutputToPoolTool />} />
        <Route path="/pooltransaction" element={<PoolTransaction />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
