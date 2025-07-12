import { useState } from "react"; //useStateのインポート
import { useNavigate } from "react-router-dom"; //React RouterのuseNavigateのインポート
import { useToast } from "@chakra-ui/react"; //Chakra UIのToast機能のインポート
import { signInWithEmailAndPassword } from "firebase/auth"; //FirebaseSDKのemailログイン機能のインポート
import { auth } from "../utils/firebase.ts"; //Firebaseクライアントから認証機能のインポート

type UseFirebase = () => {
  //useFirebasの型定義、関数として型定義 (() => {})
  loading: boolean; //真偽値
  setLoading: React.Dispatch<React.SetStateAction<boolean>>; //React setStateの型
  email: string; //文字列
  setEmail: React.Dispatch<React.SetStateAction<string>>; //React setStateの型
  password: string; //文字列
  setPassword: React.Dispatch<React.SetStateAction<string>>; //React setStateの型
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => Promise<void>; //関数handleLoginの型
};

export const useFirebase: UseFirebase = () => {
  //コンポーネントの定義、型はUseFirebaseとして設定
  const [loading, setLoading] = useState(false); //ローディング状態を管理するstateの定義
  const [email, setEmail] = useState(""); //emailを管理するstateの定義
  const [password, setPassword] = useState(""); //passwordを管理するstateの定義
  const navigate = useNavigate(); //React RouterのNavigate機能を利用
  const toast = useToast(); //Chakura UIのToastの利用

  ////Authentication
  //ログイン処理
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    //async/awaitによる非同期通信、React.FormEventによるイベントの型
    e.preventDefault(); // submitイベントの本来の動作を抑止
    setLoading(true); //ローディングをローディング状態に
    try {
      const userLogin = await signInWithEmailAndPassword(auth, email, password); //Firebase SDKによるログイン処理、authは、firebaseクライアントで定義した引数
      console.log("User Logined:", userLogin);
      toast({
        //処理が正常終了すれば、Chakra UIのToastを利用し、ログイン成功メッセージを表示
        title: "ログインしました",
        position: "top",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate("/"); //ログイン成功後、Home画面('/')に遷移
    } catch (error) {
      //エラー時は、Chakra UIのToastを利用し、エラーメッセージ表示
      console.error("Error during sign up:", error);
      toast({
        title: "ログインに失敗しました",
        description: `${error}`,
        position: "top",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setLoading(false); //最終処理ととして、ローディング状態を解除
    }
  };
  return {
    loading,
    setLoading,
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
  };
};
