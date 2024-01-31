
import React from 'react';
import Router from 'next/router';

let token = null;
if (typeof window !== 'undefined') {
  token = JSON.parse(localStorage.getItem("access_tocken"));
}
const checkUserAuthentication = () => {
  return { auth: token }; // change null to { isAdmin: true } for test it.
};
export default WrappedComponent => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;

  hocComponent.getInitialProps = async (context) => {
    const userAuth = await checkUserAuthentication();
    console.log("userAuth", userAuth);
    // Are you an authorized user or not?
    if (userAuth?.auth) {
      // Handle server-side and client-side rendering.
      if (context.res) {
        context.res?.writeHead(302, {
          Location: "/",
        });
        context.res?.end();
      } else {
        Router.replace("/");
      }
    } else if (WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps({ ...context, auth: userAuth });
      return { ...wrappedProps, userAuth };
    }

    return { userAuth };
  };

  return hocComponent;
};