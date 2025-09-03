import { Product } from '@/types/product';

const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyh8dpK29PIbin4v2BdWuayR3awdf9J5qA4fWf0Yogkph0BPSCi5dLLsAyKSTP7apeU/exec';

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(GOOGLE_SHEETS_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data = await response.json();
    
    // Transform the data to match our Product interface
    return data.map((item: any, index: number) => ({
      id: `product-${index + 1}`,
      name: item['Product Name'] || item.name || '',
      description: item['Description'] || item.description || '',
      price: parseFloat(item['Price'] || item.price || '0'),
      category: item['Category'] || item.category || 'General',
      stock: parseInt(item['Stock'] || item.stock || '0'),
      imageUrl: item['Image URL'] || item.imageUrl || '/placeholder.svg',
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getUniqueCategories = (products: Product[]): string[] => {
  const categories = products.map(product => product.category);
  return [...new Set(categories)].filter(Boolean);
};