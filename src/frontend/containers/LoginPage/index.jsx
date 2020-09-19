import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import map from '../../store/map';
import './styles.scss';
import {
  useSession,
  signin,
  signout
} from 'next-auth/client'


class LoginPage extends React.Component {
  constructor() {
    super();
    

    this.state = {};
  }



  render() {

    return (
      <div id="login-page">
        <p>hi bitch</p>
      </div>
    );
  }
};

// export default connect(map)(withRouter(LoginPage));

export default function Page() 
{
  const [ session, loading ] = useSession()

  return <>
    {!session && <>
      Not signed in <br/>
      <button onClick={signin}>Sign in</button>
    </>}
    {session && <>
      Signed in as {session.user.email} <br/>
      <button onClick={signout}>Sign out</button>
    </>}
  </>
};
