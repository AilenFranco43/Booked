import "./auth.css";
//import { HeaderBooked } from "../components/headerBooked";


export const metadata = {
  title: "Bienvenido a Booked",
  description: "login/registro a Booked",
};

export default function loginLayaout({ children }) {
  return (
    <div id="bodyLogin">
      {/*<HeaderBooked/>*/}
      {children}
    </div>
  );
}
