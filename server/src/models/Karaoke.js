import { DataTypes } from "sequelize";
import sequelize from "../../db.js";
import User from "./User.js";

const Karaoke = sequelize.define("Karaoke", {
    karaokeId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    song_name: { type: DataTypes.STRING, allowNull: false },
    artist: { type: DataTypes.STRING, allowNull: false },
    youtube_link: { type: DataTypes.STRING, allowNull: false },
}, {
    tableName: "Karaoke",
});

Karaoke.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Karaoke, { foreignKey: "userId" });

export default Karaoke;