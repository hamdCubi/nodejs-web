const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  name: {
    type: String,
  },
  role: {
    type: String,
  },
  parent: {
    type: String,
  },
  password: {
    type: String,
  },
});

const User = mongoose.model("Users", UserSchema);

class UserModel {
  static async create(name, email, role, parent , password) {
    try {
      const newUser = new User({
        name,
        email,
        role,
        parent,
        password
      });

      await newUser.save();
      return newUser._id;
    } catch (error) {
      console.error('Error in UserModel.create:', error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      console.error('Error in UserModel.findByEmail:', error);
      throw error;
    }
  }

  static async findById(userId) {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      console.error('Error in UserModel.findById:', error);
      throw error;
    }
  }

  static async updateUser(data) {
    try {
      const { id, email, name, role } = data;

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, email, role },
        { new: true }
      );

      return updatedUser;
    } catch (error) {
      console.error('Error in UserModel.updateUser:', error);
      throw error;
    }
  }

  static async deleteUserById(userId) {
    try {
      const result = await User.deleteOne({ _id: userId });
      return result;
    } catch (error) {
      console.error('Error in UserModel.deleteUserById:', error);
      throw error;
    }
  }
}

module.exports = UserModel;
