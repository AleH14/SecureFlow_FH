import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
export default function Home() {
  return (
    <div className={styles.page}>
      
      <div className="d-flex flex-column align-items-center justify-content-center">
        
        <div className="text-center mb-4"> 
          <h1>Nuestra aplicación con superpoderes</h1>
        </div>
        
        <div className="d-flex flex-row">
          {/* Botón Login */}
          <Link href="/login" className="btn btn-custom-primary btn-lg me-3">
            Ir al Inicio de Sesión
          </Link>
          
          {/* Botón Registro */}
          <Link href="/register" className="btn btn-custom-secondary btn-lg">
            Registrar Usuario (Admin)
          </Link>
        </div>

      </div>
    </div>
  );
}