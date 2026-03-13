import axios from 'axios';
const api = axios.create({ baseURL: 'https://backend.com/api' });
console.log(api.getUri({ url: '/admin/login' }));
console.log(api.getUri({ url: 'admin/login' }));
console.log(api.getUri({ baseURL: 'https://backend.com', url: '/admin/login' }));
