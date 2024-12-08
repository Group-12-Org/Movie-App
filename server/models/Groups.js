import { pool } from "../helpers/db.js"

const selectAllGroups = async () => {
    return pool.query(`
        SELECT
            usergroup.group_id,
            usergroup.group_name,
            usergroup.group_owner_id,
            usergroup.group_users_id,
            usergroup.group_introduction
        FROM 
            usergroup
        `)
}

const createGroup = async (group_users_id, group_name, group_owner_id,group_introduction) => {
    return pool.query("INSERT INTO usergroup (group_users_id, group_name, group_owner_id,group_introduction) VALUES ($1, $2, $3,$4) RETURNING *",
        [group_users_id, group_name, group_owner_id,group_introduction]
    )
}

const selectGroupById = async (groupId) => {
    const query = `
        SELECT 
            usergroup.group_id,
            usergroup.group_name,
            usergroup.group_owner_id,
            usergroup.group_users_id,
            usergroup.group_introduction,
            users.users_email AS group_owner_email  -- Add this line to fetch the owner's email
        FROM 
            usergroup
        LEFT JOIN 
            users ON usergroup.group_owner_id = users.users_id
        WHERE 
            group_id = $1;
    `;
    const values = [groupId];
    return pool.query(query, values);
}

const selectGroupMovies = async (groupId) => {
    return pool.query(`
        SELECT
            movie.movie_id,
            movie.movie_title,
            movie.movie_description,
            movie.movie_image
        FROM
            groupmovie
        INNER JOIN
            movie ON groupmovie.groupmovie_movie_id = movie.movie_id
        WHERE
            groupmovie.groupmovie_group_id = $1;
    `, [groupId])
}

// const selectGroupsForUser = async (userId) => {
//     return pool.query(`
//         SELECT
//             usergroup.group_id,
//             usergroup.group_name,
//             usergroup.group_owner_id,
//             usergroup.group_introduction
//         FROM 
//             usergroup
//         JOIN 
//             groupmember ON groupmember.groupmember_group_id = usergroup.group_id
//         WHERE
//             groupmember.groupmember_users_id = $1
//             AND groupmember.groupmember_status = 'active';  -- Only active memberships
//     `, [userId]);
// };

export { selectAllGroups, createGroup, selectGroupById, selectGroupMovies };
