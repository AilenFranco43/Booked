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

import axios from "axios";

// export async function newProperty(property) {
//   const token = getToken();

//   // try {
//     // const propertyfilter = {
//     //   title: property.title,
//     //   description: property.description,
//     //   price: Number(property.price),
//     //   max_people: Number(property.max_people),
//     //   tags: property.tags,
//     //   // photos: property.photos,
//     // };

//     try {
//       const propertyData = {
//         title: property.title,
//         description: property.description,
//         price: Number(property.price),
//         max_people: Number(property.max_people),
//         tags: property.tags,
//         latitude: Number(property.coordinates.latitude),
//         longitude: Number(property.coordinates.longitude),
//         address: property.address
//       };
  
//       console.log("Datos a enviar:", propertyData);
  
//       const response = await axios.post(`${API}/property/register`, propertyData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//     return { 
//       show: true, 
//       message: "Propiedad registrada con éxito", 
//       type: "success" 
//     };
//     } catch (error) {
//       console.error("Error en newProperty:", error);
      
//       let errorMessage = "Error al registrar la propiedad";
//       if (error.response) {
//         // El servidor respondió con un error
//         errorMessage = error.response.data?.message || errorMessage;
//       } else if (error.request) {
//         // La solicitud fue hecha pero no hubo respuesta
//         errorMessage = "No se recibió respuesta del servidor";
//       }

//       return { 
  //         show: true, 
  //         message: errorMessage, 
  //         type: "error" 
//       };
//     }
// }


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


