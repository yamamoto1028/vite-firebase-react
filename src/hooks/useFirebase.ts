import { useState, useEffect } from "react"; //useState, useEffectのインポート
import { useNavigate } from "react-router-dom"; //React RouterのuseNavigateのインポート
import { useToast } from "@chakra-ui/react"; //Chakra UIのToast機能のインポート
import { signInWithEmailAndPassword, type User } from "firebase/auth"; //FirebaseSDKのemailログイン機能のインポート//Userも追加
import { collection, getDocs, query, where } from "firebase/firestore"; //firestore関連追加
import { auth, db } from "../utils/firebase.ts"; //Firebaseクライアントから認証機能のインポート//db追加
import type { StudyData } from "../types/studyData.ts";
//型定義をインポート

type UseFirebase = () => {
  //useFirebasの型定義、関数として型定義 (() => {})
  loading: boolean; //真偽値
  setLoading: React.Dispatch<React.SetStateAction<boolean>>; //React setStateの型
  email: string; //文字列
  setEmail: React.Dispatch<React.SetStateAction<string>>; //React setStateの型
  password: string; //文字列
  setPassword: React.Dispatch<React.SetStateAction<string>>; //React setStateの型
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => Promise<void>; //関数handleLoginの型
  user: User | null; // 追加、FirebaseSDKによるUser型またはNull
  setUser: React.Dispatch<React.SetStateAction<User | null>>; //追加
  learnings: StudyData[]; //追加、FirestoreDBから取得する学習記録の配列、StudyDataの型データによる配列
  setLearnings: React.Dispatch<React.SetStateAction<StudyData[]>>; //追加
  fetchDb: (data: string) => Promise<void>; //追加
  calculateTotalTime: () => number; //追加
};

export const useFirebase: UseFirebase = () => {
  //コンポーネントの定義、型はUseFirebaseとして設定
  const [loading, setLoading] = useState(false); //ローディング状態を管理するstateの定義
  const [email, setEmail] = useState(""); //emailを管理するstateの定義
  const [password, setPassword] = useState(""); //passwordを管理するstateの定義
  const [user, setUser] = useState<User | null>(null); // セッションユーザ情報のステート追加
  const [learnings, setLearnings] = useState<StudyData[]>([]); //学習記録データのステート追加
  const navigate = useNavigate(); //React RouterのNavigate機能を利用
  const toast = useToast(); //Chakura UIのToastの利用

  //追加、ユーザがセッション中か否かの判定処理
  useEffect(() => {
    const unsubscribed = auth.onAuthStateChanged((user) => {
      //FirebaseSDKのonAuthStateChangedメソッドによるユーザーセッション情報取得
      setUser(user); //取得したユーザー情報をsetUserでuserステートに格納
      if (user) {
        //セッション中のユーザーがあれば
        setEmail(user.email as string); //user情報の中のemailデータをsetEmailでemailステートにセット
      } else {
        // 認証が不要なページのパスリスト
        const authNotRequiredPaths = ["/login", "/register", "/sendReset"];
        // 現在のパスを取得
        const currentPath = window.location.pathname;

        // 現在のパスが認証不要なページでない場合のみリダイレクト
        if (!authNotRequiredPaths.includes(currentPath)) {
          navigate("/login"); //userがセッション中でなければ/loginに移動
        }
      }
    });
    return () => {
      unsubscribed(); //unsubscribed()を実行
    };
  }, [user]); //user状態に変化があった時に実行

  ////Firestore
  //追加、Firestoreデータ取得
  const fetchDb = async (data: string) => {
    //async/awaitで処理実施
    setLoading(true); //ローディングをローディング中にセット
    try {
      const usersCollectionRef = collection(db, "users_learnings"); //取得するデータ（コレクション）の定義、users_learningsから取得
      const q = query(usersCollectionRef, where("email", "==", data)); // emailのデータが、ログインユーザーのemailとマッチするするものを取得
      const querySnapshot = await getDocs(q); //querySnapshot に取得したデータを格納
      const fetchedLearnings = querySnapshot.docs.map(
        (doc) =>
          ({
            //querySnapshotに格納されたデータをmapメソッドで展開し、dod.data()に格納。
            ...doc.data(),
            id: doc.id,
          } as StudyData)
      ); // Firebaseから取得したデータは型情報がないため、`StudyData`型に明示的に変換
      setLearnings(fetchedLearnings); // 先に処理したfetchedLearningsを、setLearningsで、learningsに`StudyData`型でセット
    } catch (error) {
      console.error("Error getting documents: ", error); //エラー発生の場合、エラー出力
    } finally {
      setLoading(false); //最後に、ローディング状態を解除
    }
  };

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

  ////Others
  //追加、学習時間合計
  const calculateTotalTime = () => {
    //学習記録の時間の合計を算出
    return learnings.reduce((total, learning) => total + learning.time, 0); //JavaScriptのreduce()メソッドでトータルを計算
  };

  return {
    loading,
    setLoading,
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    user,
    setUser,
    learnings,
    setLearnings,
    fetchDb,
    calculateTotalTime,
  };
};
