import { notification } from "antd";
import { createContext, useContext } from "react";

interface CommonContextType {
  Toast: {
    openSuccessNotification: any;
    openErrorNotification: any;
    openWarningNotification: any;
  };
}

const ContentContext = createContext({} as CommonContextType);

export const ContentProvider = ({ children }: any) => {
  const url = "";

  const [api, contextHolder] = notification.useNotification();
  const placement = "topRight";

  const openSuccessNotification = (title: string, description: string) => {
    api.success({
      message: title,
      description: description,
      placement,
    });
  };
  const openErrorNotification = (title: string, description: string) => {
    api.error({
      message: title,
      description: description,
      placement,
    });
  };
  const openWarningNotification = (title: string, description: string) => {
    api.warning({
      message: title,
      description: description,
      placement,
    });
  };

  const Toast = {
    openSuccessNotification,
    openErrorNotification,
    openWarningNotification,
  };

  return (
    <ContentContext.Provider value={{ Toast }}>
      {contextHolder}
      {children}
    </ContentContext.Provider>
  );
};

export const useContentContext = () => useContext(ContentContext);
