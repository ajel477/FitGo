import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const MainLayout = () => {
  return (
    <>
      <Navigation />
      <div className="content-wrapper">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout; 