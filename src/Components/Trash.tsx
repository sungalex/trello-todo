import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useRecoilValue } from "recoil";
import { toDoState } from "../atoms";

const Wrapper = styled.div<{ length: number }>`
  position: absolute;
  bottom: 15px;
  left: calc(100vw / 2 - 30px);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
`;

const Icon = styled.span`
  position: fixed;
  color: white;
  font-size: 150%;
  padding: 5px;
  :hover {
    color: #fff700;
  }
`;

const Area = styled.div``;

function Trash() {
  const toDos = useRecoilValue(toDoState);
  let length = Object.keys(toDos).length;
  if (length < 3) {
    length = 3;
  }

  return (
    <Wrapper length={length}>
      <Icon>
        <FontAwesomeIcon icon={faTrashCan} size="lg" />
      </Icon>
      <Droppable droppableId="Trash" isCombineEnabled={true}>
        {(provided, snapshot) => (
          <Area ref={provided.innerRef} {...provided.droppableProps}>
            {provided.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Trash;
