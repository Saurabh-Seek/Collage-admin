import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk";

const poolData = {
  UserPoolId: "ap-south-1_PoVmOVnCv",
  ClientId: "3r70vi6lqe3qnledlk37n1a8e1",
};
const userPool = new CognitoUserPool(poolData);

const signUp = async (username: string, password: string, attr: Array<any>) => {
  return await new Promise((resolve, reject) => {
    userPool.signUp(username, password, attr, [], (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

const cognitoUser = (Username: string) =>
  new CognitoUser({ Username, Pool: userPool });

const confirmRegistration = async (Username: string, otp: string) => {
  return new Promise((resolve, reject) => {
    const callback = (err: any, result: any) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    };

    cognitoUser(Username).confirmRegistration(otp, true, callback);
  });
};

const signin = async (Username: string, Password: string) => {
  const authDetails = new AuthenticationDetails({ Username, Password });
  return new Promise(async (resolve, reject) => {
    cognitoUser(Username).authenticateUser(authDetails, {
      onSuccess: (session, userConfirmationNecessary) => {
        let region = poolData.UserPoolId.split("_")[0];
        AWS.config.region = region;
        // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        //   IdentityPoolId: poolData.UserPoolId, // your identity pool id here
        //   Logins: {
        //     `cognito-idp.${region}.amazonaws.com/${poolData.UserPoolId}`: session.getIdToken().getJwtToken(),
        // }
        // });

        console.log("My Session", session);
        resolve(session);
      },

      onFailure: reject,
      newPasswordRequired: (userAttributes, requiredAttributes) =>
        reject({
          type: "newPasswordRequired",
          userAttributes,
          requiredAttributes,
        }),
      // newPasswordRequired: async (userAttributes, requiredAttributes) => {
      //   let res = await handleNewPassword(Username, Password, userAttributes)
      //   debugger
      //   resolve(res)
      // },
      mfaRequired: (err) => reject({ type: "mfaRequired", err }),
      totpRequired: (err) => reject({ type: "totpRequired", err }),
    });
  });
};

const handleNewPassword = async (
  username: string,
  newPassword: string,
  userAttributes: any
) => {
  userAttributes = await getUserAttributes();
  delete userAttributes.email_verified;
  console.log("userAttributes", userAttributes);

  return new Promise((resolve, reject) => {
    try {
      cognitoUser(username).completeNewPasswordChallenge(
        newPassword,
        userAttributes,
        {
          onSuccess: resolve,
          onFailure: reject,
        }
      );
    } catch (error) {
      console.log("handleNewPassword error", error);

      reject(error);
    }
  });
};

const resetPassword = async (Username: string) => {
  return new Promise((resolve, reject) => {
    try {
      cognitoUser(Username).forgotPassword({
        onSuccess: resolve,
        onFailure: reject,
      });
    } catch (error) {
      console.log("Error in api", error);
      reject(error);
    }
  });
};

const getUserAttributes = () => {
  return new Promise((resolve, reject) => {
    try {
      userPool.getCurrentUser()?.getUserAttributes((err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    } catch (error) {
      console.log("Error in api", error);
      reject(error);
    }
  });
};

const confirmPassword = async (
  Username: string,
  verificationCode: string,
  newPassword: string
) => {
  return new Promise((resolve, reject) => {
    cognitoUser(Username).confirmPassword(verificationCode, newPassword, {
      onSuccess: resolve,
      onFailure: reject,
    });
  });
};

const userInfo = async (Username: any) => {
  // const currentUser = userPool.getCurrentUser();
  // console.log("cognitoUser", currentUser?.getUsername());

  // const Username = currentUser?.getUsername();

  return new Promise((resolve, reject) => {
    const callback = (err: any, result: any) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    };
    cognitoUser(Username).getUserAttributes(callback);
  });
};

export default {
  userPool,
  getUserAttributes,
  signin,
  signUp,
  confirmRegistration,
  userInfo,
  resetPassword,
  confirmPassword,
};
