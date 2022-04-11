import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState, trashState } from "./atoms";
import Board from "./Components/Board";
import CreateForm from "./Components/CreateForm";
import Trash from "./Components/Trash";

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  min-width: 380px;
  margin: 0 auto;
  justify-content: center;
  height: calc(100vh - 210px);
  position: relative;
  margin-top: 15px;
  padding: 10px;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 38px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  color: white;
`;

const Area = styled.div<{ displayStr: string }>`
  display: ${(props) => props.displayStr};
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [trash, setTrash] = useRecoilState(trashState);
  const [displayStr, setDisplayStr] = useState("");

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return;

    // delete toDo
    if (destination?.droppableId === "Trash") {
      let trashObj = {} as any;

      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        trashObj = sourceBoard[source.index];
        sourceBoard.splice(source.index, 1);
        return { ...allBoards, [source.droppableId]: sourceBoard };
      });

      setTrash((trashBoards) => {
        const sourceTrash = [...trashBoards[source.droppableId]];
        sourceTrash.splice(0, 0, trashObj);
        return { ...trashBoards, [source.droppableId]: sourceTrash };
      });
      return;
    }

    // same board movement
    if (destination?.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const draggableObj = sourceBoard[source.index];
        sourceBoard.splice(source.index, 1);
        sourceBoard.splice(destination?.index, 0, draggableObj);
        return { ...allBoards, [source.droppableId]: sourceBoard };
      });
    }

    // cross board movement
    if (destination?.droppableId !== source.droppableId) {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const draggableObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination.index, 0, draggableObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };

  const handleResize = () => {
    if (window.innerHeight > 500) {
      setDisplayStr("block");
    } else {
      setDisplayStr("none");
    }
  };

  // get local storage
  useEffect(() => {
    const storageToDos = JSON.parse(
      localStorage.getItem("toDoStorage") as string
    );
    const storageTrashs = JSON.parse(
      localStorage.getItem("trashStorage") as string
    );
    if (storageToDos !== null) {
      setToDos(storageToDos);
    }
    if (storageTrashs !== null) {
      setTrash(storageTrashs);
    }
  }, [setToDos, setTrash]);

  // set local storage
  useEffect(() => {
    if (toDos !== null) {
      localStorage.setItem("toDoStorage", JSON.stringify(toDos));
    }
    if (trash !== null) {
      localStorage.setItem("trashStorage", JSON.stringify(trash));
    }
    console.log(
      "local storage(toDos):",
      JSON.parse(localStorage.getItem("toDoStorage") as string)
    );
    console.log(
      "local storage(trash):",
      JSON.parse(localStorage.getItem("trashStorage") as string)
    );
  }, [toDos, trash]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Title>Trello ToDo</Title>
      <CreateForm />
      <Wrapper>
        <Boards>
          {/* TODO: Bug-fix --> error when first time loaded */}
          {toDos !== null && typeof toDos !== "undefined"
            ? Object.keys(toDos).map((boardId) => (
                <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
              ))
            : null}
        </Boards>
      </Wrapper>
      <Area displayStr={displayStr}>
        <Trash />
      </Area>
    </DragDropContext>
  );
}

export default App;
