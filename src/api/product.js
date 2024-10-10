import { ALL_CATEGORY_ID } from "@/constants";
import { db } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";

export const fetchProducts = async (filter, pageSize, page) => {
  try {
    // 기본 쿼리: 'products' 컬렉션에서 'id'로 내림차순 정렬
    let q = query(collection(db, "products"), orderBy("id", "desc"));

    // 카테고리 필터링: 'category.id' 필드가 존재하고 ALL_CATEGORY_ID가 아닌 경우
    if (filter.categoryId && filter.categoryId !== ALL_CATEGORY_ID) {
      q = query(q, where("category.id", "==", filter.categoryId));
    }

    // 제목 필터링: 제목이 존재하고 길이가 0보다 큰 경우
    if (filter.title && filter.title.length > 0) {
      q = query(
        q,
        where("title", ">=", filter.title),
        where("title", "<=", filter.title + "\uf8ff")
      );
    }
    if (filter.minPrice) {
      q = query(q, where("price", ">=", Number(filter.minPrice)));
    }
    if (filter.maxPrice) {
      q = query(q, where("price", "<=", Number(filter.maxPrice)));
    }

    const querySnapshot = await getDocs(q);

    // firebase 데이터를 못불러옴

    let products = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: String(data.id),
        title: data.title,
        price: Number(data.price),
        category: data.category,
        image: data.image || "",
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString(),
      };
    });

    if (filter.title) {
      products = products.filter((product) =>
        product.title.toLowerCase().includes(filter.title.toLowerCase())
      );
    }

    const totalCount = products.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = products.slice(startIndex, endIndex);
    const hasNextPage = endIndex < totalCount;

    return { products: paginatedProducts, hasNextPage, totalCount };
  } catch (error) {
    console.error("Error fetching products: ", error);
    throw error;
  }
};

export const addProductAPI = async (productData) => {
  try {
    return await runTransaction(db, async (transaction) => {
      const productsRef = collection(db, "products");
      const q = query(productsRef, orderBy("id", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      let maxId = 0;
      if (!querySnapshot.empty) {
        maxId = querySnapshot.docs[0].data().id;
      }

      const newId = maxId + 1;

      const newProductData = {
        ...productData,
        id: String(newId),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const newDocRef = doc(productsRef);
      transaction.set(newDocRef, newProductData);

      const newProduct = {
        ...newProductData,
        id: String(newId),
        image: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return newProduct;
    });
  } catch (error) {
    console.error("Error adding product: ", error);
    throw error;
  }
};
