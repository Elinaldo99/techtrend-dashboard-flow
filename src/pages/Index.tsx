import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Dashboard from "./Dashboard";

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate("/login");
      } else if (isMounted) {
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }
  return <Dashboard />;
};

export default Index;
