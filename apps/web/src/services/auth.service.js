export const loginUser = async (value) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      }
    );

    if (!response.ok) {
      const errorMessages = await response.json();

      if (Array.isArray(errorMessages.messages)) {
        throw new Error(errorMessages.message?.map((msg) => msg).join(","));
      }

      throw new Error(errorMessages.message);
    }

    const data = await response.json();

    return data
  } catch (error) {
    throw error
  }
}

export const checkToken = async (token) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-auth-status`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      const errorMessages = await response.json();
      throw new Error(errorMessages.message);
    }

    const data = await response.json();

    return data
  } catch (error) {
    throw error
  }
}