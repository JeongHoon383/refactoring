import * as React from "react";
import useToastStore from "@/store/toast/toast";

const Toast = () => {
  const { toasts, removeToast } = useToastStore();
  console.log(toasts);

  return (
    <div>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`fixed top-[70px] right-[220px] bg-gray-800 text-white py-2 px-4 rounded-lg shadow-md transition-opacity ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
          onClick={() => removeToast(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;
