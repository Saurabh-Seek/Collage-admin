import { Elements } from "@stripe/react-stripe-js";
import React from "react";
import CheckoutForm from "./CheckoutForm";
import seekSolutionApi from "../../utils/seekSolutionApi";
import { useLocation, useMatch, useParams } from "react-router-dom";
const CreatePaymentIntent = ({ stripe }: any) => {
  const match = useMatch("/checkout/:courses_id");
  const location = useLocation();
  const uRLSearchParams = new URLSearchParams(location.search);

  const [state, setState] = React.useState({
    client_secret: "",
    status: "",
  });
  console.log("state => ", state);

  const initialisePaymentIntent = async () => {
    try {
      let apiRes = await seekSolutionApi.Courses.buy(
        match?.params.courses_id as string
      );
      console.log("apiRes.client_secret =>", apiRes.client_secret);
      setState(apiRes);
    } catch (error) {}
  };

  React.useEffect(() => {
    initialisePaymentIntent();
  }, []);

  return state.client_secret ? (
    <Elements stripe={stripe} options={{ clientSecret: state.client_secret }}>
      <CheckoutForm redirect_to={uRLSearchParams.get("redirect_to")} />
    </Elements>
  ) : (
    <h1>{state.status || "Loading"}</h1>
  );
};

export default CreatePaymentIntent;
