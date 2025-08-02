import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
//Chakura UIインポート
import { FaUserCheck } from "react-icons/fa"; //ユーザーアイコンインポート
import { RiLockPasswordFill } from "react-icons/ri"; //パスワードアイコンインポート
import { useFirebase } from "../hooks/useFirebase"; //カスタムフック、useFirebaseインポート

const Register = () => {
  const {
    loading,
    email,
    setEmail,
    password,
    setPassword,
    passwordConf,
    setPasswordConf,
    handleSignup,
  } = useFirebase();
  return (
    <>
      <Flex justifyContent="center">
        <Card size={{ base: "sm", md: "lg" }} p={4}>
          <Heading size="md" textAlign="center">
            ユーザ登録
          </Heading>
          <CardBody>
            <form onSubmit={handleSignup}>
              {/*formサブミットで、サインアップ処理するuseFirebaseのhandleSignupを実行*/}
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FaUserCheck color="gray" />
                </InputLeftElement>
                <Input
                  autoFocus
                  type="email"
                  placeholder="メールアドレスを入力"
                  name="email"
                  value={email}
                  required
                  mb={2}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
              <Text fontSize="12px" color="gray">
                パスワードは6文字以上
              </Text>{" "}
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <RiLockPasswordFill color="gray" />
                </InputLeftElement>
                <Input
                  autoFocus
                  type="password"
                  placeholder="パスワードを入力"
                  name="password"
                  value={password}
                  required
                  mb={2}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputGroup>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <RiLockPasswordFill color="gray" />
                </InputLeftElement>
                <Input
                  autoFocus
                  type="password"
                  placeholder="パスワードを入力(確認)"
                  name="password"
                  value={passwordConf}
                  required
                  mb={2}
                  onChange={(e) => setPasswordConf(e.target.value)}
                />
              </InputGroup>
              <Box mt={4} mb={2} textAlign="center">
                <Button
                  isLoading={loading}
                  loadingText="Loading"
                  spinnerPlacement="start"
                  type="submit"
                  colorScheme="green"
                  width="100%"
                  mb={2}
                >
                  登録する
                </Button>
                <Button
                  colorScheme="gray"
                  onClick={() => window.history.back()}
                  width="100%"
                >
                  戻る
                </Button>
              </Box>
            </form>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
};
export default Register;
