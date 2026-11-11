import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type TaskStatus = 'todo' | 'in progress' | 'done';

interface TaskAttributes {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  userId: string;
}

interface TaskCreationAttributes extends Optional<TaskAttributes, 'id' | 'description'> {}

class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  declare id: string;
  declare title: string;
  declare description: string | null;
  declare status: TaskStatus;
  declare userId: string;
}

Task.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('todo', 'in progress', 'done'),
      allowNull: false,
      defaultValue: 'todo',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'tasks',
    timestamps: true,
  },
);

export default Task;

