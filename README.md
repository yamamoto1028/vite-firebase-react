Firebaseコンソール
https://console.firebase.google.com/u/0/project/vite-firebase-react/hosting/sites/vite-firebase-react

https://zenn.dev/amayann/books/0d6c7caea3626b/viewer/3b9ef9


全体の構成イメージ
App.tsx
トップコンポーネントです。
components/Login.tsx
ログイン画面です。ログインしていない場合の初期画面となります。ルーティングは”/login”で設定します。
components/Home.tsx
学習記録を表示する Home 画面です。ログイン状態であれば、最初に表示される画面です。ルーティングは”/”で設定します。
components/Home(Modal) Edit
学習記録を編集・更新する画面です。Home.tsx の中でモーダルを採用しています。
components/Home(Modal) Delete
学習記録を削除する画面です。Home.tsx の中でモーダルを採用しています。
components/Home(Modal) Entry
学習記録を新規登録する画面です。Home.tsx の中でモーダルを採用しています。
components/Home(Modal) Logout
ログアウト用のモーダル。Home.tsx の中で実装しています。ログアウトすると、初期画面（ログインページ）に遷移します。
components/Register.tsx
ユーザーサインアップの画面です。ログイン初期画面で新規登録をクリックすると遷移します。ルーティングは”/register”でセットします。
components/ResetSend.tsx
パスワード忘れ等、パスワードをリセットする場合の画面です。入力されたメールアドレス宛にリセット画面 URL の案内メールを送信します。ルーティングは”/sendReset”でセットします。
components/UpdatePassword.tsx
ログインしている状態でパスワード変更を行う場合に利用します。ルーティングは”/updatePassword”でセットします。
なお、パスワードをリセットの場合は、メールで案内されるのは、Firebase 側で持っている UI 画面になります。そちらでパスワードリセット処理を行います。

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
