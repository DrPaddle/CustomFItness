import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
// import uuid from "uuid/v4";


export default function ExerciseList(props) {
  
  const columnsFromBackend = {
    select: {
      name: "Select Exercise(s)",
      items: []
    },
    selected: {
      name: "Selected Exercise(s)",
      items: []
    }
  };
  const [columns, setColumns] = useState(columnsFromBackend);
  useEffect(()=>{
    const itemsFromBackend = props.exerciseData;
    // const selectedExercise=[];
    setColumns(prev => {
      return {
        ...prev,
        select: {name: "Select Exercise(s)", items: itemsFromBackend} 
      }
    });
    
    // console.log("if we get this one, we are good=>",columnsFromBackend)
    
  },[props.exerciseData])
  
  console.log("selected is ---->", columns.selected.items)
 
 
  
 
  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
  
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }
  };
  
  
  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <DragDropContext
        onDragEnd={result => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              alignItems: "center"
            }}
            key={columnId}
            >
              <h2
                style={{
                  color: "black"
                }}
                >
                {column.name}
              </h2>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        background: snapshot.isDraggingOver
                        ? "lightblue"
                        : "lightgrey",
                        padding: 4,
                        width: 250,
                        minHeight: 500
                      }}
                      >
                        {column.items.map((item, index) => {
                          
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: "none",
                                      padding: 16,
                                      margin: "0 0 8px 0",
                                      minHeight: "50px",
                                      backgroundColor: snapshot.isDragging
                                        ? "#263B4A"
                                        : "#456C86",
                                      color: "white",
                                      ...provided.draggableProps.style
                                    }}
                                  >
                                    {item.name}
                                    <br/>
                                    {/* <img src={item.thumbnail_photo_url} /> */}
                                    {item.explanation}
                                    <br/>
                                    {item.body_part}
                                    <br/>
                                    {item.type}
                                    <br/>
                                    {item.content_video}

                                    
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}
