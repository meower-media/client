/**
 * @file Formatting utils
 */

/**
 * formats profile lvl
 * 
 * @returns {string}
 */
export function frmt_proflvl_tostr(lvl) {
    if (lvl == 0) {
        return "User";
    } else if (lvl == 1) {
        return "Low-Level Moderator"
    } else if (lvl == 2) {
        return "Moderator"
    } else if (lvl == 3) {
        return "Admin"
    } else if (lvl == 4) {
        return "Operator"
    }
}