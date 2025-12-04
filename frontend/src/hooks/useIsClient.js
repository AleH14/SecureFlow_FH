import { useEffect, useState } from 'react';

/**
 * Hook para detectar si estamos en el cliente
 * Útil para prevenir errores de hidratación
 */
export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

export default useIsClient;