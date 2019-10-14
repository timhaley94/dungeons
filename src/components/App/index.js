import React from 'react';
import Ribbon from "react-github-ribbon";
import { Footer, Modal } from '../../components';
import './index.css';

function App() {
  return (
    <div>
      <Modal />
      <Ribbon
        user="timhaley94"
        repo="dungeons"
        fill="2d2d2d"
        color="white"
      />
      <Footer />
    </div>
  );
}

export default App;
