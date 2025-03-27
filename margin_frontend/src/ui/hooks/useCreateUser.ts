import { useMutation } from "@tanstack/react-query";

const useCreateUser = () => {
  return useMutation(async (formData: { userName: string; email: string; password: string }) => {
    const response = await fetch("http://localhost:8000/api/admin/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.userName, // Map to API expected field
        email: formData.email,
        password: formData.password,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    return response.json();
  });
};

export default useCreateUser;
