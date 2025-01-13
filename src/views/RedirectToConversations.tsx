import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectToConversation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/conversations");
  }, [navigate]);

  return null;
};

export default RedirectToConversation;
