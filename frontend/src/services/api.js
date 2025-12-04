import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
    timeout: 15000, // Aumentado a 15 segundos
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Para enviar cookies
    // Configuración adicional para mayor robustez
    validateStatus: function (status) {
        // Considerar exitosas las respuestas entre 200-299
        return status >= 200 && status < 300;
    },
    maxRedirects: 5,
    // Reintentos automáticos para ciertos códigos de error
    retry: 3,
    retryDelay: (retryCount) => {
        return retryCount * 1000; // 1s, 2s, 3s
    },
})

api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Sistema de monitoreo de conexión
let connectionStatus = 'connected';
let lastSuccessfulRequest = Date.now();
let consecutiveFailures = 0;

// Función para verificar el estado del servidor
const checkServerHealth = async () => {
    try {
        const response = await fetch('http://localhost:5000/health', { 
            method: 'GET',
            signal: AbortSignal.timeout(5000) // Timeout de 5 segundos
        });
        
        if (response.ok) {
            connectionStatus = 'connected';
            consecutiveFailures = 0;
            lastSuccessfulRequest = Date.now();
            return true;
        }
        throw new Error(`Server responded with ${response.status}`);
    } catch (error) {
        consecutiveFailures++;
        connectionStatus = 'disconnected';
        console.warn('❌ Server health check failed:', error.message);
        return false;
    }
};

// Sistema de reintentos mejorado con health check
const retryRequest = async (config, retryCount = 0) => {
    const maxRetries = 5; // Aumentado a 5 reintentos
    const baseDelay = 1000;
    
    // Si hay muchos fallos consecutivos, verificar salud del servidor primero
    if (consecutiveFailures > 2 && retryCount === 0) {
        console.log('🔍 Verificando estado del servidor antes de reintentar...');
        const serverHealthy = await checkServerHealth();
        if (!serverHealthy) {
            throw new Error('Servidor no disponible - verifique la conexión');
        }
    }
    
    try {
        const response = await api(config);
        connectionStatus = 'connected';
        consecutiveFailures = 0;
        lastSuccessfulRequest = Date.now();
        return response;
    } catch (error) {
        consecutiveFailures++;
        
        const shouldRetry = (
            retryCount < maxRetries && 
            (error.code === 'ERR_NETWORK' || 
             error.code === 'ECONNABORTED' || 
             error.response?.status >= 500)
        );
        
        if (shouldRetry) {
            const retryDelay = baseDelay * Math.pow(2, retryCount); // Backoff exponencial
            console.log(`🔄 Reintentando petición ${retryCount + 1}/${maxRetries} después de ${retryDelay}ms`);
            console.log(`   Fallos consecutivos: ${consecutiveFailures}`);
            
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return retryRequest(config, retryCount + 1);
        }
        
        throw error;
    }
};

// Interceptor de respuesta mejorado con reintentos y mejor manejo de errores
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        console.error('API Response error:', error);
        
        // Manejo específico de errores de red
        if (error.code === 'ERR_NETWORK') {
            console.error('❌ Error de red - posible problema de CORS o servidor no disponible');
            connectionStatus = 'disconnected';
            
            // Intentar reintentar la petición si es un error de red temporal
            if (error.config && !error.config._retryAttempted) {
                error.config._retryAttempted = true;
                
                console.log('🔄 Intentando reintento automático por error de red...');
                try {
                    return await retryRequest(error.config, 0);
                } catch (retryError) {
                    console.error('❌ Reintento automático falló:', retryError.message);
                    // Continuar con el error original si el reintento falla
                }
            }
        }
        
        // Manejo de errores de autenticación
        if (error.response?.status === 401) {
            // Token expirado o inválido
            console.log('Token inválido o expirado - redirigiendo al login');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Evitar redirección automática si ya estamos en login
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        
        // Manejo de errores de servidor
        if (error.response?.status >= 500) {
            console.error('Error del servidor:', error.response.status, error.response.statusText);
        }
        
        // Manejo de errores de timeout
        if (error.code === 'ECONNABORTED') {
            console.error('Timeout de petición - servidor demoró demasiado en responder');
        }
        
        return Promise.reject(error);
    }
);

export default api;