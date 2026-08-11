import api from './api';

// GET: List all properties
export const getAllProperties = async () => {
	const response = await api.get('/properties/');
	return response.data;
};

// GET: Single property
export const getPropertyById = async (id) => {
	const response = await api.get(`/properties/${id}`);
	return response.data;
};
