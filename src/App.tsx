import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./Pages/Main";
import Undefined from "./Pages/Undefined";
import Detail from "./Pages/Detail";
import Edit from "./Pages/Edit";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Note, NoteData, Tag } from "./types";
import { v4 } from "uuid";
import Layout from "./components/Layout";
import Create from "./Pages/Create";

const App = () => {
  const [notes, setNotes] = useLocalStorage<Note[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  // etiket oluşturma fonk
  const createTag = (tag: Tag): void => {
    setTags([...tags, tag]);
  };

  // not oluşturma fonk
  const createNote = (noteData: NoteData): void => {
    // formdan gelen veriye id ekle
    const newNote: Note = {
      id: v4(),
      ...noteData,
    };

    setNotes([...notes, newNote]);
  };

  // note silme fonk
  const deleteNote = (id: string): void => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  // note düzenleme fonk
  const updateNote = (id: string, updatedData: NoteData): void => {
    const updatedArr = notes.map((note) =>
      note.id === id ? { id, ...updatedData } : note
    );

    setNotes(updatedArr);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main notes={notes} availableTags={tags} />} />

        <Route
          path="/new"
          element={
            <Create
              handleSubmit={createNote}
              createTag={createTag}
              availableTags={tags}
            />
          }
        />

        <Route path="/note/:id" element={<Layout notes={notes} />}>
          <Route index element={<Detail deleteNote={deleteNote} />} />

          <Route
            path="edit"
            element={
              <Edit
                handleSubmit={updateNote}
                createTag={createTag}
                availableTags={tags}
              />
            }
          />
        </Route>

        <Route path="*" element={<Undefined />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
