import { useState } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { GET_CURRENT_USER, GET_MY_NOTES } from "../graphql/queries";
import { CREATE_NOTE, UPDATE_NOTE, DELETE_NOTE } from "../graphql/mutations";

function Notes() {
  const navigate = useNavigate();
  const client = useApolloClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");

  const { data: userData, loading: userLoading, error: userError } = useQuery(
    GET_CURRENT_USER,
    { fetchPolicy: "network-only" }
  );

  const { data: notesData, loading: notesLoading, refetch } = useQuery(
    GET_MY_NOTES,
    { fetchPolicy: "network-only" }
  );

  const [createNote] = useMutation(CREATE_NOTE);
  const [updateNote] = useMutation(UPDATE_NOTE);
  const [deleteNote] = useMutation(DELETE_NOTE);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateNote({
          variables: {
            id: editingId,
            title,
            content
          }
        });
        setMessage("Note updated successfully");
      } else {
        await createNote({
          variables: {
            title,
            content
          }
        });
        setMessage("Note created successfully");
      }

      setTitle("");
      setContent("");
      setEditingId("");
      refetch();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote({
        variables: { id }
      });
      setMessage("Note deleted successfully");
      refetch();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    await client.resetStore();
    navigate("/login");
  };

  if (userLoading || notesLoading) {
    return <p style={{ padding: "30px" }}>Loading...</p>;
  }

  if (userError) {
    return <p style={{ padding: "30px" }}>Please login again.</p>;
  }

  return (
    <div className="app-shell">
      <div className="notes-shell">
        <div className="notes-header">
          <div className="notes-title-row">
            <div>
              <h2 className="notes-title">My NoteSpace</h2>
              <div className="notes-meta">
                <div>Welcome, {userData.currentUser.username}</div>
                <div>{userData.currentUser.email}</div>
              </div>
            </div>

            <button className="secondary-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="notes-content">
          <div className="note-form-card">
            <h3 className="note-form-title">
              {editingId ? "Edit Note" : "Create Note"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  placeholder="Enter note title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Note</label>
                <textarea
                  placeholder="Write your note here"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="6"
                />
              </div>

              <button type="submit" className="primary-btn">
                {editingId ? "Update Note" : "Add Note"}
              </button>
            </form>

            <p className="message-text">{message}</p>
          </div>

          <div>
            <h3>My Notes List</h3>

            {notesData?.getMyNotes?.length === 0 ? (
              <div className="empty-state">No notes found yet.</div>
            ) : (
              <div className="notes-list-grid">
                {notesData.getMyNotes.map((note) => (
                  <div key={note.id} className="note-card">
                    <div>
                      <h4>{note.title}</h4>
                      <p>{note.content}</p>
                    </div>

                    <div className="note-actions">
                      <button
                        className="small-btn"
                        onClick={() => handleEdit(note)}
                      >
                        Edit
                      </button>

                      <button
                        className="danger-btn"
                        onClick={() => handleDelete(note.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notes;