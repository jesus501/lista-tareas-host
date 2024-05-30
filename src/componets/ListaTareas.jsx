import React, { useReducer, useEffect } from "react";
import { useForm } from "../hooks/useForm";

const initialState = [
  {
    id: new Date().getTime(),
    tarea: "explicar reducer",
    finalizado: false,
  },
];

const init = () => {
  const tareas = localStorage.getItem("tareas");
  return tareas ? JSON.parse(tareas) : initialState;
};

const tareaReducer = (state, action) => {
  switch (action.type) {
    case "[TAREA] agregar tarea":
      return [...state, action.payload];

    case "[TAREA] finalizar tarea":
      return state.map((tarea) =>
        tarea.id === action.payload.id
          ? { ...tarea, finalizado: !tarea.finalizado }
          : tarea
      );

    case "[TAREA] eliminar tarea":
      return state.filter((tarea) => tarea.id !== action.payload.id);

    case "[TAREA] borrar tarea":
      return [];

    default:
      return state;
  }
};

export const ListaTareas = () => {
  const [tareasState, dispatch] = useReducer(tareaReducer, [], init);

  const { tarea, formState, onInputChange } = useForm({ tarea: "" });

  useEffect(() => {
    localStorage.setItem("tareas", JSON.stringify(tareasState));
  }, [tareasState]);

  const agregarTarea = (event) => {
    event.preventDefault();
    if (formState.tarea.trim() === "") return;

    const nuevaTarea = {
      id: new Date().getTime(),
      tarea: formState.tarea,
      finalizado: false,
    };

    const action = {
      type: "[TAREA] agregar tarea",
      payload: nuevaTarea,
    };

    dispatch(action);
  };

  const finalizarTarea = (item) => {
    const action = {
      type: "[TAREA] finalizar tarea",
      payload: item,
    };
    dispatch(action);
  };

  const eliminarTarea = (item) => {
    const action = {
      type: "[TAREA] eliminar tarea",
      payload: item,
    };
    dispatch(action);
  };

  const reset = () => {
    const action = {
      type: "[TAREA] borrar tarea",
    };
    dispatch(action);
  };

  return (
    <>
      <form onSubmit={agregarTarea}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name="tarea"
            placeholder="ingresa tarea"
            value={tarea}
            onChange={onInputChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <button type="button" className="btn btn-danger" onClick={reset}>
          Reset
        </button>
      </form>
      <hr />
      <ul className="list-group">
        {tareasState.map((item) => (
          <li key={item.id} className="list-group-item">
            <span>{item.tarea} </span>
            <div>
              <input
                type="checkbox"
                checked={item.finalizado}
                onChange={() => finalizarTarea(item)}
              />
              <button
                className="btn btn-danger"
                onClick={() => eliminarTarea(item)}
              >
                borrar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
