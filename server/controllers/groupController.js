import { selectAllGroups, createGroup, selectGroupById, selectGroupMovies } from "../models/Groups.js";
import { emptyOrRows } from "../helpers/emptyOrRows.js";

const getGroups = async (req, res, next) => {
    try {
        const result = await selectAllGroups()
        return res.status(200).json(emptyOrRows(result))
    } catch (error) {
        return next(error)
    }
}


const addGroup = async (req, res, next) => {
    const { group_users_id, group_name, group_owner_id, group_introduction } = req.body;

    try {
        const result = await createGroup(group_users_id, group_name, group_owner_id, group_introduction);
        return res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error adding group:", error.message);
        return next(error);
    }
};


const getGroupById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await selectGroupById(id);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Group not found" });
        }
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching group:", error.message);
        return next(error);
    }
};

const getGroupMovies = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await selectGroupMovies(id);
        return res.status(200).json(emptyOrRows(result));
    }
    catch (error) {
        console.error("Error fetching group movies:", error.message);
        return next(error);
    }
}

// const getUserGroups = async (req, res, next) => {
//     const { userId } = req.query;  // Get the userId from query params

//     if (!userId) {
//         return res.status(400).json({ error: 'User ID is required' });
//     }

//     try {
//         const result = await selectGroupsForUser(userId);  // Fetch user-specific groups
//         return res.status(200).json(emptyOrRows(result));  // Return the groups data
//     } catch (error) {
//         console.error("Error fetching user-specific groups:", error.message);
//         return next(error);
//     }
// };


export { getGroups, addGroup, getGroupById, getGroupMovies}
