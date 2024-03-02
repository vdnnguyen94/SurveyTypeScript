import { Routes, Route } from 'react-router-dom';
import Home from './core/Home';
import Signup from './user/Signup';
import PasswordReset from './user/PasswordReset';
import Signin from './lib/Signin';
import Profile from './user/Profile';
import EditProfile from './user/EditProfile';
import UpdatePassword from './user/UpdatePassword';
import NewSurvey from './survey/NewSurvey';
import Surveys from './survey/Surveys';
import MySurveys from './survey/MySurveys';
import Survey from './survey/Survey';
import EditSurvey from './survey/EditSurvey';
import EditSurveyDetails from './survey/EditSurveyDetails';
import Result from './survey/Result';
import NewQuestion from './question/NewQuestion';
import EditQuestion from './question/EditQuestion';
import Menu from './core/Menu';

function MainRouter() {
  return (
    <div>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup handleClose={() => {}} />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/user/passwordreset" element={<PasswordReset open={true} handleClose={() => {}} />} />
        <Route path="/user/edit/:userId" element={<EditProfile/>} /> 
        <Route path="/user/:userId" element={<Profile />} />
        <Route path="/user/:userId/updatepassword" element={<UpdatePassword />} />
        <Route path="/user/:userId/newsurvey" element={<NewSurvey />} />
        <Route path="/surveys" element={<Surveys />} />
        <Route path="/mysurveys" element={<MySurveys />} />
        <Route path="/survey/:surveyId" element={<Survey />} />
        <Route path="/survey/:surveyId/edit" element={<EditSurvey />} />
        <Route path="/survey/:surveyId/editdetails" element={<EditSurveyDetails />} />
        <Route path="/survey/:surveyId/result" element={<Result />} />
        <Route path="/survey/:surveyId/createquestion" element={<NewQuestion />} />
        <Route path="/question/:surveyId/:questionId/edit" element={<EditQuestion />} />
      </Routes>
    </div>
  );
}

export default MainRouter;
