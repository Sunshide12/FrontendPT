// Refleja los mismos campos que devuelve el backend

export const createProduct = data => ({
  id: data.id,
  name: data.name,
  price: parseFloat(data.price),
  stock: data.stock,
  category_id: data.category_id,
  category: data.category ?? null,
});

export const createCategory = data => ({
  id: data.id,
  name: data.name,
});

export const createClient = data => ({
  id: data.id,
  name: data.name,
  email: data.email,
  phone: data.phone,
});
