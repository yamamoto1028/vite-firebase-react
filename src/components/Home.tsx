import { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { useFirebase } from "../hooks/useFirebase";

const Home = () => {
  const { loading, user, email, learnings, fetchDb, calculateTotalTime } =
    useFirebase(); //useFirebase定義追加
  useEffect(() => {
    //useEffect追加
    if (user) {
      //ユーザーがセッション中であれば、
      fetchDb(email); //emailをキーに、FirestoreDBをフェッチ、データを取得
      console.log("Firestore", email); //コンソールログ出力
    }
  }, [user]); // userが更新された時に実行
  return (
    <>
      <Flex alignItems="center" justify="center" p={5}>
        <Card size={{ base: "sm", md: "lg" }}>
          <Box textAlign="center" mb={2} mt={10}>
            ようこそ！ {email} さん{/*定数実装 */}
          </Box>
          <Heading size="md" textAlign="center">
            Learning Records
          </Heading>
          <CardBody>
            <Box textAlign="center">
              学習記録
              {
                loading && (
                  <Box p={10}>
                    <Spinner />
                  </Box>
                ) //追加、ローティング中であれば<Spinner />を表示
              }
              <TableContainer>
                <Table variant="simple" size={{ base: "sm", md: "lg" }}>
                  <Thead>
                    <Tr>
                      <Th>学習内容</Th>
                      <Th>時間(分)</Th>
                      <Th></Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {" "}
                    {learnings.map((learning, index) => (
                      //mapメソッドでlearningsのタイトルと時間を各々表示
                      <Tr key={index}>
                        <Td>{learning.title}</Td>
                        <Td>{learning.time}</Td>
                        {/* <Tr>
                      <Td>React</Td>
                      <Td>10</Td> */}
                        <Td>
                          <Button variant="ghost">
                            <FiEdit color="black" />
                          </Button>
                        </Td>
                        <Td>
                          <Button variant="ghost">
                            <MdDelete color="black" />
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
            <Box p={5}>
              {/* <div>合計学習時間：10分</div> あとで定数実装 */}
              <div>合計学習時間：{calculateTotalTime()}分</div>
            </Box>
            <Box p={25}>
              <Stack spacing={3}>
                <Button
                  colorScheme="green"
                  variant="outline"
                  onClick={() => {}}
                >
                  新規データ登録
                </Button>
              </Stack>
            </Box>
            <Box px={25} mb={4}>
              <Stack spacing={3}>
                <Button width="100%" variant="outline" onClick={() => {}}>
                  ログアウト
                </Button>
              </Stack>
            </Box>
            <Box px={25} mb={4}>
              <Stack spacing={3}>
                <Button width="100%" variant="outline" onClick={() => {}}>
                  パスワード更新
                </Button>
              </Stack>
            </Box>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
};
export default Home;
