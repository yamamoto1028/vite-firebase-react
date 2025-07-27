import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"; //追加：ChakraUIのModal関係インポート
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { useFirebase } from "../hooks/useFirebase";
import type { StudyData } from "../types/studyData";

const Home = () => {
  const {
    loading,
    user,
    email,
    learnings,
    fetchDb,
    calculateTotalTime,
    updateDb,
    entryDb,
    deleteDb,
  } = useFirebase(); //useFirebase定義
  const modalEdit = useDisclosure(); //編集用モーダルのクローズ、オープン制御のフック、useDisclosureの定義※ChakraUI
  const modalEntry = useDisclosure(); //新規登録ようモーダルのクローズ、オープン制御のフック↑同様
  const modalDelete = useDisclosure(); //追加：新規登録ようモーダルのクローズ、オープン制御のフック↑同様
  const initialRef = useRef(null); //モーダルオープン時のフォーカス箇所を定義
  const [editLearning, setEditLearning] = useState<StudyData>({
    //学習記録の登録・更新・削除用のstate
    id: "",
    title: "",
    time: 0,
  });
  const [entryLearning, setEntryLearning] = useState<StudyData>({
    id: "",
    title: "",
    time: 0,
  });
  const [deleteLearning, setDeleteLearning] = useState<StudyData>({
    id: "",
    title: "",
    time: 0,
  });
  const toast = useToast(); //ChakraUIのToast機能
  useEffect(() => {
    //useEffect
    if (user) {
      //ユーザーがセッション中であれば、
      fetchDb(email); //emailをキーに、FirestoreDBをフェッチ、データを取得
      console.log("Firestore", email); //コンソールログ出力
    }
  }, [user]); // userが更新された時に実行
  const handleUpdate = async () => {
    //クリック時、DBデータ更新し、その後、更新反映されたDBデータを取得、ローディングが解除されたら、モーダルクローズ
    await updateDb(editLearning); //useFirebaseのupdateDbを実行し、DBデータを更新
    fetchDb(email); //DB更新処理終了後、更新反映されたDBデータを改めて取得
    if (!loading) {
      //ローディング解除されたら、0.5秒後、モーダルをクローズ
      setTimeout(() => {
        modalEdit.onClose();
      }, 500);
    }
  };

  const handleEntry = async () => {
    //クリック時、入力データの新規登録、もしくは既存データの更新を実施
    if (learnings.some((l) => l.title === entryLearning.title)) {
      //入力データのtitleが既存アイテムに存在するか確認
      const existingLearning = learnings.find(
        (l) => l.title === entryLearning.title
      ); //既存確認結果をexistingLearningに代入
      if (existingLearning) {
        //既存アイテムがあれば
        existingLearning.time += entryLearning.time; //該当既存アイテムの時間に入力された時間を加算し、
        await updateDb(existingLearning); //DBデータを更新
      }
    } else {
      //既存アイテムがなければ、DBへのデータ新規登録を実施
      await entryDb(entryLearning);
    }
    fetchDb(email); //処理完了後、反映されたDBデータを改めて取得
    setEntryLearning({ id: "", title: "", time: 0 }); //entryLearningを初期化
    if (!loading) {
      //ローディング解除されたら、0.5秒後、モーダルをクローズ
      setTimeout(() => {
        modalEntry.onClose();
      }, 500);
    }
  };

  const handleDelete = async () => {
    await deleteDb(deleteLearning);
    fetchDb(email); //処理完了後、反映されたDBデータを改めて取得
    if (!loading) {
      //ローディング解除されたら、0.5秒後、モーダルをクローズ
      setTimeout(() => {
        modalDelete.onClose();
      }, 500);
    }
  };
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
                          {/* <Button variant="ghost">
                            <FiEdit color="black" />
                          </Button> */}
                          {/* 追加：編集用モーダルここから */}
                          <Button
                            variant="ghost"
                            onClick={() => {
                              //モーダルオープンのボタン部分
                              setEditLearning(learning); //クリックしたら、mapで展開されているlearningをeditLearningにセット
                              modalEdit.onOpen(); //モーダルをオープンする。編集用のモーダルのため、modalEdit.onOpen()の形で指定。
                            }}
                          >
                            <FiEdit color="black" />
                          </Button>

                          <Modal
                            initialFocusRef={initialRef} //ここからモーダルの内容
                            isOpen={modalEdit.isOpen} //モーダルのオープン状態を監視、編集用のモーダルのため、modalEdit.を付与
                            onClose={modalEdit.onClose} //モーダルクローズの定義、編集用のモーダルのため、modalEdit.を付与
                          >
                            <ModalOverlay />
                            <ModalContent>
                              <ModalHeader>記録編集</ModalHeader>
                              <ModalCloseButton />
                              <ModalBody pb={6}>
                                <FormControl>
                                  <FormLabel>学習内容</FormLabel>
                                  <Input
                                    ref={initialRef}
                                    placeholder="学習内容"
                                    name="title"
                                    value={editLearning.title} //valueはロカールステートを利用
                                    onChange={(e) => {
                                      //Inputエリアのtitleの入力値をeditLearning.titleに格納
                                      setEditLearning({
                                        ...editLearning,
                                        title: e.target.value,
                                      });
                                    }}
                                  />
                                </FormControl>

                                <FormControl mt={4}>
                                  <FormLabel>学習時間</FormLabel>
                                  <Input
                                    type="number"
                                    placeholder="学習時間"
                                    name="time"
                                    value={editLearning.time} //valueはロカールステートを利用
                                    onChange={(e) => {
                                      //Inputエリアのtitleの入力値をeditLearning.timeに数値に変換して格納
                                      setEditLearning({
                                        ...editLearning,
                                        time: Number(e.target.value),
                                      });
                                    }}
                                  />
                                  <FormHelperText color={"black"}>
                                    <div>
                                      入力されている学習内容：
                                      {
                                        editLearning.title //ロカールステートを利用
                                      }
                                    </div>
                                    <div>
                                      入力されている学習時間：
                                      {
                                        editLearning.time //ロカールステートを利用
                                      }
                                    </div>
                                  </FormHelperText>
                                </FormControl>
                              </ModalBody>
                              <ModalFooter>
                                <Button
                                  isLoading={loading}
                                  loadingText="Loading"
                                  spinnerPlacement="start"
                                  colorScheme="green"
                                  mr={3}
                                  onClick={() => {
                                    if (
                                      editLearning.title !== "" &&
                                      editLearning.time > 0
                                    ) {
                                      //学習タイトルと時間が共に入力されていれば、
                                      handleUpdate(); //DB更新処理実行
                                    } else {
                                      toast({
                                        //学習タイトルと時間が共に入力されていなければ、エラーメッセージ表示
                                        title:
                                          "学習内容と時間を入力してください",
                                        position: "top",
                                        status: "error",
                                        duration: 2000,
                                        isClosable: true,
                                      });
                                    }
                                  }}
                                >
                                  データを更新
                                </Button>
                                <Button
                                  onClick={() => {
                                    //cancelクリックの場合、そのままモーダルクローズ
                                    modalEdit.onClose(); //編集用のモーダルのため、modalEdit.を付与
                                  }}
                                >
                                  Cancel
                                </Button>
                              </ModalFooter>
                            </ModalContent>
                          </Modal>
                          {/* 編集用モーダルここまで */}
                        </Td>
                        <Td>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              //モーダルオープンのボタン部分
                              setDeleteLearning(learning); //クリックしたら、mapで展開されているlearningをeditLearningにセット
                              modalDelete.onOpen(); //モーダルをオープンする。編集用のモーダルのため、modalEdit.onOpen()の形で指定。
                            }}
                          >
                            <MdDelete color="black" />
                          </Button>
                          <Modal
                            initialFocusRef={initialRef} //ここからモーダルの内容
                            isOpen={modalDelete.isOpen} //モーダルのオープン状態を監視、編集用のモーダルのため、modalEdit.を付与
                            onClose={modalDelete.onClose} //モーダルクローズの定義、編集用のモーダルのため、modalEdit.を付与
                          >
                            <ModalOverlay />
                            <ModalContent>
                              <ModalHeader>データ削除</ModalHeader>
                              <ModalCloseButton />
                              <ModalBody pb={6}>
                                <Box>
                                  以下のデータを削除します。
                                  <br />
                                  学習内容：{deleteLearning.title}、学習時間:
                                  {deleteLearning.time}
                                </Box>
                              </ModalBody>
                              <ModalFooter>
                                <Button onClick={modalDelete.onClose} mr={3}>
                                  Cancel
                                </Button>
                                <Button
                                  isLoading={loading}
                                  loadingText="Loading"
                                  spinnerPlacement="start"
                                  ref={initialRef}
                                  colorScheme="red"
                                  onClick={handleDelete}
                                >
                                  削除
                                </Button>
                              </ModalFooter>
                            </ModalContent>
                          </Modal>
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
                  onClick={modalEntry.onOpen}
                >
                  新規データ登録
                </Button>
                <Modal
                  initialFocusRef={initialRef}
                  isOpen={modalEntry.isOpen}
                  onClose={modalEntry.onClose}
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>新規データ登録</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                      <FormControl>
                        <FormLabel>学習内容</FormLabel>
                        <Input
                          ref={initialRef}
                          placeholder="学習内容"
                          name="newEntryTitle"
                          value={entryLearning.title} //valueはロカールステートを利用
                          onChange={(e) => {
                            //Inputエリアのtitleの入力値をeditLearning.titleに格納
                            setEntryLearning({
                              ...entryLearning,
                              title: e.target.value,
                            });
                          }}
                        />
                      </FormControl>

                      <FormControl mt={4}>
                        <FormLabel>学習時間</FormLabel>
                        <Input
                          type="number"
                          placeholder="学習時間"
                          name="newEntryTime"
                          value={entryLearning.time} //valueはロカールステートを利用
                          onChange={(e) => {
                            //Inputエリアのtitleの入力値をeditLearning.timeに数値に変換して格納
                            setEntryLearning({
                              ...entryLearning,
                              time: Number(e.target.value),
                            });
                          }}
                        />
                        <FormHelperText color={"black"}>
                          <div>
                            入力されている学習内容：
                            {
                              entryLearning.title //ロカールステートを利用
                            }
                          </div>
                          <div>
                            入力されている学習時間：
                            {
                              entryLearning.time //ロカールステートを利用
                            }
                          </div>
                        </FormHelperText>
                      </FormControl>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        isLoading={loading}
                        loadingText="Loading"
                        spinnerPlacement="start"
                        colorScheme="green"
                        mr={3}
                        onClick={() => {
                          if (
                            entryLearning.title !== "" &&
                            entryLearning.time > 0
                          ) {
                            //学習タイトルと時間が共に入力されていれば、//DB新規登録処理実行（登録済アイテムであれば既存アイテムに時間加算して更新）
                            handleEntry();
                          } else {
                            toast({
                              //学習タイトルと時間が共に入力されていなければ、エラーメッセージ表示
                              title: "学習内容と時間を入力してください",
                              position: "top",
                              status: "error",
                              duration: 2000,
                              isClosable: true,
                            });
                          }
                        }}
                      >
                        登録
                      </Button>
                      <Button
                        onClick={() => {
                          //cancelクリックの場合、そのままモーダルクローズ
                          modalEntry.onClose(); //新規登録用のモーダルのため、modalEntry.を付与
                        }}
                      >
                        Cancel
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
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
