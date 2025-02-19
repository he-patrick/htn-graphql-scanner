import sequelize from "../../db.js";

export async function getScanData({ min_frequency, max_frequency, activity_category }) {

    const results = await sequelize.query(`
        SELECT 
            activity_name,
            COUNT(activity_name) AS frequency
        FROM 
            "Scans"
        WHERE 
            (:activity_category IS NULL OR activity_category = :activity_category)
        GROUP BY 
            activity_name
        HAVING 
            (:min_frequency IS NULL OR COUNT(activity_name) >= :min_frequency)
            AND (:max_frequency IS NULL OR COUNT(activity_name) <= :max_frequency);
    `, {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            min_frequency: min_frequency || null,
            max_frequency: max_frequency || null,
            activity_category: activity_category || null,
        }
    });

    return results;
}
