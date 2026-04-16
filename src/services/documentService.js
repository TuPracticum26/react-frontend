const API_BASE_URL = 'http://localhost:8080/api/v1';

const getAuthToken = () => {
    // Променено от localStorage на sessionStorage
    const token = sessionStorage.getItem('token');
    console.log('🔑 Токен от sessionStorage:', token ? 'Има токен' : 'НЯМА ТОКЕН');
    if (token) {
        console.log('📝 Токен (първи 50 символа):', token.substring(0, 50) + '...');
    }
    return token;
};

const request = async (endpoint, options = {}) => {
    const token = getAuthToken();

    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    console.log(`📤 ${options.method || 'GET'} заявка към: ${API_BASE_URL}${endpoint}`);

    const config = {
        ...options,
        headers: {
            ...headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        console.log(`📥 Отговор: ${response.status} ${response.statusText}`);

        if (response.status === 401) {
            console.error('❌ Неоторизиран достъп!');
            sessionStorage.removeItem('token'); // Променено на sessionStorage
            throw new Error('Unauthorized - Моля, влезте отново');
        }

        const contentLength = response.headers.get('content-length');
        if (contentLength === '0' || response.status === 204) {
            return null;
        }

        const text = await response.text();

        if (!text) {
            return null;
        }

        const data = JSON.parse(text);

        if (!response.ok) {
            throw new Error(data.message || `Грешка ${response.status}`);
        }

        return data;

    } catch (error) {
        console.error('❌ API Error:', error);
        throw error;
    }
};

export const documentService = {
    createDocument: async (documentData) => {
        return request('/documents', {
            method: 'POST',
            body: JSON.stringify(documentData),
        });
    },

    getDocuments: async () => {
        return request('/documents', {
            method: 'GET',
        });
    },

    getDocumentById: async (id) => {
        return request(`/documents/${id}`, {
            method: 'GET',
        });
    },
};