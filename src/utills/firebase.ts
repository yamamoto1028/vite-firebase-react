// このファイルは、Firebaseの処理を行う際にクライアント機能として動作するもの

// /src/utils/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; //認証機能のインポート
import { getFirestore } from "firebase/firestore"; //DB機能のインポート

const firebaseConfig = {
  //.env.localの内容を読み込むよう設定
  //.env.localと分離して定義しているのは、セキュリティ的な理由。機密情報はコード中に埋め込むより、分離して別で定義しておいた方が好ましいから
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); //認証機能の定義
export const db = getFirestore(app); //DB機能の定義
