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
  Stack,
  Text,
} from "@chakra-ui/react"; //Chakura UIインポート
import { FaUserCheck } from "react-icons/fa"; //ユーザーアイコンのインポート
import { RiMailSendLine } from "react-icons/ri"; //メールアイコンのインポート
import { useFirebase } from "../hooks/useFirebase"; //カスタムフック、useFirevaseのインポート

const SendReset = () => {
  const { loading, email, setEmail, handleResetPassword } = useFirebase(); //useFirebaseの定義

  return (
    <>
      <Flex alignItems="center" justify="center" p={5}>
        {/*Flex適用*/}
        <Card px={5}>
          {/*Chakra UIのCard適用*/}
          <Heading size="md" textAlign="center" mt={4}>
            パスワードリセット申請
          </Heading>
          <Text textAlign="center" fontSize="12px" color="gray">
            入力したメールアドレス宛にパスワードリセットURLの案内をお送りします。
          </Text>
          <CardBody w={{ base: "xs", md: "lg" }}>
            <form
              onSubmit={handleResetPassword} //formサブミットで、サインアップ処理するuseFirebaseのhandleResetPasswordを実行
            >
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FaUserCheck color="gray" />
                </InputLeftElement>
                <Input
                  autoFocus
                  type="email"
                  placeholder="登録メールアドレスを入力"
                  name="email"
                  value={email}
                  required
                  mb={2}
                  onChange={(e) => setEmail(e.target.value)} //onChangeイベントで入力値をemailにセット
                />
              </InputGroup>
              <Box mt={4} mb={2} textAlign="center">
                <Button
                  type="submit"
                  isLoading={loading}
                  loadingText="Loading"
                  spinnerPlacement="start"
                  colorScheme="green"
                  mx={2}
                >
                  <Stack mr={2}>
                    <RiMailSendLine />
                  </Stack>
                  リセット申請する
                </Button>
                <Button
                  colorScheme="gray"
                  onClick={() => window.history.back()} //JavaScriptのwindow.history.backで前のURLに先鋭
                  mx={2}
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
export default SendReset;
