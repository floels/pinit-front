"use client";

import { useActiveAccountContext } from "@/contexts/ActiveAccountContext";
import { useEffect } from "react";

const ActiveAccountInitializer = () => {
  const { setActiveAccountUsername } = useActiveAccountContext();

  useEffect(() => {
    setActiveAccountUsername("florianellis");
  }, []);

  return null;
};

export default ActiveAccountInitializer;
