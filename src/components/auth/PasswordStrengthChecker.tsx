
import React from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthCheckerProps {
  password: string;
}

const PasswordStrengthChecker: React.FC<PasswordStrengthCheckerProps> = ({ password }) => {
  // Define password requirements
  const requirements = [
    {
      text: "Mindestens 8 Zeichen",
      met: password.length >= 8,
    },
    {
      text: "Mindestens ein Großbuchstabe",
      met: /[A-Z]/.test(password),
    },
    {
      text: "Mindestens ein Kleinbuchstabe",
      met: /[a-z]/.test(password),
    },
    {
      text: "Mindestens eine Zahl",
      met: /[0-9]/.test(password),
    }
  ];

  return (
    <div className="mt-2 space-y-1.5 text-sm">
      {requirements.map((req, index) => (
        <div key={index} className="flex items-center gap-2">
          {req.met ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <X className="h-4 w-4 text-gray-300" />
          )}
          <span className={req.met ? "text-green-500" : "text-gray-500"}>
            {req.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PasswordStrengthChecker;
