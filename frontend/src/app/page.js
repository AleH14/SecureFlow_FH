import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
export default function Home() {
  return (
    <div className={styles.page}>
      
      <div className="d-flex flex-column align-items-center justify-content-center">
        
        <div className="text-center mb-4"> 
          <h1>Our application with superpowers</h1>
        </div>
        
        <div className="d-flex flex-row">
          {/* Botón Login */}
          <Link href="/login" className="btn btn-custom-primary btn-lg me-3">
            Go to Login
          </Link>
          
          {/* Botón Registro */}
          <Link href="/register" className="btn btn-custom-secondary btn-lg">
            Register User (Admin)
          </Link>
        </div>

      </div>
    </div>
  );
}