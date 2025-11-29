// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Button from "../ui/button/Button";
// import Input from "../form/input/InputField";

// export default function ResetPassword() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       const response = await axios.patch(
//         `${import.meta.env.VITE_APP_URL}api/admin/reset-password`,
//         {
//           email,
//           otp,
//           password,
//         }
//       );

//       if (response.data.success) {
//         setMessage("Password reset successful! Redirecting to login...");
//         setTimeout(() => navigate("/"), 2000);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
//         <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
//           Reset Password
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
          
//           <div>
//             <label className="block mb-1 text-sm font-medium">Email</label>
//             <Input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-1 text-sm font-medium">OTP</label>
//             <Input
//               type="text"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-1 text-sm font-medium">New Password</label>
//             <Input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-1 text-sm font-medium">Confirm Password</label>
//             <Input
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//             />
//           </div>

//           {error && <p className="text-sm text-red-500">{error}</p>}
//           {message && <p className="text-sm text-green-500">{message}</p>}

//           <Button className="w-full">Update Password</Button>
//         </form>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // FIX 1: Added ': React.FormEvent' type
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // FIX 3 (Logic): Manual validation since we removed the 'required' prop
    if (!email || !otp || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_APP_URL}api/admin/reset-password`,
        {
          email,
          otp,
          password,
        }
      );

      if (response.data.success) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err: any) {
      // FIX 2: Typed err as 'any' to allow access to err.response
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            {/* FIX 3: Removed 'required' prop to satisfy TypeScript */}
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">OTP</label>
            <Input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">New Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Confirm Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {message && <p className="text-sm text-green-500">{message}</p>}

          <Button className="w-full">Update Password</Button>
        </form>
      </div>
    </div>
  );
}