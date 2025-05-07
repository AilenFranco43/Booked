import axios from "axios";
import { getToken } from "./token";
const API = process.env.NEXT_PUBLIC_API_URL;
const token = getToken();

export async function userRegister(newUser) {
  try {
    const response = await fetch(`${API}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      const errorDetails = await response.json()
      throw new Error(errorDetails.message)
    }

    const data = await response.json();

    return data

    // return { show: true, message: "Registro exitoso", type: "success" };
  } catch (error) {
    throw error
  }
}


// Obtener usuario por ID
export async function getUserById(userId) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/user/${userId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getUserById:', error);
    throw error;
  }
}




export async function newProperty(property) {
  const token = getToken();
  
  try {
    const response = await axios.post(`${API}/property/register`, property, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return {
      show: true,
      message: "Propiedad registrada con éxito",
      type: "success"
    };
  } catch (error) {
    console.error("Error en newProperty:", error);
    return {
      show: true,
      message: error.response?.data?.message || "Error al registrar la propiedad",
      type: "error"
    };
  }
}


export async function newReview(reviewData) {
  const token = getToken();
  
  try {
    const response = await axios.post(`${API}/reviews/create`, reviewData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return {
      show: true,
      message: "Valoración enviada con éxito",
      type: "success",
      data: response.data
    };
  } catch (error) {
    console.error("Error en newReview:", error);
    return {
      show: true,
      message: error.response?.data?.message || "Error al enviar la valoración",
      type: "error"
    };
  }
}

// Obtener reseñas por propiedad
export async function getReviewsByProperty(propertyId) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/property/${propertyId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener reseñas');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getReviewsByProperty:', error);
    throw error;
  }
}




// export async function paymentStripe(newPayment) {
//   const sanitizedPayment = {
//     ...newPayment,
//     unitAmount: Number(newPayment.unitAmount),
//     quantity: Number(newPayment.quantity) || 1,
//     currency: newPayment.currency?.toUpperCase() || "USD",
//   };
//   try {
//     const response = await fetch(
//       `http://localhost:3001/payments/createPaymentSession`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(sanitizedPayment),
//       }
//     );
//     if (!response.ok) {
//       console.error("Error al registrar el pago", response.status);
//       return null;
//     }

//     const data = await response.json();

//     if (data && data.url) {
//       return data.url;
//     } else {
//       console.error(
//         "Error al registrar el pago: No se recibió una URL",
//         response.status
//       );
//       return null;
//     }
//   } catch (error) {
//     console.error("Error al registrar el pago", error);
//     return null;
//   }
// }


