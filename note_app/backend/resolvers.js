import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./User.js";
import Note from "./Note.js";

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });
};

const resolvers = {
  Query: {
    currentUser: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      return context.user;
    },

    getMyNotes: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      return await Note.find({ userId: context.user._id }).sort({ createdAt: -1 });
    },

    getNoteById: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      const note = await Note.findById(args.id);

      if (!note) {
        throw new Error("Note not found");
      }

      if (note.userId.toString() !== context.user._id.toString()) {
        throw new Error("Not authorized");
      }

      return note;
    }
  },

  Mutation: {
    register: async (parent, args) => {
      const { username, email, password } = args;

      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email,
        password: hashedPassword
      });

      const token = createToken(user._id);

      return {
        token,
        user
      };
    },

    login: async (parent, args) => {
      const { email, password } = args;

      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("Invalid email or password");
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new Error("Invalid email or password");
      }

      const token = createToken(user._id);

      return {
        token,
        user
      };
    },

    logout: async () => {
      return "Logged out successfully";
    },

    createNote: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      const newNote = new Note({
        title: args.title,
        content: args.content,
        userId: context.user._id
      });

      await newNote.save();

      return newNote;
    },

    updateNote: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      const note = await Note.findById(args.id);

      if (!note) {
        throw new Error("Note not found");
      }

      if (note.userId.toString() !== context.user._id.toString()) {
        throw new Error("Not authorized");
      }

      note.title = args.title;
      note.content = args.content;

      await note.save();

      return note;
    },

    deleteNote: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      const note = await Note.findById(args.id);

      if (!note) {
        throw new Error("Note not found");
      }

      if (note.userId.toString() !== context.user._id.toString()) {
        throw new Error("Not authorized");
      }

      await Note.findByIdAndDelete(args.id);

      return "Note deleted successfully";
    }
  }
};

export default resolvers;