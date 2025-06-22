import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const id = searchParams.get("id");
    const hash = searchParams.get("hash");
    const expires = searchParams.get("expires");
    const signature = searchParams.get("signature");

    fetch(
      `http://your-backend.com/api/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`,
      { method: "GET" }
    )
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Verification failed");
      })
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Email verification failed or link expired."));
  }, [searchParams]);

  return <div>{message}</div>;
}

export default VerifyEmail;
