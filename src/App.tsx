// @ts-nocheck

import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import LeadershipTables from "./pages/Tables/leadership";
import TechnologyTables from "./pages/Tables/technology";
import AiTables from "./pages/Tables/ai";
import ScalingTables from "./pages/Tables/scaling";
import ManufacturingTables from "./pages/Tables/manufacturing";
import CapexTables from "./pages/Tables/capex";
import MainTab from "./pages/Tables/mainTab";
import Banner from "./pages/Tables/banner";
import VisionTable from "./pages/Tables/vision";


export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route index path="/" element={<SignIn />} />

          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/banner" element={<Banner/>} />
            <Route path="/home" element={<MainTab/>} />
            <Route path="/technology" element={<TechnologyTables/>} />
            <Route path="/ai-solution" element={<AiTables/>} />
            <Route path="/scaling" element={<ScalingTables/>} />
            <Route path="/manufacturing" element={<ManufacturingTables/>} />
            <Route path="/capex" element={<CapexTables/>} />
            <Route path="/leadership" element={<LeadershipTables/>} />
                <Route path="/vision" element={<VisionTable/>} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
