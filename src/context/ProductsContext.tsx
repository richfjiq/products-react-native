import React, { createContext, useEffect, useState } from 'react';
import { ImagePickerResponse } from 'react-native-image-picker';

import coffeeApi from '../api/coffeeApi';
import { Producto, ProductsResponse } from '../interfaces/appInterfaces';

type ProductsContextProps = {
  products: Producto[];
  loadProducts: () => Promise<void>;
  addProduct: (categoryId: string, productName: string) => Promise<Producto>;
  updateProduct: (
    categoryId: string,
    productName: string,
    productId: string,
  ) => Promise<void>;
  loadProductById: (id: string) => Promise<Producto>;
  uploadImage: (data: ImagePickerResponse, id: string) => Promise<void>;
};

export const ProductsContext = createContext({} as ProductsContextProps);

export const ProductsProvider = ({ children }: any) => {
  const [products, setProducts] = useState<Producto[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const resp = await coffeeApi.get<ProductsResponse>(
        '/productos?limite=50',
      );
      setProducts([...resp.data.productos]);
    } catch (error) {
      console.log(JSON.stringify(error, null, 5));
    }
  };

  const addProduct = async (
    categoryId: string,
    productName: string,
  ): Promise<Producto> => {
    const resp = await coffeeApi.post<Producto>('/productos', {
      nombre: productName,
      categoria: categoryId,
    });
    setProducts(prev => [...prev, resp.data]);
    return resp.data;
  };

  const updateProduct = async (
    categoryId: string,
    productName: string,
    productId: string,
  ) => {
    try {
      const resp = await coffeeApi.put<Producto>(`/productos/${productId}`, {
        nombre: productName,
        categoria: categoryId,
      });
      setProducts(
        products.map(prod => {
          return prod._id === productId ? resp.data : prod;
        }),
      );
    } catch (error) {
      console.log(JSON.stringify(error, null, 5));
    }
  };

  const loadProductById = async (id: string): Promise<Producto> => {
    const resp = await coffeeApi.get<Producto>(`/productos/${id}`);

    return resp.data;
  };

  const uploadImage = async (data: ImagePickerResponse, id: string) => {
    console.log(JSON.stringify(data.assets, null, 5));
    const params = {
      uri: data.assets![0].uri,
      type: data.assets![0].type,
      name: data.assets![0].fileName,
    };

    const fileToUpload = JSON.parse(JSON.stringify(params));

    const formData = new FormData();
    formData.append('archivo', fileToUpload);

    try {
      const resp = await coffeeApi.put(`/uploads/productos/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        loadProducts,
        addProduct,
        updateProduct,
        loadProductById,
        uploadImage,
      }}>
      {children}
    </ProductsContext.Provider>
  );
};
