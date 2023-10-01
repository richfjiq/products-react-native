/* eslint-disable curly */
import { Picker } from '@react-native-picker/picker';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  Image,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { ProductsContext } from '../context/ProductsContext';
import { useCategories } from '../hooks/useCategories';
import { useForm } from '../hooks/useForm';
import { ProductsStackParams } from '../navigation/ProductsNavigator';

interface Props
  extends StackScreenProps<ProductsStackParams, 'ProductScreen'> {}

export const ProductScreen = ({ navigation, route }: Props) => {
  const [tempUri, setTempUri] = useState<string>();
  const { id, name = '' } = route.params;
  const { loadProductById, addProduct, updateProduct, uploadImage } =
    useContext(ProductsContext);
  const { categories } = useCategories();
  const { _id, categoriaId, nombre, img, onChange, setFormValue } = useForm({
    _id: id,
    categoriaId: '',
    nombre: name,
    img: '',
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: nombre,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nombre]);

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  const loadCategory = () => {
    if (id) {
      return;
    }

    if (categories) {
      setFormValue({
        _id: '',
        categoriaId: categories.length > 0 ? categories[0]._id : '',
        nombre,
        img: '',
      });
    }
  };

  const loadProduct = async () => {
    if (!id) {
      return;
    }
    const producto = await loadProductById(id);
    setFormValue({
      _id: id,
      categoriaId: producto.categoria._id,
      nombre,
      img: producto.img || '',
    });
  };

  const saveOrUpdate = async () => {
    if (id) {
      updateProduct(categoriaId, nombre, id);
    } else {
      const newProduct = await addProduct(categoriaId, nombre);
      onChange(newProduct._id, '_id');
    }
  };

  const takePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      resp => {
        if (resp.didCancel) return;
        if (!resp.assets) return;
        setTempUri(resp.assets[0].uri);
        uploadImage(resp, _id!);
      },
    );
  };

  const takePhotoFromGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      resp => {
        if (resp.didCancel) return;
        if (!resp.assets) return;
        setTempUri(resp.assets[0].uri);
        uploadImage(resp, _id!);
      },
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Nombre del producto:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Producto"
          value={nombre}
          onChangeText={value => onChange(value, 'nombre')}
        />

        <Text style={styles.label}>Categoria:</Text>
        <Picker
          selectedValue={categoriaId}
          onValueChange={itemValue => onChange(itemValue, 'categoriaId')}>
          {categories.map(cat => (
            <Picker.Item key={cat._id} label={cat.nombre} value={cat._id} />
          ))}
        </Picker>

        <Button title="Guardar" onPress={saveOrUpdate} color="#5856D6" />

        {_id && (
          <View style={styles.buttonsContainer}>
            <Button title="Camara" onPress={takePhoto} color="#5856D6" />
            <Button
              title="Galeria"
              onPress={takePhotoFromGallery}
              color="#5856D6"
            />
          </View>
        )}

        {img && !tempUri && (
          <Image source={{ uri: img }} style={styles.image} />
        )}

        {tempUri && <Image source={{ uri: tempUri }} style={styles.image} />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 20,
  },
  label: {
    fontSize: 18,
  },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderColor: 'rgba(0,0,0,0.2)',
    height: 45,
    marginTop: 5,
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: 300,
    marginTop: 20,
  },
});
