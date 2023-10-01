import { useEffect, useState } from 'react';

import coffeeApi from '../api/coffeeApi';
import { Categoria, CategoriesResponse } from '../interfaces/appInterfaces';

export const useCategories = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Categoria[]>([]);

  const getCategories = async () => {
    const resp = await coffeeApi.get<CategoriesResponse>('/categorias');
    setCategories(resp.data.categorias);
    setIsLoading(false);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return {
    isLoading,
    categories,
  };
};
