import React from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/pages/Profile.sass';
import profileIcon from '../assets/svg/Profile/profileIcon.svg';
import favoriteIcon from '../assets/svg/Profile/favoriteIcon.svg';
import checkIcon from '../assets/svg/Profile/checkIcon.svg';
import logoutIcon from '../assets/svg/Profile/logoutIcon.svg';
import Buttons from '../components/Buttons';

function Profile() {
  const history = useHistory();
  const userEmail = JSON.parse(localStorage.getItem('user'));
  const logoutHandle = () => {
    localStorage.clear();
    history.push('/');
  };
  return (
    <>
      <div className="profilePageContainer">
        <Header
          title="Profile"
          showTitle
          titleIcon={ profileIcon }
          withSearchBar={ false }
        />

        <span
          data-testid="profile-email"
          className="profileEmail"
        >
          { userEmail && userEmail.email }
        </span>
        <div className="btnContainers">
          <Buttons
            dataTestid="profile-done-btn"
            labelText="Done Recipes"
            icon={ checkIcon }
            onClick={ () => {
              history.push('/done-recipes');
            } }
          />

          <div className="hLine" />

          <Buttons
            dataTestid="profile-favorite-btn"
            labelText="Favorite Recipes"
            icon={ favoriteIcon }
            onClick={ () => {
              history.push('/favorite-recipes');
            } }
          />

          <div className="hLine" />

          <Buttons
            dataTestid="profile-logout-btn"
            labelText="Logout"
            icon={ logoutIcon }
            onClick={ logoutHandle }
          />
        </div>

      </div>
      <Footer />
    </>
  );
}

export default Profile;
