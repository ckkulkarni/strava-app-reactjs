import { useNavigate } from "react-router-dom";
import { ComponentType } from "react";
import React from "react";

const withNavigate = <P extends {}>(Component: ComponentType<P>) => {
  return (props: Omit<P, "navigate">) => {
    const navigate = useNavigate();
    return <Component {...(props as P)} navigate={navigate} />;
  };
};

export default withNavigate;
