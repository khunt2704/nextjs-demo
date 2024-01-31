import { Router, useRouter } from 'next/router';
import React from 'react'

const WithPrivateRoute = ({event}) => {
    const router = useRouter()
    const token = null;
    if (typeof window !== "undefined") {
        token = JSON.parse(localStorage.getItem("access_tocken"));
    }
console.log("event",event,token);
    if(event && token){
         
    }else{
        router.push("/login")
    }
    return (
        <></>
    )
}
export default WithPrivateRoute

// import React from 'react'

// const withPrivateRoute = () => {
//   return (
//     <div>withPrivateRoute</div>
//   )
// }

// export default withPrivateRoute