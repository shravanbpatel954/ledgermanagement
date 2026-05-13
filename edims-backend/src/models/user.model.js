import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/db.js';

const User = sequelize.define(
  'User',
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM('Admin', 'Staff'), // must match DB ENUM
      allowNull: false,
    },

    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },

    reset_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    reset_token_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'Users',
    timestamps: false,
  }
);

/* --------------------------------------
   🔐 Password compare method
-------------------------------------- */
User.prototype.checkPassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password_hash);
};

function isBcryptHash(value) {
  return typeof value === 'string' && /^\$2[aby]\$/.test(value);
}

/* --------------------------------------
   🔒 Hash plain password on create / update
   (Skip if value is already a bcrypt hash — avoids double-hash bugs)
-------------------------------------- */
User.beforeCreate(async (user) => {
  if (user.password_hash && !isBcryptHash(user.password_hash)) {
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(user.password_hash, salt);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('password_hash') && user.password_hash && !isBcryptHash(user.password_hash)) {
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(user.password_hash, salt);
  }
});

export default User;
