import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utilities/AuthContext";

const RedirectToConversation = () => {
    const {user} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/profile/" + user?.user.id);
  }, [navigate]);

  return null;
};

export default RedirectToConversation;
