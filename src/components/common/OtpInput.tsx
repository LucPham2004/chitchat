import { useState } from "react";

interface OtpInputProps {
  length?: number;
  onChange: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onChange }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    onChange(newOtp.join(""));
  };

  return (
    <div className="flex justify-center gap-2">
      {otp.map((digit, i) => (
        <input
          key={i}
          type="text"
          value={digit}
          maxLength={1}
          onChange={(e) => handleChange(e.target.value, i)}
          className="w-12 h-12 text-center text-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ))}
    </div>
  );
};

export default OtpInput;
