"use client";

import { useState } from "react";
import { Tabs } from "antd";
import RegisterForm from "./register-form";

type UserType = "client" | "plazzer";

const RegisterTabs = () => {
  const [userType, setUserType] = useState<UserType>("client");

  const handleTabChange = (activeKey: string) => {
    setUserType(activeKey as UserType);
  };

  return (
    <Tabs
      activeKey={userType}
      onChange={handleTabChange}
      centered
      items={[
        {
          key: "client",
          label: "Cliente",
          children: <RegisterForm userType={userType} />,
        },
        {
          key: "plazzer",
          label: "Plazzer",
          children: <RegisterForm userType={userType} />,
        },
      ]}
    />
  );
};

export default RegisterTabs;
